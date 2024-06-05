import { Wrapper } from "usermanagement/WfmUsersHeader.Styles";
import { WfmUsersHeaderProps } from "usermanagement/WfmUsersHeader.Interfaces";
import { ExportWfmUsersButton } from "usermanagement/ExportWfmUsersButton";
import { Dropdown } from "components/Dropdown";
import { SearchBox } from "components/SearchBox";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  ModalOverlayStatuses,
  WfmBusinessUnit,
  WfmTeam
} from "globals/interfaces";
import React from "react";
import {
  getWfmBusinessUnits,
  getWfmTeams,
  getCalabrioWfmOrg
} from "utils/calabrioUtils";
import { sortWFMByName } from "utils/sortUtils";
import { logger } from "utils/logger";

export const WfmUsersHeader = (props: WfmUsersHeaderProps) => {
  const {
    setStatus,
    tableState,
    setTableState
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();

  const getBusinessUnitOptions = () => {
    const options: any[] = [];
    getWfmBusinessUnits(state, true).sort(sortWFMByName).forEach((bu: WfmBusinessUnit) => {
      options.push({
        label: bu.Name,
        value: bu.Id,
        ...bu
      });
    });
    return options;
  };

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
    getWfmTeams(state, tableState.businessUnitFilter, true).sort(sortWFMByName).forEach((team: WfmTeam) => {
      options.push({
        label: team.Name,
        value: team.Id,
        ...team
      });
    });
    return options;
  };

  const getTeamOption = () => {
    const team = getWfmTeams(state, tableState.businessUnitFilter, true).find((tm: any) => tm.Id === tableState.teamFilter);
    if(team){
      return {
        label: team.Name,
        value: team.Id,
        ...team
      };
    } else if(tableState.teamFilter === "no-team"){
      return {
        value: "no-team",
        label: "No Team"
      };
    } else {
      logger.log("Team Filter not an available option");
      if(tableState.teamFilter){
        setTableState({
          ...tableState,
          teamFilter: null
        });
      }
      return "";
    }
  };
  return (
    <Wrapper>
      <Dropdown
        label={"Filter Business Unit"}
        disableClear={true}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}
        options={getBusinessUnitOptions()}
        value={getBusinessUnitOptions().find((bu: any) => bu.Id === tableState.businessUnitFilter) || ""}
        updateValue={async (event: any, newValue: any) => {
          try {
            setStatus(ModalOverlayStatuses.SAVING);
            setTableState({
              ...tableState,
              businessUnitFilter: newValue.value,
              pagination: {
                ...tableState.pagination,
                pageNumber: 1
              }
            });
            await getCalabrioWfmOrg(newValue.value, state, dispatch);
            setStatus(ModalOverlayStatuses.SUCCESS);
          } catch(err) {
            setStatus(ModalOverlayStatuses.FAIL);
          }
        }}
      />
      <Dropdown
        label={"Filter By Team"}
        disableClear={true}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}
        options={getTeamOptions()}
        value={getTeamOption()}
        updateValue={(event: any, newValue: any) => {
          setTableState({
            ...tableState,
            teamFilter: newValue.value
          });
        }}
      />
      <SearchBox searchBy={tableState.searchBy} setSearch={(searchBy: string) => setTableState({
        ...tableState,
        searchBy,
        pagination: {
          ...tableState.pagination,
          pageNumber: 1
        }
      })}
      />
      <ExportWfmUsersButton selected={tableState.searchResults} label="Export"/>
    </Wrapper>
  );
};
