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
import {
  useAdminState, useAdminDispatch
} from "context";
import React from "react";
import { Chip } from "@mui/material";

const ManagementHeader = (props: ManagementHeaderProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();

  const getManagerName = (nNumber: string) => {
    const manager = state.managerContext.managers.find(manager => manager.manager_n_number === nNumber);
    return `${manager.manager_first_name} ${manager.manager_last_name}`;
  };

  return (
    <ControlsWrapper>
      <ControlItem >
        <SearchBox styles={{ width: "100%" }} searchBy={tableState.searchBy} setSearch={(searchBy: string) => setTableState({
          ...tableState,
          searchBy
        })}
        />
        <FilterButton />
      </ControlItem>
      <ControlItem>
        <ul style={{ listStyleType: "none" }}>
          {state.userManagementTableFilters.managerFilter && (
            <li>
              <Chip
                key={state.userManagementTableFilters.managerFilter}
                sx={{
                  maxWidth: "150px",
                  marginBottom: "3px"
                }}
                label={getManagerName(state.userManagementTableFilters.managerFilter)}
                size="small"
                onDelete={() => dispatch({
                  type: "updateManagerFilter",
                  payload: null
                })}/>
            </li>
          )}
        </ul>
        <ul style={{ listStyleType: "none" }}>
          {state.userManagementTableFilters.profileFilterArray.map(x => (
            <li key={x.value}>
              <Chip
                sx={{
                  maxWidth: "150px",
                  marginBottom: "3px"
                }}
                label={x.label}
                size="small"
                onDelete={() => {
                  const updatedProfiles = state.userManagementTableFilters.profileFilterArray.filter(p => p.value !== x.value);
                  dispatch({
                    type: "updateProfileFilter",
                    payload: updatedProfiles
                  });
                }} />
            </li>
          ))}
        </ul>
        <ul style={{ listStyleType: "none" }}>
          {state.userManagementTableFilters.ouFilterArray.map(x => (
            <li key={x.value}>
              <Chip
                sx={{
                  maxWidth: "150px",
                  marginBottom: "3px"
                }}
                label={x.label}
                size="small"
                onDelete={() => {
                  const updatedOus = state.userManagementTableFilters.ouFilterArray.filter(o => o.value !== x.value);
                  dispatch({
                    type: "updateOuFilter",
                    payload: updatedOus
                  });
                }} />
            </li>))}
        </ul>
      </ControlItem>
      <ControlItem>
        <ExportButton selected={tableState.searchResults} label="Export"/>
        <ResetSkillsButton selected={tableState.selected}/>
      </ControlItem>
    </ControlsWrapper>
  );
};

export default ManagementHeader;
