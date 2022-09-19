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
    checked,
    filteredState,
    selected,
    setChecked,
    setFilteredState,
    setSelected
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
          checked={checked}
          filteredState={filteredState}
          selected={selected}
          setChecked={setChecked}
          setFilteredState={setFilteredState}
          setSelected={setSelected}
        />
      </SkillsTableWrapper>
    </SkillsWrapper>
  );
};

export default SkillsContainer;

