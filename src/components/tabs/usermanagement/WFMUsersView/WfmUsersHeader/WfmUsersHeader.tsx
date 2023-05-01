import { Wrapper } from "./WfmUsersHeader.Styles";
import { WfmUsersHeaderProps } from "./WfmUsersHeader.Interfaces";
import ExportButton from "./ExportUsersButton";
import {
  Dropdown,
  SearchBox
} from "components";
import { useAdminState } from "context";
import {
  WfmBusinessUnit,
  WfmTeam
} from "globals";
import React from "react";
import {
  getWfmBusinessUnits,
  getWfmTeams,
  sortWFMByName
} from "utils";

const ManagementHeader = (props: WfmUsersHeaderProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const state = useAdminState();

  const getBusinessUnitOptions = () => {
    const options: any[] = [
      {
        value: "show-all",
        label: "Show All"
      },
      {
        value: "no-business-unit",
        label: "No Business Unit"
      },
      {
        value: "divider",
        label: "divider"
      }
    ];
    getWfmBusinessUnits(state).sort(sortWFMByName).forEach((bu: WfmBusinessUnit) => {
      options.push({
        label: bu.Name,
        value: bu.Id,
        ...bu
      });
    });
    return options;
  }

  const getTeamOptions = () => {
    const options: any[] = [
      {
        value: "show-all",
        label: "Show All"
      },
      {
        value: "no-team",
        label: "No Team"
      },
      {
        value: "divider",
        label: "divider"
      }
    ];
    getWfmTeams(state, tableState.businessUnitFilter?.Id).sort(sortWFMByName).forEach((team: WfmTeam) => {
      options.push({
        label: team.Name,
        value: team.Id,
        ...team
      });
    });
    return options;
  }
  return (
    <Wrapper>
        <SearchBox searchBy={tableState.searchBy} setSearch={(searchBy: string) => setTableState({
          ...tableState,
          searchBy,
          pagination: {
            ...tableState.pagination,
            pageNumber: 1
          }
        })}
        />
      <Dropdown
        label={"Add Filter"}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}
        options={getBusinessUnitOptions()}
        value={tableState.businessUnitFilter || ""}
        updateValue={(event: any, newValue: any) => {
          console.log("Selected Business Unit", newValue);
          setTableState({
            ...tableState,
            businessUnitFilter: newValue
          })}
        }
        CustomRender={
          <Dropdown
            label={"Filter Business Unit"}
            styles={{
              width: "400px",
              margin: "10px 0px"
            }}
            options={getBusinessUnitOptions()}
            value={tableState.businessUnitFilter || ""}
            updateValue={(event: any, newValue: any) => {
              console.log("Selected Business Unit", newValue);
              setTableState({
                ...tableState,
                businessUnitFilter: newValue
              })}
            }
          />
        }
      />
      <Dropdown
        label={"Filter By Team"}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}
        options={getTeamOptions()}
        value={tableState.teamFilter || ""}
        updateValue={(event: any, newValue: any) => {
          console.log("Selected Team", newValue);
          setTableState({
            ...tableState,
            teamFilter: newValue.value
          })}
        }
      />
      <ExportButton selected={tableState.searchResults} label="Export"/>
    </Wrapper>
  );
};

export default ManagementHeader;
