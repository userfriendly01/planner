import {
  ManagementContainer,
  StyledPaper
} from "./TritonUsersViewWrapper.Styles";
import {
  TritonUsersHeader,
  Pagination,
  TritonUserTable
} from "components";
import { useAdminState } from "context";
import { Worker } from "globals";
import React from "react";
import {
  filterWorkerSearch,
  sortWorkersByFullName
} from "utils";

const TritonUserManagementWrapper: any = () => {

  // Note: The table filters are kept in context so they can be retained across pages
  const defaultTableState: any = {
    searchBy: "",
    selected: [],
    searchResults: [],
    deltaFilter: false,
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
  const {
    managerFilter,
    profileFilterArray,
    ouFilterArray
  } = state.userManagementTableFilters;
  const [ tableState, setTableState ] = React.useState(defaultTableState);

  React.useEffect(() => {
    let filteredList = state.workerContext.workers.slice().sort(sortWorkersByFullName);

    //filter by manager
    if(managerFilter && managerFilter !== "show-all"){
      filteredList = filteredList.filter((worker: Worker) => worker.attributes.manager_n_number === managerFilter);
    }
    console.log("**Manager FL", filteredList);

    //filter by profile
    if(profileFilterArray.length > 0){
      filteredList = filteredList.filter((worker: Worker) => {
        const workerProfileId = typeof worker.attributes.profile_id === "number" ? worker.attributes.profile_id.toString() : worker.attributes.profile_id;
        const profileFound = profileFilterArray.some((p:any) => p.value === workerProfileId);
        return profileFound;
      });
    }
    console.log("**Profile FL", filteredList);

    //filter by Ou
    if(ouFilterArray.length > 0){
      filteredList = filteredList.filter((worker: Worker) => {
        const profile = state.profileContext.profiles.find(p => p.profile_id === worker.attributes.profile_id);
        const ouSid = profile ? profile.operating_unit_sid : "";
        const ouFound = ouFilterArray.some((o:any) => o.value === ouSid);
        return ouFound;
      });
    }

    console.log("**Ou FL", filteredList);

    // TODO - Move deltafilter to context????
    //filter by deltaFilter
    if(tableState.deltaFilter){
      filteredList = filteredList.filter(worker => worker.skillsDifferent);
    }

    console.log("**Delta FL", filteredList);

    //filter by searchBy
    const trimmedSearch = tableState.searchBy.trim();
    const searchResults = filteredList.filter((worker: any) => filterWorkerSearch(worker, trimmedSearch));
    filteredList = searchResults;
    console.log("**Search FL", filteredList);

    const length = filteredList.slice().length;
    //filter by pagination
    const startingUserIndex = tableState.pagination.pageNumber !== 1 ? ((tableState.pagination.pageNumber - 1) * tableState.pagination.usersPerPage) : 0;
    const endingUserIndex = tableState.pagination.pageNumber * tableState.pagination.usersPerPage - 1;
    filteredList = filteredList.slice(startingUserIndex, endingUserIndex + 1);

    console.log("**pagination FL", filteredList);

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
  }, [tableState.searchBy, tableState.deltaFilter, managerFilter, profileFilterArray, ouFilterArray, tableState.pagination.pageNumber, state.workerContext]);

  return (
    <ManagementContainer>
      <TritonUsersHeader
        tableState={tableState}
        setTableState={setTableState}
      />
      <StyledPaper elevation={3}>
        <TritonUserTable
          tableState={tableState}
          setTableState={setTableState}
        />
      </StyledPaper>
      <Pagination
        tableState={tableState}
        setTableState={setTableState}
      />
    </ManagementContainer>
  );
};

export default TritonUserManagementWrapper;