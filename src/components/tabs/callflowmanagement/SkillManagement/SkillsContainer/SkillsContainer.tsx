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
import {
  SkillFormStateProvider
} from "context";

const SkillsContainer = (props: SkillsContainerProps) => {

  const {
    tableState,
    setTableState
  } = props;

  return (
    <SkillFormStateProvider>
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
    </SkillFormStateProvider>
  );
};

export default SkillsContainer;

