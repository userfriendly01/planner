import {
  ControlItem,
  ControlsWrapper
} from "./TritonUsersHeader.Styles";
import { ManagementHeaderProps } from "./TritonUsersHeader.Interfaces";
import ExportButton from "./ExportUsersButton";
import {
  ResetSkillsButton,
  FilterButton,
  SearchBox
} from "components";
import React from "react";

const ManagementHeader = (props: ManagementHeaderProps) => {
  const {
    tableState,
    setTableState
  } = props;

  return (
    <ControlsWrapper>
      <ControlItem >
        <SearchBox styles={{ width: "100%" }} searchBy={tableState.searchBy} setSearch={(searchBy: string) => setTableState({
          ...tableState,
          searchBy
        })}
        />
        <FilterButton
          tableState= {tableState}
          setTableState={setTableState}
        />
      </ControlItem>
      <ControlItem>
        <ExportButton selected={tableState.searchResults} label="Export"/>
        <ResetSkillsButton selected={tableState.selected}/>
      </ControlItem>
    </ControlsWrapper>
  );
};

export default ManagementHeader;
