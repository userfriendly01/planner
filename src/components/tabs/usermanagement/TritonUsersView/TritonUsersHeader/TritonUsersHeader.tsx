import {
  ControlItem,
  ControlsWrapper
} from "./TritonUsersHeader.Styles";
import { ManagementHeaderProps } from "./TritonUsersHeader.Interfaces";
import {
  ManagerDropdown,
  ResetSkillsButton,
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
      <ControlItem>
        <ManagerDropdown filterBy={tableState.manager} setFilter={(manager_n_number: string) => setTableState({
          ...tableState,
          managerFilter: manager_n_number
        })}
        />
      </ControlItem>
      <ControlItem>
        <SearchBox searchBy={tableState.searchBy} setSearch={(searchBy: string) => setTableState({
          ...tableState,
          searchBy
        })}
        />
      </ControlItem>
      <ControlItem>
        <ResetSkillsButton />
      </ControlItem>
    </ControlsWrapper>
  );
};

export default ManagementHeader;
