import {
  CallflowWrapper,
  MessageWrapper
} from "./CallFlowManagement.Styles";
import {
  SkillProfile,
  TableState
} from "./CallFlowManagement.Interfaces";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import {
  CallFlowConfirmationModal,
  ActionContainer,
  SkillsContainer
} from "components";
import { useAdminState } from "context";
import {
  Skill,
  TritonProfile
} from "globals";
import React from "react";
import { getAuthenticationProfileTemplates } from "authentication";
import { filterSkillsByName } from "utils";
import { Modal } from "@mui/material";

const CallFlowManagementSkills = () => {

  const defaultTableState: TableState = {
    searchBy: "",
    selected: [],
    profiles: [],
    closedFilter: false,
    flashFilter: false,
    filteredList: []
  };

  const defaultConfirmationModalOpts: ConfirmationModalOptsProps = {
    open: false,
    exportButton: false,
    confirmationText: "",
    callbackMethods: {
      onConfirm: null,
      handleClose: null
    }
  };

  const defaultSaveResult: SaveResultProps = {
    status: null,
    message: null
  };

  const state = useAdminState();
  const tritonProfile = state.userContext.authenticationProfiles.find((p: any) => p.name === getAuthenticationProfileTemplates().TRITON.name);
  const isAdmin = tritonProfile.isAdmin;
  const userProfileId = tritonProfile.profileId;
  const [ tableState, setTableState ] = React.useState(defaultTableState);
  const [ confirmationModalOpts, setConfirmationModalOpts ] = React.useState(defaultConfirmationModalOpts);
  const [ saveResult, setSaveResult ] = React.useState(defaultSaveResult);
  console.log("Filtered State: ", tableState);

  React.useEffect(() => {
    let filteredList = state.skillContext.skills.slice();
    //filter by profile
    if(isAdmin) {
      if(tableState.profiles.length > 0){
        filteredList = filteredList.filter((skill: Skill) => {
          let shouldReturn = false;
          skill.profiles.forEach((p: SkillProfile) => {
            if(tableState.profiles.some((sp: TritonProfile) => sp.profile_id === p.profileId)){
              shouldReturn = true;
            }
          });
          return shouldReturn;
        });
      }
    } else {
      filteredList = filteredList.filter((skill: Skill) => {
        let shouldReturn = false;
        if(skill.profiles.some((sp: SkillProfile) => sp.profileId === userProfileId)){
          shouldReturn = true;
        }
        return shouldReturn;
      });
    }

    //filter by searchBy
    const trimmedSearch = tableState.searchBy.trim();
    filteredList = filteredList.filter((skill: Skill) => filterSkillsByName(skill, trimmedSearch));

    //filter by closed
    if(tableState.closedFilter){
      filteredList = filteredList.filter((skill: Skill) => skill.closedMessage);
    }
    //filter by flash
    if(tableState.flashFilter){
      filteredList = filteredList.filter((skill: Skill) => skill.flashMessage);
    }

    setTableState({
      ...tableState,
      filteredList
    });
  }, [tableState.searchBy, tableState.profiles, tableState.closedFilter, tableState.flashFilter, state.skillContext.skills]);

  return (
    <CallflowWrapper>
      <MessageWrapper>
        <SkillsContainer
          tableState={tableState}
          setTableState={setTableState}
        />
        <ActionContainer
          confirmationModalOpts={confirmationModalOpts}
          tableState={tableState}
          setConfirmationModalOpts={setConfirmationModalOpts}
          setSaveResult={setSaveResult}
          setTableState={setTableState}
        />
      </MessageWrapper>
      <Modal open={confirmationModalOpts.open}>
        <>
          <CallFlowConfirmationModal
            tableState={tableState}
            confirmationModalOpts={confirmationModalOpts}
            saveResult={saveResult}
          />
        </>
      </Modal>
    </CallflowWrapper>
  );
};

export default CallFlowManagementSkills;