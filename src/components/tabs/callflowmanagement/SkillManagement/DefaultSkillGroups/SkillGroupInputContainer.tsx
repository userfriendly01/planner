import React from "react";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import { TextField } from "@mui/material";
import {
  UserFormButton
} from "../ClosedFlashMessage/ClosedFlashMessage.Styles";
import {
  ActionTypes,
  SkillGroup
} from "../Skills.Interfaces";
import {
  createSkillGroup,
  deleteSkillGroup,
  updateSkillGroup,
  UpdateSkillGroupBody
} from "services/skillgroup";
import { timeouts } from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import {
  ConfirmationSkillGroupsDiv,
  ConfirmationSkillList
} from "./SkillGroup.Styles";
import { Dropdown } from "components/Dropdown";
import { logger } from "utils/logger";
import { formatErrorMessage } from "utils/_formatUtils";

export const SkillGroupInputContainer = (props: any) => {
  const [ skillGroupName, setSkillGroupName ] = React.useState("");
  const [ errorText, setErrorText ] = React.useState("");
  const [ skillGroupToEditDelete, setSkillGroupToEditDelete ] = React.useState(null);

  const {
    action,
    tableState,
    setTableState,
    confirmationModalOpts,
    setConfirmationModalOpts,
    setSaveResult,
    setAction
  } = props;

  const state = useAdminState();
  const skillState = useSkillState();
  const skillDispatch = useSkillDispatch();
  const skillGroups = skillState.skillGroups.slice();
  const { nNumber } = state.userContext;

  const getSkillGroupOptions = () => {
    return skillGroups.map((skg: SkillGroup) => {
      return {
        label: skg.skill_group_name,
        value: skg.id,
        skills: skg.skills
      };
    });
  };

  const handleOnSave = () => {
    const nameIsInvalid = isSkillGroupNameInvalid();
    if (nameIsInvalid) {
      setErrorText("Skill group names must be unique");
    } else {
      setErrorText("");
      switch(action){
        case ActionTypes.ADD:
          handleAddSkillGroup();
          break;
        case ActionTypes.DELETE:
          handleDeleteSkillGroup();
          break;
        case ActionTypes.EDIT:
          handleEditSkillGroup();
          break;
        default:
          break;
      }
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

  const isSkillGroupNameInvalid = () => {
    let skillGroupNameExists = false;
    if (action !== ActionTypes.DELETE && (skillGroupName?.trim() === "" || !skillGroupName)) {
      return false;
    }
    if (action === ActionTypes.ADD) {
      skillGroupNameExists = !!(skillGroups.find((sg: any) => sg.skill_group_name.toLowerCase() === skillGroupName.trim().toLowerCase()));
    } else if (action === ActionTypes.EDIT) {
      // it can have the same name as itself, but no other skillgroups
      const allOtherSkillgroups = skillGroups.filter((sg: SkillGroup) => sg.id !== skillGroupToEditDelete.value);
      skillGroupNameExists = !!(allOtherSkillgroups.find((sg: SkillGroup) => sg.skill_group_name.toLowerCase() === skillGroupName.trim().toLowerCase()));
    }

    return skillGroupNameExists;
  };

  const handleAddSkillGroup = async () => {
    const onConfirm =async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });

      try {

        const requestBody = {
          skill_group_name: skillGroupName.trim(),
          skill_ids: tableState.selected
        };
        await createSkillGroup(requestBody, skillDispatch);

        logger.info("Successfully created skill group(s)", {
          skillIds: requestBody.skill_ids,
          skillGroupName: skillGroupName.trim(),
          nNumber
        });

        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });

        setTimeout(() => {
          handleCloseConfirmation();
          setAction(null);
        }, timeouts.MODAL_OVERLAY);
      } catch (errors) {
        logger.error("Failed to created skill group(s)", {
          nNumber,
          errors
        });

        if(JSON.stringify(errors).includes("Not all specified Skills exist.")){
          setSaveResult({
            message: `Request Partially Failed ${formatErrorMessage(errors)}`,
            status: ModalOverlayStatuses.PARTIAL_FAIL
          });
        } else {
          setSaveResult({
            message: `Request Failed ${formatErrorMessage(errors)}`,
            status: ModalOverlayStatuses.FAIL
          });
        }
      }
    };

    const confirmationText = <>
      <ConfirmationSkillGroupsDiv>
      Are you sure you want to create the skill group <span style={{ textDecoration: "underline" }}>{skillGroupName}</span> containing the following skills?
        <ConfirmationSkillList>
          {tableState.selected.map((skill: string) => <li key={skill}>{skill}</li>)}
        </ConfirmationSkillList>
      </ConfirmationSkillGroupsDiv>
    </>;

    setConfirmationModalOpts({
      open: true,
      exportButton: false,
      confirmationText,
      callbackMethods: {
        onConfirm: onConfirm,
        handleClose: handleCloseConfirmation
      }
    });
  };

  const handleEditSkillGroup = () => {

    const requestBody: UpdateSkillGroupBody = {
      skill_group_name: skillGroupName.trim()
    };
    let editConfirmationText;

    try {
      const selectedSkills: string[] = tableState.selected.slice();
      requestBody.skill_ids = selectedSkills;

      editConfirmationText = <>
        <ConfirmationSkillGroupsDiv>
        Are you sure you want to edit the skill group <span style={{ textDecoration: "underline" }}>{skillGroupToEditDelete?.label ? skillGroupToEditDelete?.label : ""}?</span>
          {requestBody.skill_group_name ? <>The name of this skill grouping will become <span style={{ textDecoration: "underline" }}>{skillGroupName}</span> </> : ""}
          This skill group will contain the following skills:
          <ConfirmationSkillList>
            {tableState.selected.map((skill: string) => <li key={skill}>{skill}</li>)}
          </ConfirmationSkillList>
        </ConfirmationSkillGroupsDiv>
      </>;
    } catch (errors) {
      logger.error("Failed to update skillGroup", {
        errors,
        nNumber
      });

      if(JSON.stringify(errors).includes("Not all specified Skills exist.")){
        setSaveResult({
          message: `Request Partially Failed ${formatErrorMessage(errors)}`,
          status: ModalOverlayStatuses.PARTIAL_FAIL
        });
      } else {
        setSaveResult({
          message: `Request Failed ${formatErrorMessage(errors)}`,
          status: ModalOverlayStatuses.FAIL
        });
      }
    }

    const onConfirmEdit = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      try {
        await updateSkillGroup(skillGroupToEditDelete.value, requestBody, skillDispatch);

        logger.info("Successfully updated skill group", {
          skillGroupName: skillGroupName.trim(),
          nNumber
        });

        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });

        setTimeout(() => {
          handleCloseConfirmation();
          setAction(null);
        }, timeouts.MODAL_OVERLAY);
      } catch (error) {
        logger.error("Failed to edit skill group(s)", {
          skillGroupName: skillGroupName.trim(),
          nNumber,
          requestBody,
          error
        });

        setSaveResult({
          message: "Request Failed",
          status: ModalOverlayStatuses.FAIL
        });
      }
    };

    setConfirmationModalOpts({
      open: true,
      exportButton: false,
      confirmationText: editConfirmationText,
      callbackMethods: {
        onConfirm: onConfirmEdit,
        handleClose: handleCloseConfirmation
      }
    });
  };

  const handleDeleteSkillGroup = () => {
    const onConfirmDelete = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      try {
        await deleteSkillGroup(skillGroupToEditDelete.value, skillDispatch);

        logger.info("Successfully deleted skill group(s)", {
          skillGroup: skillGroupToEditDelete.value,
          nNumber
        });

        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });

        setTimeout(() => {
          handleCloseConfirmation();
          setAction(null);
        }, timeouts.MODAL_OVERLAY);
      } catch (error) {
        logger.error("Failed to deleted skill grouping", {
          skillGroup: skillGroupToEditDelete.value,
          nNumber,
          error
        });

        setSaveResult({
          message: "Request Failed",
          status: ModalOverlayStatuses.FAIL
        });
      }
    };

    const deleteConfirmationText = <>
      <ConfirmationSkillGroupsDiv>
      You are about to delete the skill group <span style={{ textDecoration: "underline" }}>{skillGroupToEditDelete.label}</span> Doing this will not affect any users,
      it will only impact the skill group options available in the Default Skill Selector when onboarding or editing a Triton user.
      The following skills currently make up the selected skill group:
        <ConfirmationSkillList>
          {skillGroupToEditDelete.skills?.map((skill: string) => <li key={skill}>{skill}</li>)}
        </ConfirmationSkillList>
      </ConfirmationSkillGroupsDiv>
    </>;

    setConfirmationModalOpts({
      open: true,
      exportButton: false,
      confirmationText: deleteConfirmationText,
      callbackMethods: {
        onConfirm: onConfirmDelete,
        handleClose: handleCloseConfirmation
      }
    });
  };

  const generateBottomMsg = () => {
    if (action === ActionTypes.ADD && !tableState.selected.length) {
      return "Select skills to add to the default skill grouping";
    } else if (action === ActionTypes.EDIT) {
      return "Adjust the selected skills to add or remove them from the skill group";
    }
    return "";
  };

  return (
    <>
      {(action === ActionTypes.EDIT || action === ActionTypes.DELETE) && (
        <Dropdown
          options={getSkillGroupOptions()}
          label={`Skill Group to ${action.label}`}
          updateValue={(event: AnalyserNode, val: any) => {
            setSkillGroupToEditDelete(val);
            setSkillGroupName(val.label);
            setTableState({
              ...tableState,
              selected: val.skills
            });
          }}
          styles={{
            margin: "10 0",
            width: "400px"
          }}
        />
      )}
      {action !== ActionTypes.DELETE && (
        <TextField
          onChange={(event: any) => setSkillGroupName(event.target.value)}
          label="Skill Group Name"
          value={skillGroupName}
          helperText={errorText}
          error={isSkillGroupNameInvalid()}
          sx={{
            margin: "10 0",
            width: "400px"
          }}
        />
      )}
      <UserFormButton
        onClick={handleOnSave}
        disabled={
          (action === ActionTypes.ADD && skillGroupName === "") ||
          (action === ActionTypes.ADD && tableState.selected.length < 1) ||
          (action === ActionTypes.DELETE && !skillGroupToEditDelete) ||
          (action === ActionTypes.EDIT && !skillGroupToEditDelete)
        }
      >
        {action.label} Skill Group
      </UserFormButton>
      <div style={{ marginTop: "5px" }}>
        {generateBottomMsg()}
      </div>
    </>
  );
};