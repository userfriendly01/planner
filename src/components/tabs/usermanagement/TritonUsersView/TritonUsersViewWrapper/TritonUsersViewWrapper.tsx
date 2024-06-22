import {
  ManagementContainer, StyledPaper
} from "usermanagement/TritonUsersViewWrapper.Styles";
import { Pagination } from "components/Pagination";
import { TritonUsersHeader } from "usermanagement/TritonUsersHeader";
import { TritonUserTable } from "usermanagement/TritonUserTable";
import { useAdminState } from "context/appContext";
import {
  LoadStatuses, UMUser, AppError
} from "globals/interfaces";
import React from "react";
import { sortWorkersByFullName } from "utils/_sortUtils";
import { filterWorkerSearch } from "utils/_filterUtils";
import { PageLoadSpinner } from "components/PageLoadSpinner";

export const TritonUsersViewWrapper: any = () => {

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
  const { loadStatus } = state.workerContext;
  const [ tableState, setTableState ] = React.useState(defaultTableState);
  const [ resettingSkills, setResettingSkills ] = React.useState(false);

  React.useEffect(() => {
    let filteredList = state.workerContext.workers.slice().sort(sortWorkersByFullName);

    //filter by manager
    if(managerFilter && managerFilter !== "show-all"){
      filteredList = filteredList.filter((worker: UMUser) => worker.attributes.manager_n_number === managerFilter);
    }

    //filter by profile
    if(profileFilterArray.length > 0){
      filteredList = filteredList.filter((worker: UMUser) => {
        const workerProfileId = typeof worker.attributes.profile_id === "number" ? worker.attributes.profile_id.toString() : worker.attributes.profile_id;
        const profileFound = profileFilterArray.some((p:any) => p.value === workerProfileId);
        return profileFound;
      });
    }

    //filter by Ou
    if(ouFilterArray.length > 0){
      filteredList = filteredList.filter((worker: UMUser) => {
        const profile = state.profileContext.profiles.find(p => p.profile_id === worker.attributes.profile_id);
        const ouSid = profile ? profile.operating_unit_sid : "";
        const ouFound = ouFilterArray.some((o:any) => o.value === ouSid);
        return ouFound;
      });
    }

    //filter by deltaFilter
    if(tableState.deltaFilter){
      filteredList = filteredList.filter(worker => worker.skillsDifferent);
    }

    //filter by searchBy
    const trimmedSearch = tableState.searchBy.trim();
    const searchResults = filteredList.filter((worker: any) => filterWorkerSearch(worker, trimmedSearch));
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
  }, [tableState.searchBy, tableState.deltaFilter, managerFilter, profileFilterArray, ouFilterArray, tableState.pagination.pageNumber, state.workerContext]);

  return (
    <ManagementContainer>
      <TritonUsersHeader
        setResettingSkills={setResettingSkills}
        tableState={tableState}
        setTableState={setTableState}
      />
      {loadStatus === LoadStatuses.LOADING && <PageLoadSpinner/> }
      {loadStatus === LoadStatuses.FAIL &&
        <AppError elevation={3}>
          An error was thrown loading users, please refresh Triton to try again
        </AppError>
      }
      {loadStatus === LoadStatuses.SUCCESS &&
        <>
          <StyledPaper elevation={3}>
            <TritonUserTable
              resettingSkills={resettingSkills}
              tableState={tableState}
              setTableState={setTableState}
            />

          </StyledPaper>
          <Pagination
            tableState={tableState}
            setTableState={setTableState}
          />
        </>
      }
    </ManagementContainer>
  );
};