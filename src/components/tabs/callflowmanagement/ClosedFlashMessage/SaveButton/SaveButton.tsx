import React from "react";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import {
  ModalOverlayStatuses,
  Skill,
  timeouts
} from "globals";
import { UserFormButton } from "../ClosedFlashMessage.Styles";
import {
  ActionTypes,
  SaveButtonProps
} from "../ClosedFlashMessage.Interfaces";

const SaveButton = (props: SaveButtonProps) => {
  const {
    action,
    selected,
    setSaveResult,
    confirmationModalOpts,
    messageType,
    setConfirmationModalOpts,
    setSelected,
    text
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const nNumber = state.userContext.pingIdentity.sub;
  const isSingleSelection = selected.length === 1;
  const isMultiSelection = selected.length > 1;

  const handleOnSave = () => {
    switch(action){
      case ActionTypes.EDIT:
        handleEdit();
        break;
      case ActionTypes.DELETE:
        handleDelete();
        break;
      default:
        break;
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationModalOpts({
      ...confirmationModalOpts,
      open: false
    });
    setSaveResult({
      message: "",
      status: null
    });
  };

  const updateStateOnResolvedPromises = (promises: any[]) => {
    const skills = state.skillContext.skills.slice();
    const updatedSkills = skills.map(s => {
      let updatedSkill = s;
      promises.forEach(promise => {
        const data = JSON.parse(promise.value.config.data);
        const skillName = data.skill;
        const message = data[messageType.variable];
        if(s.name === skillName) {
          updatedSkill = {
            ...s,
            [messageType.variable]: message
          };
        }
      });
      return updatedSkill;
    });
    dispatch({
      type: "updateSkills",
      payload: updatedSkills
    });
  };

  const handleResults = (results: any[]) => {
    console.log("Handle Results", results);
    const successfulPromises = results.filter(r => r.status === "fulfilled");
    const rejectedPromises = results.filter(r => r.status === "rejected");
    if(rejectedPromises.length === 0){
      setSaveResult({
        message: "Request Successfully Processed",
        status: ModalOverlayStatuses.SUCCESS
      });
      updateStateOnResolvedPromises(successfulPromises);
      setTimeout(() => {
        handleCloseConfirmation();
        setSelected([]);
      }, timeouts.MODAL_OVERLAY);
    } else if (successfulPromises.length === 0){
      setSaveResult({
        message: "Request Failed",
        status: ModalOverlayStatuses.FAIL
      });
    } else {
      let message = "The following skills failed to update: ";
      rejectedPromises.forEach((promise: any, index: number) => {
        const data = JSON.parse(promise.value.config.data);
        if(index !== rejectedPromises.length - 1){
          message = message + data.skill + ", ";
        } else {
          message = message + data.skill;
        }
      });
      updateStateOnResolvedPromises(successfulPromises);
      setSaveResult({
        message,
        status: ModalOverlayStatuses.PARTIAL_FAIL
      });
    }
  };

  const handleEdit = () => {
    const onConfirm = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      const results = await Promise.allSettled(selected.map((skill: Skill) => {
        return messageType.updateFunction(skill, text, nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = `Are you sure you want to update the ${messageType}
    for ${ !isMultiSelection ? selected[0].name : selected.length + " skills?"}`;

    setConfirmationModalOpts({
      open: true,
      confirmationText,
      callbackMethods: {
        onConfirm: onConfirm,
        handleClose: handleCloseConfirmation
      }
    });
  };

  const handleDelete = () => {
    const onConfirm = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      const results = await Promise.allSettled(selected.map((skill: Skill) => {
        return messageType.updateFunction(skill, "", nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = `Are you sure you want to delete the ${messageType}
    for ${ !isMultiSelection ? selected[0].name : selected.length + " skills?"}`;

    setConfirmationModalOpts({
      open: true,
      confirmationText,
      callbackMethods: {
        onConfirm: onConfirm,
        handleClose: handleCloseConfirmation
      }
    });
  };

  return (
    <div>
      {(isSingleSelection || isMultiSelection) && action !== ActionTypes.VIEW &&
        <UserFormButton onClick={handleOnSave}>
          { isMultiSelection ?
            `${action} ${selected.length} ${messageType}s`
            : `${action} ${selected[0].name} ${messageType}`
          }
        </UserFormButton>
      }
    </div>
  );
};

export default SaveButton;