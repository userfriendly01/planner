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
    checked,
    confirmationModalOpts,
    messageType,
    text,
    setAction,
    setChecked,
    setConfirmationModalOpts,
    setSaveResult
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const nNumber = state.userContext.pingIdentity.sub;
  const isSingleSelection = checked.length === 1;
  const isMultiSelection = checked.length > 1;

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

  const updateStateOnResolvedPromises = (fulfilledSkills: any[]) => {
    const skills = state.skillContext.skills.slice();
    const updatedSkills = skills.map(s => {
      let updatedSkill = s;
      fulfilledSkills.forEach(skill => {
        if(s.name === skill.name) {
          updatedSkill = {
            ...s,
            [messageType.variable]: text
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
    const successfulPromiseSkills: any[] = [];
    results.forEach((r, index) => {
      if(r.status === "fulfilled"){
        successfulPromiseSkills.push(checked[index]);
      }
    });
    const rejectedPromiseSkills: any[] = [];
    results.forEach((r, index) => {
      if(r.status === "rejected"){
        rejectedPromiseSkills.push(checked[index]);
      }
    });
    if(rejectedPromiseSkills.length === 0){
      setSaveResult({
        message: "Request Successfully Processed",
        status: ModalOverlayStatuses.SUCCESS
      });
      updateStateOnResolvedPromises(successfulPromiseSkills);
      setTimeout(() => {
        handleCloseConfirmation();
        setChecked([]);
        setAction(ActionTypes.VIEW);
      }, timeouts.MODAL_OVERLAY);
    } else if (successfulPromiseSkills.length === 0){
      setSaveResult({
        message: "Request Failed",
        status: ModalOverlayStatuses.FAIL
      });
    } else {
      let message = "The following skills failed to update: ";
      rejectedPromiseSkills.forEach((skill: any, index: number) => {
        if(index !== rejectedPromiseSkills.length - 1){
          message = message + skill.name + ", ";
        } else {
          message = message + skill.name;
        }
      });
      updateStateOnResolvedPromises(successfulPromiseSkills);
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
      const results = await Promise.allSettled(checked.map((skill: Skill) => {
        return messageType.updateFunction(skill, text, nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = `Are you sure you want to update the ${messageType.name} for ${!isMultiSelection ? checked[0].name : checked.length + " skills?"}`;

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
      const results = await Promise.allSettled(checked.map((skill: Skill) => {
        return messageType.updateFunction(skill, "", nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = `Are you sure you want to delete the ${messageType.name} for ${ !isMultiSelection ? checked[0].name : checked.length + " skills?"}`;

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
            `${action} ${checked.length} ${messageType.name}s`
            : `${action} ${checked[0].name} ${messageType.name}`
          }
        </UserFormButton>
      }
      { checked.length === 0 && <div>No Skills Checked</div> }
    </div>
  );
};

export default SaveButton;