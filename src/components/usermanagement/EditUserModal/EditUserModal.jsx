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
  const dispatch = useAdminDispatch();
  const {
    managerContext: {
      managers
    }
  } = useAdminState();

  const [form, setForm] = useState({
    nNumber: worker.attributes.n_number,
    manager: "",
    workerSid: worker.sid,
    sidLookupError: null
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveStatus: "saving",
    saveUser: false
  });

  const updateUser = () => {
    console.log(form);
    updateLoading({
      ...loading,
      saveStatus: "saving",
      saveUser: true
    });
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
      .then(() => {
        dispatch({
          type: "editWorker",
          payload: {
            id: form.nNumber,
            sid: workerSid,
            attributes
          }
        });
        updateLoading({
          ...loading,
          saveStatus: "success",
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, 2000);
      })
      .catch(err => {
        updateLoading({
          ...loading,
          saveStatus: "fail",
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, 2000);
        console.log(err);
      });
  };

  useEffect(() => {
    if(loading.saveStatus === "success"){
      setTimeout(() => { handleClose(false); }, 2000);
    }
  }, [loading.saveStatus]);

  const formReady = form.manager !== "";

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ?
          <ModalOverlay
            status={loading.saveStatus}
            message={loading.saveStatus === "success" ? "User updated successfully" : "Failed to add user"}
          /> : null}
        <ModalHeader>
          {"Edit User"}
        </ModalHeader>
        <ModalText>
          {worker.attributes.full_name}
        </ModalText>
        <ModalText>
          {worker.attributes.n_number}
        </ModalText>
        <CustomSelect
          label={"Manager"}
          labelWidth={65}
          optionsList={managers}
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
          <CustomButton disabled={!formReady} onClick={updateUser}>
            {"Update"}
          </CustomButton>
          <CustomButton onClick={() => handleClose(false)}>
            {"Close"}
          </CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

EditUserModal.propTypes = {
  handleClose: PropTypes.func,
  worker: PropTypes.shape({
    sid: PropTypes.string,
    attributes: PropTypes.shape({
      full_name: PropTypes.string,
      manager_n_number: PropTypes.string,
      n_number: PropTypes.string
    })
  })
};

export default EditUserModal;