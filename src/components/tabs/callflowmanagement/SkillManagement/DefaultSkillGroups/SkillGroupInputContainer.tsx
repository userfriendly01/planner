import React from "react";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import { TextField } from "@mui/material";
import {
  UserFormButton
} from "../ClosedFlashMessage/ClosedFlashMessage.Styles";
import { ActionTypes } from "../Skills.Interfaces";
import {
  addSkillGroup,
  deleteSkillGroup,
  updateSkillGroup
} from "services";
import {
  Skill, timeouts, ModalOverlayStatuses
} from "globals";
import {
  ConfirmationSkillGroupsDiv,
  ConfirmationSkillList
} from "./SkillGroup.Styles";
import { Dropdown } from "components";
import _ from "lodash";
import { getSkills } from "authentication";

// TODO: Update teh search filter for skillgroups?

const SkillGroupInputContainer = (props: any) => {
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
  const dispatch = useAdminDispatch();
  const skillGroups = state.skillContext.skillGroups.slice();
  const skills = state.skillContext.skills.slice();

  const getSkillGroupOptions = () => {
    return skillGroups.map((skg: any) => {
      return {
        label: skg.skillGroupNme,
        value: skg.skillGroupId,
        skills: skg.skills.map((sk: any) => sk.name)
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
    if (action !== ActionTypes.DELETE && (skillGroupName.trim() === "" || !skillGroupName)) {
      return false;
    }
    if (action === ActionTypes.ADD) {
      skillGroupNameExists = skillGroups.find((sg: any) => sg.skillGroupNme.toLowerCase() === skillGroupName.trim().toLowerCase()) ? true : false;
    } else if (action === ActionTypes.EDIT) {
      // it can have the same name as itself, but no other skillgroups
      const allOtherSkillgroups = skillGroups.filter(sg => sg.skillGroupId !== skillGroupToEditDelete.value);
      skillGroupNameExists = allOtherSkillgroups.find(sg => sg.skillGroupNme.toLowerCase() === skillGroupName.trim().toLowerCase()) ? true : false;
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
        const skillIds = tableState.selected.map((skill: Skill) => skill.ctmSkillId);

        const requestBody: any = {
          skill_group_nme: skillGroupName.trim(),
          skillIds
        };
        console.log("$$$$$$$ requestBody", requestBody);
        const addGroupNameResponse = await addSkillGroup(requestBody);
        console.log("addGroupNameResponse", addGroupNameResponse);

        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });

        // refresh skill state
        await getSkills(dispatch);

        setTimeout(() => {
          handleCloseConfirmation();
          setAction(null);
          // setTableState({
          //   ...tableState,
          //   selected: []
          // });
        }, timeouts.MODAL_OVERLAY);
      } catch (err) {
        console.error("Error: Unable to add skill grouping");
        setSaveResult({
          message: "Request Failed",
          status: ModalOverlayStatuses.FAIL
        });
      }
    };

    const confirmationText = <>
      <ConfirmationSkillGroupsDiv>
      Are you sure you want to create the skill group <strong>{skillGroupName}</strong> containing the following skills?
        <ConfirmationSkillList>
          {tableState.selected.map((skill: Skill) => <li key={skill.name}>{skill.name}</li>)}
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
    const requestBody: any = {};

    const onConfirmEdit = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      try {
        await updateSkillGroup(skillGroupToEditDelete.value, requestBody);
        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });
        // refresh skill state
        await getSkills(dispatch);
        setTimeout(() => {
          handleCloseConfirmation();
          setAction(null);
          // setTableState({
          //   ...tableState,
          //   selected: []
          // });
        }, timeouts.MODAL_OVERLAY);
      } catch (err) {
        console.error("Error while editing skill grouping", requestBody, err);
        setSaveResult({
          message: "Request Failed",
          status: ModalOverlayStatuses.FAIL
        });
      }
    };

    try {
      // TODO: Is this really necessary?
      // the contact manager endpoint will just update with the same info if we just add the skillgroupname and skill ids to every body

      // determine if name changed. if so, add skillGroupName to requestbody
      if (skillGroupName !== skillGroupToEditDelete.label) {
        requestBody.skillGroupName = skillGroupName.trim();
      }

      // determine if skills in the skill group changed
      let skillsHaveChanged = false;
      const existingSkillInSkillGroup: number[] = skills.filter(sk => sk.ctmSkillGroups.find(skg => skg.skillGroupId === skillGroupToEditDelete.value))?.slice().map(sk => sk.ctmSkillId);
      const selectedSkills: number[] = tableState.selected.slice().map((sk: Skill) => sk.ctmSkillId);

      // check if the selected skills are different from the existing
      const difference = _.xor(existingSkillInSkillGroup, selectedSkills);

      if (difference.length > 0) {
        skillsHaveChanged = true;
      }

      if (skillsHaveChanged) {
        requestBody.skillIds = selectedSkills;
      }

      const editConfirmationText = <>
        <ConfirmationSkillGroupsDiv>
        Are you sure you want to edit the skill group <strong>{skillGroupToEditDelete.label}</strong> ?
          {requestBody.skillGroupName ? `The name of this skill grouping will become ${skillGroupName}` : ""}
          {skillsHaveChanged && <>
          This skill group will now contain the following skills:
            <ConfirmationSkillList>
              {tableState.selected.map((skill: Skill) => <li key={skill.name}>{skill.name}</li>)}
            </ConfirmationSkillList>
          </>}
        </ConfirmationSkillGroupsDiv>
      </>;

      setConfirmationModalOpts({
        open: true,
        exportButton: false,
        confirmationText: editConfirmationText,
        callbackMethods: {
          onConfirm: onConfirmEdit,
          handleClose: handleCloseConfirmation
        }
      });

      console.log("LOOK AT MEEEEE", requestBody);
    } catch (err) {
      console.error("Failed to update skillGroup", err?.message ? err.message : err);
      setSaveResult({
        message: "Request Failed",
        status: ModalOverlayStatuses.FAIL
      });
    }
  };

  const handleDeleteSkillGroup = () => {
    const onConfirmDelete = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      try {
        await deleteSkillGroup(skillGroupToEditDelete.value);
        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });

        // refresh skill state
        await getSkills(dispatch);

        setTimeout(() => {
          handleCloseConfirmation();
          setAction(null);
          // setTableState({
          //   ...tableState,
          //   selected: []
          // });
        }, timeouts.MODAL_OVERLAY);
      } catch (err) {
        console.error("Unable to add skill grouping", err);
        setSaveResult({
          message: "Request Failed",
          status: ModalOverlayStatuses.FAIL
        });
      }
    };

    const deleteConfirmationText = <>
      <ConfirmationSkillGroupsDiv>
      You are about to delete the skill group <strong>{skillGroupToEditDelete.label}</strong> Doing this will not affect any users,
      it will only impact the skill group options available in the Default Skill Selector when onboarding or editing a Triton user.
      The following skills currently make up the selected skill group:
        <ConfirmationSkillList>
          {skillGroupToEditDelete.skills.map((skill: string) => <li key={skill}>{skill}</li>)}
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
    if (action === ActionTypes.ADD) {
      return "Select skills to add to the default skill grouping";
    } else if (action === ActionTypes.EDIT) {
      return "Adjust the selected skills to add or remove them from the skill group";
    }
    return "";
  };

  return (
    <>
      {action !== ActionTypes.ADD && (
        <Dropdown
          options={getSkillGroupOptions()}
          label={`Skill Group to ${action.label}`}
          updateValue={(event: AnalyserNode, val: any) => {
            setSkillGroupToEditDelete(val);
            setSkillGroupName(val.label);
            setTableState({
              ...tableState,
              selected: skills.filter(sk => sk.ctmSkillGroups.find(skg => skg.skillGroupId === val.value))
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
          (action === ActionTypes.DELETE && !skillGroupToEditDelete)
        }
      >{action.label} Skill Group</UserFormButton>
      <div>
        {generateBottomMsg()}
      </div>
    </>
  );
};



export default SkillGroupInputContainer;