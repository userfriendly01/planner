import {
  ControlItem,
  ControlsWrapper
} from "./TritonUsersHeader.Styles";
import { ManagementHeaderProps } from "./TritonUsersHeader.Interfaces";
import ExportButton from "./ExportUsersButton";
import {
  ManagerDropdown,
  ProfileDropdown,
  OuFilterDropdown,
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
        <ProfileDropdown filterBy={tableState.profile_nme} setFilter={(profile_name: string) => setTableState({
          ...tableState,
          profileFilter: profile_name
        })}
        />
      </ControlItem>
      <ControlItem>
        <OuFilterDropdown filterBy={tableState.ou_name} setFilter={(ou_name: string) => setTableState({
          ...tableState,
          ouFilter: ou_name
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
        <ExportButton selected={tableState.searchResults} label="Export"/>
        <ResetSkillsButton />
      </ControlItem>
    </ControlsWrapper>
  );
};

export default ManagementHeader;
