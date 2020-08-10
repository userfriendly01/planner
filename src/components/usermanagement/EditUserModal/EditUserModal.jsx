import { CloseRounded } from "@material-ui/icons";
import {
  OutlinedSelect,
  DefaultSkillSelector,
  ModalExtension,
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  apiPaths,
  extensionMatcher
} from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import {
  getValidSkillsObject,
  mapWorkerFromTwilioWorker,
  myAxios,
  sortManagersByName
} from "utils";

const CenteredH2 = styled.h2`
  align-self: center;
`;

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

const StyledCloseRounded = styled(CloseRounded)`
  cursor: pointer;
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
    defaultSkills: getValidSkillsObject(worker.attributes.default_skills),
    defaultSkillsUpdated: false,
    manager: JSON.stringify(managers.find(m => m.manager_n_number === worker.attributes.manager_n_number)),
    managerUpdated: false,
    extensionUpdated: false,
    extensionValid: extensionMatcher.test(worker.attributes.extension)
  });

  const saveUserClicked = () => {
    setSaveUser(loadingStates.saving);
    const attributes = {};
    if (form.defaultSkillsUpdated) {
      attributes.default_skills = form.defaultSkills;
    }
    if (form.managerUpdated) {
      const parsedManager = JSON.parse(form.manager);
      attributes.manager_first_name = parsedManager.manager_first_name;
      attributes.manager_last_name = parsedManager.manager_last_name;
      attributes.manager_n_number = parsedManager.manager_n_number;
    }
    if (form.extensionUpdated) {
      attributes.extension = extension;
    }
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

  const setDefaultSkills = updatedDefaultSkills => setForm({
    ...form,
    defaultSkills: updatedDefaultSkills,
    defaultSkillsUpdated: true
  });

  const setManager = newValue => setForm({
    ...form,
    manager: newValue,
    managerUpdated: true
  });

  const [extension, setExtension] = useState(worker.attributes.extension);
  const clearExtension = () => {
    setForm({
      ...form,
      extensionValid: false,
      extensionUpdated: false
    });
    setExtension("");
  };

  const formUpdated = (form.defaultSkillsUpdated || form.managerUpdated || form.extensionUpdated);
  const formValid = form.manager !== "";
  const formReady = formUpdated && formValid;

  let overlayMessage = "Saving";
  if (saveUser === "success") {
    overlayMessage = "User updated successfully";
  } else if (saveUser === "fail") {
    overlayMessage = "Failed to update user";
  }

  return (
    <ModalContainer>
      <PaperContainer>
        {saveUser ?
          <ModalOverlay
            message={overlayMessage}
            modal={true}
            status={saveUser}
          /> : null}
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <h1>Update User</h1>
          <StyledCloseRounded onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <CenteredH2>{worker.attributes.full_name}</CenteredH2>
        <CenteredH2>{worker.attributes.n_number}</CenteredH2>
        <OutlinedSelect
          label={"Manager"}
          labelWidth={65}
          optionsList={managers.sort(sortManagersByName)}
          optionsDisplayFunc={option => {
            return {
              display: `${option.manager_first_name} ${option.manager_last_name}`,
              key: option.manager_n_number,
              value: JSON.stringify(option)
            };
          }}
          updateValue={setManager}
          value={form.manager}
        />
        <ModalExtension
          clearExtension={clearExtension}
          disabled={form.extensionValid && extensionMatcher.test(extension)}
          extension={extension}
          form={form}
          isEditExisting={extensionMatcher.test(worker.attributes.extension)}
          originalValue={worker.attributes.extension}
          setForm={setForm}
          updateValue={newValue => setExtension(newValue)}
        />
        <DefaultSkillSelector defaultSkills={form.defaultSkills} setDefaultSkills={setDefaultSkills}/>
        <ButtonWrapper>
          <StyledButton disabled={!formReady} onClick={saveUserClicked}>Update</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

EditUserModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  worker: PropTypes.shape({
    sid: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      default_skills: PropTypes.object,
      full_name: PropTypes.string,
      manager_first_name: PropTypes.string,
      manager_last_name: PropTypes.string,
      manager_n_number: PropTypes.string,
      n_number: PropTypes.string,
      extension: PropTypes.string
    }).isRequired
  })
};

export default EditUserModal;