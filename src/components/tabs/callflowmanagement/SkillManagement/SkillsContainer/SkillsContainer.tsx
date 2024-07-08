import React from "react";
import { SkillsContainerProps } from "../Skills.Interfaces";
import {
  SkillsTableWrapper,
  SkillsWrapper
} from "../Skills.Styles";
import {
  useSkillState
} from "context/appContext";
import { SkillsTable } from "callflowmanagement/SkillsTable";
import { SkillsHeader } from "callflowmanagement/SkillsHeader";

export const SkillsContainer = (props: SkillsContainerProps) => {

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