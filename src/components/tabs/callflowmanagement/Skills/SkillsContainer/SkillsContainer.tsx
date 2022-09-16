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
    selected,
    setSelected,
    setFilteredState
  } = props;

  return (
    <SkillsWrapper>
      <SkillsHeader
        filteredState={filteredState}
        selected={selected}
        setFilteredState={setFilteredState}
      />
      <SkillsTableWrapper>
        <SkillsTable
          filteredState={filteredState}
          selected={selected}
          setSelected={setSelected}
          setFilteredState={setFilteredState}
        />
      </SkillsTableWrapper>
    </SkillsWrapper>
  );
};

export default SkillsContainer;

