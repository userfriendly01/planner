import React, {
  useState, useEffect
} from "react";
import {
  CallflowWrapper,
  MessageWrapper
} from "./CallFlowManagement.Styles";
import {
  FilteredStateProps, views
} from "./CallFlowManagement.Interfaces";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import {
  CallFlowConfirmationModal,
  Dropdown,
  MessageContainer,
  SkillsContainer
} from "components";
import { useAdminState } from "context";
import { filterSkillsByName } from "utils";
import { Skill } from "globals";
import { Modal } from "@mui/material";
import { messageTypes } from "../ClosedFlashMessage/ClosedFlashMessage.Interfaces";

const CallFlowContainer = () => {

  const defaultFilteredState: FilteredStateProps = {
    searchBy: "",
    profiles: [],
    closedFilter: false,
    flashFilter: false,
    filteredList: []
  };

  const defaultConfirmationModalOpts: ConfirmationModalOptsProps = {
    open: false,
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
  const isAdmin = state.userContext.isAdmin;
  const userProfileId = state.userContext.profileId;
  const [ checked, setChecked ] = useState([]);
  const [ selected, setSelected ] = useState(null);
  const [ filteredState, setFilteredState ] = useState(defaultFilteredState);
  const [ confirmationModalOpts, setConfirmationModalOpts ] = useState(defaultConfirmationModalOpts);
  const [ saveResult, setSaveResult ] = useState(defaultSaveResult);
  const [ view, setView ] = React.useState(views[0]);
  console.log("Filtered State: ", filteredState);

  useEffect(() => {
    let filteredList = state.skillContext.skills.slice();

    //filter by profile
    if(isAdmin) {
      if(filteredState.profiles.length > 0){
        filteredList = filteredList.filter((skill: Skill) => {
          let shouldReturn = false;
          skill.profiles.forEach((p: any) => {
            if(filteredState.profiles.some((sp: any) => sp.profile_id === p.profileId)){
              shouldReturn = true;
            }
          });
          return shouldReturn;
        });
      }
    } else {
      filteredList = filteredList.filter((skill: Skill) => {
        let shouldReturn = false;
        if(skill.profiles.some((sp: any) => sp.profileId === userProfileId)){
          shouldReturn = true;
        }
        return shouldReturn;
      });
    }

    //filter by searchBy
    const trimmedSearch = filteredState.searchBy.trim();
    filteredList = filteredList.filter((skill: Skill) => filterSkillsByName(skill, trimmedSearch));

    //filter by closed
    if(filteredState.closedFilter){
      filteredList = filteredList.filter((skill: Skill) => skill.closedMessage);
    }
    //filter by flash
    if(filteredState.flashFilter){
      filteredList = filteredList.filter((skill: Skill) => skill.flashMessage);
    }

    setFilteredState({
      ...filteredState,
      filteredList
    });
  }, [filteredState.searchBy, filteredState.profiles, filteredState.closedFilter, filteredState.flashFilter, state.skillContext.skills]);

  const FlashMessageView =
    <MessageWrapper>
      <SkillsContainer
        checked={checked}
        filteredState={filteredState}
        selected={selected}
        setChecked={setChecked}
        setFilteredState={setFilteredState}
        setSelected={setSelected}
      />
      <MessageContainer
        confirmationModalOpts={confirmationModalOpts}
        checked={checked}
        messageType={messageTypes.FLASH}
        selected={selected}
        setChecked={setChecked}
        setConfirmationModalOpts={setConfirmationModalOpts}
        setSaveResult={setSaveResult}
      />
    </MessageWrapper>;

  const ClosedMessageView =
    <MessageWrapper>
      <SkillsContainer
        checked={checked}
        filteredState={filteredState}
        selected={selected}
        setChecked={setChecked}
        setFilteredState={setFilteredState}
        setSelected={setSelected}
      />
      <MessageContainer
        confirmationModalOpts={confirmationModalOpts}
        checked={checked}
        messageType={messageTypes.CLOSED}
        selected={selected}
        setChecked={setChecked}
        setConfirmationModalOpts={setConfirmationModalOpts}
        setSaveResult={setSaveResult}
      />
    </MessageWrapper>;

  return (
    <CallflowWrapper>
      <Dropdown
        label="What would you like to do?"
        value={view}
        options={views}
        updateValue={(event: any, view: any) => setView(view)}
        styles={{
          margin: "40 0 60 0",
          width: "500px"
        }}
      />
      {view === views.find(v => v.value === "CLOSED_MESSAGE") && ClosedMessageView}
      {view === views.find(v => v.value === "FLASH_MESSAGE") && FlashMessageView}
      <Modal open={confirmationModalOpts.open}>
        <CallFlowConfirmationModal
          confirmationModalOpts={confirmationModalOpts}
          saveResult={saveResult}
        />
      </Modal>
    </CallflowWrapper>
  );
};

export default CallFlowContainer;