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
  addSkillGroup, addSkillGroupsSkill
} from "services/skillgroup";
import {
  Skill, timeouts, ModalOverlayStatuses
} from "globals";
import {
  ConfirmationSkillGroupsDiv,
  ConfirmationSkillList
} from "./SkillGroup.Styles";

const SkillGroupInputContainer = (props: any) => {
  const [ skillGroupName, setSkillGroupName ] = React.useState("");
  const [ skillGroupId, setSkillGroupId ] = React.useState();
  const [ errorText, setErrorText ] = React.useState("");

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

  const handleOnSave = () => {
    const isNameValid = validateSkillGroupName();
    if (!isNameValid) {
      setErrorText("Skill group names must be unique");
    } else {
      setErrorText("");
      switch(action){
        case ActionTypes.ADD:
          handleAddSkillGroup();
          break;
        // Add more to this when we do Edit and Delete functionality
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

  const validateSkillGroupName = () => {
    if (action === ActionTypes.ADD) {
      const skillGroupExists = skillGroups.find((sg: any) => sg.skillGroupNme.toLowerCase() === skillGroupName.toLowerCase());
      return !skillGroupExists;
    }
    return true;
  };

  const handleAddSkillGroup = async () => {

    const onConfirm =async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      try {
        const addGroupNameResponse = await addSkillGroup(skillGroupName);
        setSkillGroupId(addGroupNameResponse.insertId);
        const results = await Promise.allSettled(tableState.selected.map((skill: Skill) => {
          return addSkillGroupsSkill(addGroupNameResponse.insertId, skill.ctmSkillId);
        }));
        handleResults(results);
      } catch (err) {
        console.error("Unable to add skill grouping");
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
      updateStateOnResolvedPromises(successfulPromiseSkills);
      setTimeout(() => {
        handleCloseConfirmation();
        setAction(null);
      }, timeouts.MODAL_OVERLAY);
    } else if (successfulPromiseSkills.length === 0){
      setSaveResult({
        message: "Skill Grouping was created, but all selected skills failed to add",
        status: ModalOverlayStatuses.FAIL
      });
    } else {
      let message = "Skill group was created, but the following skills failed to be added: ";
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
    const skills = state.skillContext.skills.slice();
    const updatedSkills = skills.map(s => {
      let updatedSkill = s;
      fulfilledSkills.forEach(skill => {
        if(s.name === skill.name) {
          updatedSkill = {
            ...s,
            ctmSkillGroups: [...s.ctmSkillGroups, {
              skillGroupId,
              skillGroupNme: skillGroupName,
              skills: tableState.selected
            }]
          };
        }
      });
      return updatedSkill;
    });
    dispatch({
      type: "updateSkills",
      payload: updatedSkills
    });
    // reload skillGroups so the default skills dropdown will have the new one
    dispatch({
      type: "loadSkillGroups",
      payload: updatedSkills
    });
    setTableState({
      ...tableState,
      selected: []
    });
  };

  return (
    <>
      <TextField
        onChange={(event: any) => setSkillGroupName(event.target.value)}
        label="Skill Group Name"
        value={skillGroupName}
        helperText={errorText}
        error={errorText !== ""}
        sx={{
          margin: "10 0",
          width: "400px"
        }}
      />
      <UserFormButton
        onClick={handleOnSave}
        disabled={skillGroupName === "" || tableState.selected.length < 1}
      >Save Skill Group</UserFormButton>
      <div>
        Select skills to add to default skill grouping
      </div>
    </>
  );
};



export default SkillGroupInputContainer;