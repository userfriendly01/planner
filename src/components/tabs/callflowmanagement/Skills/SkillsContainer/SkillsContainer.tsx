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
    tableState,
    setChecked,
    setTableState
  } = props;

  return (
    <SkillsWrapper>
      <SkillsHeader
        tableState={tableState}
        checked={checked}
        setTableState={setTableState}
      />
      <SkillsTableWrapper>
        <SkillsTable
          checked={checked}
          tableState={tableState}
          setChecked={setChecked}
          setTableState={setTableState}
        />
      </SkillsTableWrapper>
    </SkillsWrapper>
  );
};

export default SkillsContainer;

