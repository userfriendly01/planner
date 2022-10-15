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
    tableState,
    setTableState
  } = props;

  return (
    <SkillsWrapper>
      <SkillsHeader
        tableState={tableState}
        setTableState={setTableState}
      />
      <SkillsTableWrapper>
        <SkillsTable
          tableState={tableState}
          setTableState={setTableState}
        />
      </SkillsTableWrapper>
    </SkillsWrapper>
  );
};

export default SkillsContainer;

