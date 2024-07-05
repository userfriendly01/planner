import {
  CallflowWrapper,
  MessageWrapper
} from "./CallFlowManagement.Styles";
import { TableState } from "./CallFlowManagement.Interfaces";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "callflowmanagement/CallFlowConfirmationModal.Interfaces";
import { CallFlowConfirmationModal } from "callflowmanagement/CallFlowConfirmationModal";
import { ActionContainer } from "callflowmanagement/ActionContainer";
import { SkillsContainer } from "callflowmanagement/SkillsContainer";
import {
  useAdminState, useSkillState, useSkillDispatch
} from "context/appContext";
import { Skill } from "callflowmanagement/Skills.Interfaces";
import { UMSoftphoneConfiguration } from "globals/interfaces";
import React from "react";
import { filterSkillsByName } from "utils/_filterUtils";
import { logger } from "utils/logger";
import { Modal } from "@mui/material";
import { loadSkillOptions } from "services/skill";
import { PageLoadSpinner } from "components/PageLoadSpinner";

export const CallFlowManagementSkills = () => {

  const defaultTableState: TableState = {
    searchBy: "",
    selected: [],
    profiles: [],
    closedFilter: false,
    flashFilter: false,
    discrepancyFilter: false,
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
  const skillState = useSkillState();

  const {
    isAdmin,
    profileId: userProfileId
  } = state.userContext;

  const [ tableState, setTableState ] = React.useState(defaultTableState);
  const [ confirmationModalOpts, setConfirmationModalOpts ] = React.useState(defaultConfirmationModalOpts);
  const [ saveResult, setSaveResult ] = React.useState(defaultSaveResult);

  logger.log("CallFlowManagementSkills Filtered State: ", tableState);

  const skillDispatch = useSkillDispatch();
  const [ isLoading, setIsLoading ] = React.useState(true);

  React.useEffect(() => {
    if(!skillState.timeOfDays.length || !skillState.applications.length || !skillState.taskQueues.length || !skillState.operatingUnits.length){
      loadSkillOptions(skillState.skills, skillDispatch, () => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let filteredList = skillState.skills.slice();
    //filter by profile
    if(isAdmin) {
      if(tableState.profiles.length > 0){
        filteredList = filteredList.filter((skill: Skill) => {
          let shouldReturn = false;
          skill.profileIds?.forEach((p: number) => {
            if(tableState.profiles.some((sp: UMSoftphoneConfiguration) => sp.profile_id === p)){
              shouldReturn = true;
            }
          });
          return shouldReturn;
        });
      }
    } else {
      filteredList = filteredList.filter((skill: Skill) => {
        let shouldReturn = false;
        if(skill.profileIds?.some((s: number) => s === userProfileId)){
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

    //filter by discrepancy
    if(tableState.discrepancyFilter){
      filteredList = filteredList.filter((skill: Skill) => skill.discrepancies.length > 0);
    }

    setTableState({
      ...tableState,
      filteredList
    });
  }, [tableState.searchBy, tableState.profiles, tableState.closedFilter, tableState.flashFilter, tableState.discrepancyFilter,  skillState.skills]);

  return (
    <CallflowWrapper>
      {isLoading ?
        <PageLoadSpinner />
        :
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
          <Modal open={confirmationModalOpts.open}>
            <>
              <CallFlowConfirmationModal
                tableState={tableState}
                confirmationModalOpts={confirmationModalOpts}
                saveResult={saveResult}
              />
            </>
          </Modal>
        </MessageWrapper>
      }
    </CallflowWrapper>
  );
};