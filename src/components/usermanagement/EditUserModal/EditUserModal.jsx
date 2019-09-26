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
import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "globals";
import {
  mapWorkerFromTwilioWorker,
  myAxios
} from "utils";

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
const loadingStates = {
  fail: "fail",
  saving: "saving",
  success: "success"
};

const EditUserModal = props => {
  const {
    handleClose,
    worker
  } = props;

  const dispatch = useAdminDispatch();
  const state = useAdminState();
  const managers = state.managerContext.managers;

  const [saveUser, setSaveUser] = useState(null);
  const [form, setForm] = useState({
    manager: JSON.stringify(managers.find(m => m.manager_n_number === worker.attributes.manager_n_number)),
    managerChanged: false
  });

  const saveUserClicked = () => {
    setSaveUser(loadingStates.saving);
    const parsedManager = JSON.parse(form.manager);
    const attributes = {
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number
    };

    myAxios
      .post(apiPaths.UPDATE_WORKER_ATTRIBUTES, {
        workerSid: worker.sid,
        attributes
      })
      .then(res => {
        const updatedWorker = res.data;
        dispatch(({
          type: "updateWorker",
          payload: mapWorkerFromTwilioWorker(updatedWorker)
        }));
        setSaveUser(loadingStates.success);
        setTimeout(() => handleClose(), 2000);
      })
      .catch(err => {
        setSaveUser(loadingStates.fail);
        setTimeout(() => setSaveUser(null), 2000);
        console.error("EditUserModal - Failed to update twilio worker", err);
      });
  };

  const formReady = form.manager !== "" && form.managerChanged === true;

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
          <ModalHeader>{"Update User's Manager"}</ModalHeader>
          <CloseRounded onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <ModalText>
          {worker.attributes.full_name}
        </ModalText>
        <ModalText>
          {worker.attributes.n_number}
        </ModalText>
        <CustomSelect
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
            manager: newValue,
            managerChanged: true
          })}
          value={form.manager}
        />
        <ButtonWrapper>
          <CustomButton disabled={!formReady} onClick={saveUserClicked}>
            {"Update"}
          </CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

EditUserModal.propTypes = {
  handleClose: PropTypes.func,
  worker: PropTypes.shape({
    sid: PropTypes.string.isRequired,
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