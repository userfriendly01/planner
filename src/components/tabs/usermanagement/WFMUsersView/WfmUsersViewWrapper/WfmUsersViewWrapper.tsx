import {
  ManagementContainer,
  StyledPaper
} from "./WfmUsersViewWrapper.Styles";
import {
  WfmUsersHeader,
  Pagination,
  WfmUserTable
} from "components";
import { useAdminState } from "context";
import { WfmBusinessUnit, WfmTeam, WfmUser } from "globals";
import WFMLoadRetryModal from "../../BulkChanges/WFMLoadRetryModal";
import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  getWfmBusinessUnits,
  getWfmTeams,
  getWfmPeople,
  filterWfmUserTable,
  sortWfmWorkersByFullName
} from "utils";

const TritonUserManagementWrapper: any = () => {

  const defaultTableState: any = {
    searchBy: "",
    selected: [],
    teamFilter: null,
    businessUnitFilter: false,
    searchResults: [],
    pagination: {
      usersPerPage: 5,
      pageNumber: 1,
      length: 0,
      startingUserIndex: null,
      endingUserIndex: null
    },
    filteredList: []
  };

  const state = useAdminState();
  const [ tableState, setTableState ] = React.useState(defaultTableState);
  const [ wfmLoaded, setWfmLoaded ] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("*FAITH* Something Changed", tableState);
    const wfmPeople = getWfmPeople(state);
    if(wfmPeople.length > 0){
      setWfmLoaded(true);
      let filteredList = wfmPeople.slice().sort(sortWfmWorkersByFullName);
      console.log("tableState", tableState);

      //filter by business unit
      if(tableState.businessUnitFilter && tableState.businessUnitFilter !== "show-all"){
        const businessUnit = getWfmBusinessUnits(state).find((bu: WfmBusinessUnit) => bu.Name === tableState.businessUnitFilter)
        if(businessUnit){
          filteredList = filteredList.filter((wfmUser: WfmUser) => wfmUser.BusinessUnitId === businessUnit.Id);
        }
      }
      console.log("**BU FL", filteredList);

      //filter by team
      if(tableState.teamFilter && tableState.teamFilter !== "show-all"){
        const team = getWfmTeams(state).find((team: WfmTeam) => team.Name === tableState.teamFilter);
        if(team){
          filteredList = filteredList.filter((wfmUser: WfmUser) => wfmUser.TeamId === team.Id);
        }
      }
      console.log("**Team FL", filteredList);

      //filter by searchBy
      const trimmedSearch = tableState.searchBy.trim();
      const searchResults = filteredList.filter((wfmUser: any) => filterWfmUserTable(wfmUser, trimmedSearch));
      filteredList = searchResults;

      console.log("**Search FL", filteredList);

      const length = filteredList.slice().length;
      //filter by pagination
      const startingUserIndex = tableState.pagination.pageNumber !== 1 ? ((tableState.pagination.pageNumber - 1) * tableState.pagination.usersPerPage) : 0;
      const endingUserIndex = tableState.pagination.pageNumber * tableState.pagination.usersPerPage - 1;
      console.log("*FAITH* Starting Index", startingUserIndex);
      console.log("*FAITH* Ending Index", endingUserIndex);
      filteredList = filteredList.slice(startingUserIndex, endingUserIndex + 1);
      console.log("**pagination FL", filteredList.slice());

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
      console.log("final filtered list", filteredList);
    } else {
      setWfmLoaded(false);
    }
  }, [tableState.searchBy, tableState.teamFilter, tableState.businessUnitFilter, tableState.pagination.pageNumber, state.calabrioContext.wfmOrg]);

  return (
    <ManagementContainer>
      {/* <WfmUsersHeader
        tableState={tableState}
        setTableState={setTableState}
      /> */}
      { wfmLoaded ?
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
        : <WFMLoadRetryModal
        
        />
      }
    </ManagementContainer>
  );
};

export default TritonUserManagementWrapper;