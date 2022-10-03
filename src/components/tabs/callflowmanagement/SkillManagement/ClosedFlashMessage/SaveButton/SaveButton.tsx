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
import {
  SaveButtonProps,
  UserFormButton
} from "../";
import {
  ActionTypes,
  ConfirmationExportDiv,
  ExportButton
} from "../../";

const SaveButton = (props: SaveButtonProps) => {
  const {
    action,
    checked,
    confirmationModalOpts,
    propertyValue,
    text,
    setAction,
    setChecked,
    setConfirmationModalOpts,
    setSaveResult
  } = props;

  console.log("**MEssage type!", propertyValue);

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const nNumber = state.userContext.pingIdentity.sub;
  const isSingleSelection = checked.length === 1;
  const isMultiSelection = checked.length > 1;

  const handleOnSave = () => {
    switch(action){
      case ActionTypes[2]:
        handleEdit();
        break;
      case ActionTypes[3]:
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
      const results = await Promise.allSettled(checked.map((skill: Skill) => {
        return propertyValue.updateFunction(skill, text, nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = <div>
      {`Are you sure you want to update the ${propertyValue.name} for ${!isMultiSelection ? checked[0].name + "?" : checked.length + " skills?"}`}
      {checked.some(s => s[propertyValue.variable]) &&
        <ConfirmationExportDiv>
          You will be overridding existing {propertyValue.name}&apos;s. Click the export button to save this data for future use.
          <ExportButton checked={checked} />
        </ConfirmationExportDiv>
      }
    </div>;

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
        return propertyValue.updateFunction(skill, "", nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = `Are you sure you want to delete the ${propertyValue.name} for ${ !isMultiSelection ? checked[0].name : checked.length + " skills?"}`;

    setConfirmationModalOpts({
      open: true,
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
        successfulPromiseSkills.push(checked[index]);
      }
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
        setAction(ActionTypes[0]);
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

  const updateStateOnResolvedPromises = (fulfilledSkills: any[]) => {
    const skills = state.skillContext.skills.slice();
    const updatedSkills = skills.map(s => {
      let updatedSkill = s;
      fulfilledSkills.forEach(skill => {
        if(s.name === skill.name) {
          updatedSkill = {
            ...s,
            [propertyValue.variable]: text
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

  return (
    <div>
      {(isSingleSelection || isMultiSelection) && action !== ActionTypes[0] &&
        <UserFormButton onClick={handleOnSave}>
          { isMultiSelection ?
            `${action.label} ${checked.length} ${propertyValue.name}s`
            : `${action.label} ${checked[0].name} ${propertyValue.name}`
          }
        </UserFormButton>
      }
      { checked.length === 0 && <div>No Skills Checked</div> }
    </div>
  );
};

export default SaveButton;