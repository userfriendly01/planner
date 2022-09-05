import React, {
  useState, useEffect
} from "react";
import {
  MessageBox,
  SkillsTable,
  Dropdown
} from "components";
import {
  useAdminState
} from "context";
import styled from "styled-components";
import {
  filterSkillsByName
} from "utils";
import {
  Skill
} from "globals";
import { SearchBox } from "components/tabs/usermanagement";

const CallFlowContainer = () => {

  const CallflowWrapper = styled.div`
    display: flex;
    padding: 0px 20px;
  `;

  const SkillsWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: scroll;
    max-height: 700px;
  `;

  const SearchSkillsWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 60%;
  `;

  const MessageWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 60%;
  `;

  const Header = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    margin: 40 0 30 0;
  `;

  const [ selected, setSelected ] = useState([]);
  const state = useAdminState();

  const defaultFilteredState: any = {
    searchBy: "",
    profiles: [],
    closedFilter: false,
    flashFilter: false,
    filteredList: []
  };
  const [ filteredState, setFilteredState ] = useState(defaultFilteredState);

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
  }, [filteredState.searchBy, filteredState.profiles, filteredState.closedFilter, filteredState.flashFilter]);

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
          selected={selected}
          messageType="Closed Message"
        />
        <MessageBox
          selected={selected}
          messageType="Flash Message"
        />
      </MessageWrapper>
    </CallflowWrapper>
  );
};

export default CallFlowContainer;