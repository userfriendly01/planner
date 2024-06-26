import React from "react";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import {
  ModalOverlayStatuses
} from "globals/interfaces";
import { timeouts } from "globals";
import { SaveButtonProps } from "../ClosedFlashMessage.Interfaces";
import {
  ConfirmationDiv,
  ConfirmationExportDiv,
  UserFormButton
} from "../ClosedFlashMessage.Styles";
import {
  ActionTypes, Skill
} from "../../Skills.Interfaces";

export const SaveButton = (props: SaveButtonProps) => {
  const {
    action,
    confirmationModalOpts,
    messageType,
    tableState,
    text,
    setAction,
    setConfirmationModalOpts,
    setSaveResult,
    setTableState
  } = props;

  const state = useAdminState();
  const skillState = useSkillState();
  const skillDispatch = useSkillDispatch();
  const { nNumber } = state.userContext;
  const isSingleSelection = tableState.selected.length === 1;
  const isMultiSelection = tableState.selected.length > 1;
  const selectedSkills = tableState.selected.map((ss: string) => skillState.skills.find((s: Skill) => s.name === ss));

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

  const handleEdit = () => {
    const onConfirm = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      const results = await Promise.allSettled(selectedSkills.map((skill: Skill) => {
        return messageType.updateFunction(skill, text, nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = <ConfirmationDiv>
      {`Are you sure you want to update the ${messageType.name} for ${!isMultiSelection ? tableState.selected[0] + "?" : tableState.selected.length + " skills?"}`}
      {selectedSkills.some(s => s[messageType.variable]) &&
        <ConfirmationExportDiv>
          You will be overriding existing {messageType.name}s. Click the export button to save this data for future use.
        </ConfirmationExportDiv>
      }
    </ConfirmationDiv>;

    setConfirmationModalOpts({
      open: true,
      exportButton: true,
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
      const results = await Promise.allSettled(selectedSkills.map((skill: Skill) => {
        return messageType.updateFunction(skill, "", nNumber);
      }));
      handleResults(results);
    };

    const confirmationText = <ConfirmationDiv>
      {`Are you sure you want to delete the ${messageType.name} for ${!isMultiSelection ? tableState.selected[0] + "?" : tableState.selected.length + " skills?"}`}
      {selectedSkills.some(s => s[messageType.variable]) &&
      <ConfirmationExportDiv>
        You will be deleting existing {messageType.name}s. Click the export button to save this data for future use.
      </ConfirmationExportDiv>
      }
    </ConfirmationDiv>;

    setConfirmationModalOpts({
      open: true,
      exportButton: true,
      confirmationText,
      callbackMethods: {
        onConfirm: onConfirm,
        handleClose: handleCloseConfirmation
      }
    });
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

  const handleResults = (results: any[]) => {
    const successfulPromiseSkills: any[] = [];
    const rejectedPromiseSkills: any[] = [];

    results.forEach((r, index) => {
      if(r.status === "fulfilled"){
        successfulPromiseSkills.push(tableState.selected[index]);
      }
      if(r.status === "rejected"){
        rejectedPromiseSkills.push(tableState.selected[index]);
      }
    });

    if(rejectedPromiseSkills.length === 0){
      setSaveResult({
        message: "Request Successfully Processed",
        status: ModalOverlayStatuses.SUCCESS
      });
      setTableState({
        ...tableState,
        selected: []
      });
      updateStateOnResolvedPromises(successfulPromiseSkills);
      setTimeout(() => {
        handleCloseConfirmation();
        setAction(null);
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

  const updateStateOnResolvedPromises = (fulfilledSkills: Skill[])=> {
    const skills = skillState.skills.slice();
    const updatedText = action === ActionTypes.DELETE ? "" : text;
    const updatedSkills = skills.map((s: any) => {
      let updatedSkill = s;
      fulfilledSkills.forEach(skill => {
        if(s.name === skill.name) {
          updatedSkill = {
            ...s,
            [messageType.variable]: updatedText
          };
        }
      });
      return updatedSkill;
    });

    skillDispatch({
      type: "LOAD_SKILLS",
      payload: updatedSkills
    });
  };

  return (
    <div>
      {(isSingleSelection || isMultiSelection) && action && action !== ActionTypes.VIEW &&
        <UserFormButton onClick={handleOnSave}>
          { isMultiSelection ?
            `${action.label} ${tableState.selected.length} ${messageType.name}s`
            : `${action.label} ${tableState.selected[0]} ${messageType.name}`
          }
        </UserFormButton>
      }
      { tableState.selected.length === 0 && <div>**Select a skill to move forward**</div> }
    </div>
  );
};