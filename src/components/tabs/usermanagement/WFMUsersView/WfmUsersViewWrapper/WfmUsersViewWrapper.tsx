import {
  WfmUsersContainer,
  StyledPaper
} from "./WfmUsersViewWrapper.Styles";
import {
  WfmUsersHeader,
  Pagination,
  WfmUserTable,
  WfmErrorBanner
} from "components";
import { useAdminState } from "context";
import {
  ModalOverlayStatuses, WfmBusinessUnit, WfmTeam, WfmUser
} from "globals";
import React from "react";
import {
  getWfmBusinessUnits,
  getWfmTeams,
  getWfmPeople,
  filterWfmUserTable,
  sortWfmWorkersByFullName,
  logger
} from "utils";
import InfoBanner from "../InfoBanner/InfoBanner";

const TritonUserManagementWrapper: any = () => {

  const defaultTableState: any = {
    searchBy: "",
    selected: [],
    teamFilter: null,
    businessUnitFilter: null,
    searchResults: [],
    pagination: {
      usersPerPage: 25,
      pageNumber: 1,
      length: 0,
      startingUserIndex: null,
      endingUserIndex: null
    },
    filteredList: []
  };

  const state = useAdminState();

  const wfmPeople = getWfmPeople(state);
  const [ status, setStatus ] = React.useState(null);
  const [ tableState, setTableState ] = React.useState(defaultTableState);

  React.useEffect(() => {

    if(wfmPeople.length > 0){
      let filteredList = wfmPeople.slice().sort(sortWfmWorkersByFullName);
      logger.log("TritonUserManagementWrapper: tableState ", wfmPeople);

      //filter by business unit
      if(tableState.businessUnitFilter){
        const businessUnit = getWfmBusinessUnits(state).find((bu: WfmBusinessUnit) => bu.Id === tableState.businessUnitFilter);
        if(tableState.businessUnitFilter === "People_Without_Team"){
          filteredList = filteredList.filter((wfmUser: WfmUser) => !wfmUser.BusinessUnitId);
        } else {
          filteredList = filteredList.filter((wfmUser: WfmUser) => wfmUser.BusinessUnitId === businessUnit?.Id);
        }
      }

      //filter by team
      if(tableState.teamFilter && tableState.teamFilter !== "show-all"){
        if(tableState.teamFilter === "no-team"){
          filteredList = filteredList.filter((wfmUser: WfmUser) => wfmUser.TeamId === null);
        } else {
          const team = getWfmTeams(state).find((team: WfmTeam) => team.Id === tableState.teamFilter);
          if(team){
            filteredList = filteredList.filter((wfmUser: WfmUser) => wfmUser.TeamId === team.Id);
          }
        }
      }

      //filter by searchBy
      const trimmedSearch = tableState.searchBy.trim();
      const searchResults = filteredList.filter((wfmUser: any) => filterWfmUserTable(wfmUser, trimmedSearch));
      filteredList = searchResults;


      const length = filteredList.slice().length;
      //filter by pagination
      const startingUserIndex = tableState.pagination.pageNumber !== 1 ? ((tableState.pagination.pageNumber - 1) * tableState.pagination.usersPerPage) : 0;
      const endingUserIndex = tableState.pagination.pageNumber * tableState.pagination.usersPerPage - 1;
      filteredList = filteredList.slice(startingUserIndex, endingUserIndex + 1);

      setTableState({
        ...tableState,
        filteredList,
        searchResults,
        pagination: {
          ...tableState.pagination,
          length: length,
          startingUserIndex,
          endingUserIndex
        }
      });
    }
  }, [tableState.searchBy, tableState.teamFilter, tableState.businessUnitFilter, tableState.pagination.pageNumber, state.calabrioContext.wfmOrg]);

  return (
    <WfmUsersContainer>
      <WfmErrorBanner />
      <WfmUsersHeader
        setStatus={setStatus}
        tableState={tableState}
        setTableState={setTableState}
      />
      { tableState.businessUnitFilter && status === ModalOverlayStatuses.SUCCESS ?
        <>
          <StyledPaper elevation={3}>
            <WfmUserTable
              tableState={tableState}
              setTableState={setTableState}
            />
          </StyledPaper>
          <Pagination
            tableState={tableState}
            setTableState={setTableState}
          />
        </>
        : <InfoBanner status={status} options={state.calabrioContext.wfmOptions}/>
      }
    </WfmUsersContainer>
  );
};

export default TritonUserManagementWrapper;