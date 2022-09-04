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

  const [searchBy, setSearchBy] = useState("");
  const [ selected, setSelected ] = useState([]);
  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const skills = state.skillContext.skills;
  const [ selectedProfiles, setSelectedProfiles ] = useState([]);
  const [ filteredSkills, setFilteredSkills ] = useState(skills.slice());

  useEffect(() => {
    console.warn(`Use Effect entered!... searchBy: ${searchBy} Filtered Skills: `, filteredSkills);
    filterBySearch();
  }, [searchBy]);

  const filterBySearch = () => {
    const trimmedSearch = searchBy.trim();
    if (trimmedSearch !== "") {
      setFilteredSkills(filteredSkills.filter((skill: Skill) => filterSkillsByName(skill, trimmedSearch)));
    }
  };

  const filterByProfile = (selectedProfiles: any[]) => {
    setSelectedProfiles(selectedProfiles);
    if(selectedProfiles.length > 0){
      const filtered = filteredSkills.filter((skill: Skill) => {
        let shouldReturn = false;
        skill.profiles.forEach((p: any) => {
          if(selectedProfiles.some((sp: any) => sp.profile_id === p.profileId)){
            shouldReturn = true;
          }
        });
        return shouldReturn;
      });
      setFilteredSkills(filtered);
    } else {
      if(searchBy){
        filterBySearch();
      } else {
        setFilteredSkills(skills.slice());
      }
    }

  };

  const getProfileOptions = () => {
    return profiles.map((p: any) => {
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
            value={selectedProfiles}
            options={getProfileOptions()}
            updateValue={(event: any, selectedRoles: any) => filterByProfile(selectedRoles)}
            styles={{ width: "300px" }}
          />
          <SearchBox
            key={"search-box"}
            searchBy={searchBy}
            setSearch={setSearchBy}
          />
        </Header>
        <SkillsWrapper>
          <SkillsTable
            filteredSkills={filteredSkills}
            selected={selected}
            setSelected={setSelected}
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