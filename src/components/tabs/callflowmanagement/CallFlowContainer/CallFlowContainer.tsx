import React, { useState } from "react";
import {
  MessageBox,
  SkillsTable,
  ProfileDropDown
} from "components";
import {
  useAdminState
} from "context";
import styled from "styled-components";
import {
  filterSkillsByName
} from "utils";
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

  const [searchBy, setSearchBy] = useState("");
  const [ selected, setSelected ] = useState([]);
  const profiles = useAdminState().profileContext.profiles;

  // const state = useAdminState();
  // const skills = state.skillContext.skills;
  // let filteredSkills = skills.slice();

  // const trimmedSearch = searchBy.trim();
  // if (trimmedSearch !== "") {
  //   filteredSkills = filteredSkills.filter(worker => filterSkillsByName(worker, trimmedSearch));
  // }

  return (
    <CallflowWrapper>
      <SearchSkillsWrapper>
        <Header>
          <ProfileDropDown
            availableProfiles={profiles}
            updateProfile={() => console.log("profile")}
            profileId={1}
          />
          <SearchBox
            key={"search-box"}
            searchBy={searchBy}
            setSearch={setSearchBy}
          />
        </Header>
        <SkillsWrapper>
          <SkillsTable
            selected={selected}
            setSelected={setSelected}
            searchBy={searchBy}
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