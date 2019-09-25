import { CloseRounded } from "@material-ui/icons";
import {
  CustomButton,
  CustomSelect,
  ModalHeader,
  ModalOverlay,
  PaperContainer
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  apiPaths
} from "globals";
import PropTypes from "prop-types";
import React, {
  useState,
  useEffect
} from "react";
import styled from "styled-components";
import { theme } from "globals";
import { myAxios } from "utils";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const HeaderAndCloseButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftDiv = styled.div`
  width: 1em;
`;

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ModalText = styled.div`
  align-self: center;
  color: ${theme.textColor};
  font-family: 'Roboto', sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  letter-spacing: 0rem;l
  line-height: 1.30357em;
  margin: 2% 2% 0% 2%;
`;

const EditUserModal = props => {
  const {
    handleClose,
    worker
  } = props;

  const defaultManager = `${worker.attributes.manager_first_name} ${worker.attributes.manager_last_name}`;
  const loadingStates = {
    success: "success",
    fail: "fail",
    loading: "loading",
    userNotFound: "user-not-found"
  };

  const dispatch = useAdminDispatch();
  const state = useAdminState();

  const [saveUser, setSaveUser] = useState(null);
  const [form, setForm] = useState({
    nNumber: worker.attributes.n_number,
    manager: "",
    workerSid: "",
    sidLookupError: null
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveStatus: "saving",
    saveUser: false
  });

  useEffect(() => {
    if (form.nNumber !== "") {
      const nNumber = form.nNumber;
      updateLoading({
        ...loading,
        lookupUser: true
      });
      myAxios
        .get(apiPaths.GET_WORKERS_BY_ID + nNumber)
        .then(res => {
          if (res.data.length !== 0) {
            console.log(res.data.sid);
            setForm({
              ...form,
              sidLookupError: "There was no error",
              workerSid: res.data.sid
            });
          } else {
            setForm({
              ...form,
              workerSid: null,
              lookupError: "Worker Sid not found"
            });
          }
        })
        .catch(err => {
          setForm({
            ...form,
            workerSid: null,
            lookupError: `Error retrieving worker Sid: ${err.message}`
          });
        });
    }
  }, [form.nNumber]);

  const saveUserClicked = () => {
    console.log("form:", form);
    setSaveUser(loadingStates.loading);
    const parsedManager = JSON.parse(form.manager);
    const attributes = {
      ...worker.attributes,
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number
    };
    const workerSid = form.workerSid;

    myAxios
      .post(apiPaths.EDIT_WORKER, {
        workerSid,
        attributes
      })
      .then(res => {
        dispatch({
          type: "editWorker",
          payload: {
            id: form.nNumber,
            sid: workerSid,
            attributes
          }
        });
        setSaveUser(loadingStates.success);
        // this dispatch hasn't been implemented yet - it does nothing
        dispatch(({
          type: "editWorker",
          payload: { worker }
        }));
        setTimeout(() => handleClose(), 2000);
        console.log(res);
      })
      .catch(err => {
        setSaveUser(loadingStates.fail);
        setTimeout(() => handleClose(), 2000);
        console.log(err);
      });
  };

  // I deleted a useEffect here!! Horray! :party_parrot:

  const formReady = form.manager !== "";

  return (
    <ModalContainer>
      <PaperContainer>
        {saveUser ?
          <ModalOverlay
            status={saveUser}
            message={saveUser === "success" ? "User updated successfully" : "Failed to update user"}
          /> : null}
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <ModalHeader>{"Add a Manager"}</ModalHeader>
          <CloseRounded onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <ModalText>
          {worker.attributes.full_name}
        </ModalText>
        <ModalText>
          {worker.attributes.n_number}
        </ModalText>
        <CustomSelect
          label={defaultManager}
          labelWidth={65}
          optionsList={state.managerContext.managers}
          optionsDisplayFunc={option => {
            return {
              display: `${option.manager_first_name} ${option.manager_last_name}`,
              key: option.manager_n_number,
              value: JSON.stringify(option)
            };
          }}
          updateValue={newValue => setForm({
            ...form,
            manager: newValue
          })}
          value={form.manager}
        />
        <ButtonWrapper>
          <CustomButton disabled={!formReady} onClick={saveUserClicked}>
            {"Update"}
          </CustomButton>
          {/* <CustomButton onClick={() => handleClose(false)}>
            {"Close"}
          </CustomButton> */}
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

EditUserModal.propTypes = {
  handleClose: PropTypes.func,
  worker: PropTypes.shape({
    attributes: PropTypes.shape({
      full_name: PropTypes.string,
      manager_first_name: PropTypes.string,
      manager_last_name: PropTypes.string,
      manager_n_number: PropTypes.string,
      n_number: PropTypes.string
    })
  })
};

export default EditUserModal;