import React from "react";
import { SkillsContainerProps } from "../Skills.Interfaces";
import {
  SkillsTableWrapper,
  SkillsWrapper
} from "../Skills.Styles";
import {
  SkillsHeader,
  SkillsTable
} from "components";

const SkillsContainer = (props: SkillsContainerProps) => {

  const {
    filteredState,
    checked,
    setChecked,
    setFilteredState
  } = props;

  return (
    <SkillsWrapper>
      <SkillsHeader
        filteredState={filteredState}
        checked={checked}
        setFilteredState={setFilteredState}
      />
      <SkillsTableWrapper>
        <SkillsTable
          filteredState={filteredState}
          checked={checked}
          setChecked={setChecked}
          setFilteredState={setFilteredState}
        />
      </SkillsTableWrapper>
    </SkillsWrapper>
  );
};

export default SkillsContainer;

