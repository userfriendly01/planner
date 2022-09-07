import React, {
  useState, useEffect
} from "react";
import {
  CallflowWrapper,
  SkillsWrapper,
  SearchSkillsWrapper,
  MessageWrapper,
  Header
} from "./CallFlowContainer.Styles";
import {
  ConfirmationModalOptsProps,
  FilteredStateProps,
  SaveResultProps
} from "../CallFlowManagement.Interfaces";
import {
  CallFlowConfirmationModal,
  MessageBox,
  SkillsTable,
  Dropdown
} from "components";
import { useAdminState } from "context";
import { filterSkillsByName } from "utils";
import { Skill } from "globals";
import { Modal } from "@mui/material";
import { SearchBox } from "components/tabs/usermanagement";

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
  const [ selected, setSelected ] = useState([]);
  const [ filteredState, setFilteredState ] = useState(defaultFilteredState);
  const [ confirmationModalOpts, setConfirmationModalOpts ] = useState(defaultConfirmationModalOpts);
  const [ saveResult, setSaveResult ] = useState(defaultSaveResult);

  useEffect(() => {
    console.warn("filteredState", filteredState);
    let filteredList = state.skillContext.skills.slice();
    //filter by profile
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

    console.warn("new list", filteredList);
    setFilteredState({
      ...filteredState,
      filteredList
    });
  }, [filteredState.searchBy, filteredState.profiles, filteredState.closedFilter, filteredState.flashFilter, state.skillContext.skills]);

  const getProfileOptions = () => {
    return state.profileContext.profiles.map((p: any) => {
      return {
        ...p,
        label: p.profile_nme,
        value: p.profile_id
      };
    });
  };

  return (
    <CallflowWrapper>
      <SearchSkillsWrapper>
        <Header>
          <Dropdown
            label="Profile Id"
            multiple={true}
            value={filteredState.profiles}
            options={getProfileOptions()}
            updateValue={(event: any, selectedProfiles: any) => setFilteredState({
              ...filteredState,
              profiles: selectedProfiles
            })}
            styles={{ width: "300px" }}
          />
          <SearchBox
            key={"search-box"}
            searchBy={filteredState.searchBy}
            setSearch={(value: string) => {
              setFilteredState({
                ...filteredState,
                searchBy: value
              });
            }}
          />
        </Header>
        <SkillsWrapper>
          <SkillsTable
            filteredState={filteredState}
            selected={selected}
            setSelected={setSelected}
            setFilteredState={setFilteredState}
          />
        </SkillsWrapper>
      </SearchSkillsWrapper>
      <MessageWrapper>
        <MessageBox
          confirmationModalOpts={confirmationModalOpts}
          setSaveResult={setSaveResult}
          setConfirmationModalOpts={setConfirmationModalOpts}
          selected={selected}
          setSelected={setSelected}
          messageType="Closed Message"
        />
        <MessageBox
          confirmationModalOpts={confirmationModalOpts}
          setSaveResult={setSaveResult}
          setConfirmationModalOpts={setConfirmationModalOpts}
          selected={selected}
          setSelected={setSelected}
          messageType="Flash Message"
        />
      </MessageWrapper>
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