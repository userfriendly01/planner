import {
  ManagementContainer,
  StyledPaper
} from "./TritonUserManagementWrapper.Styles";
import { TritonUserManagementWrapperProps } from "./TritonUserManagementWrapper.Interfaces";
import {
  ManagementHeader,
  Pagination,
  TritonUserTable
} from "components";
import { useAdminState } from "context";
import { Worker } from "globals";
import React from "react";
import {
  filterByNameAndSkills,
  sortWorkersByFullName
} from "utils";

const TritonUserManagementWrapper: any = (props: TritonUserManagementWrapperProps) => {
  const {
    workerOpts,
    setWorkerOpts
  } = props;

  const defaultTableState: any = {
    searchBy: "",
    selected: [],
    managerFilter: null,
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
  const [ tableState, setTableState ] = React.useState(defaultTableState);

  React.useEffect(() => {
    let filteredList = state.workerContext.workers.slice().sort(sortWorkersByFullName);
    console.log("**Starting FL", filteredList);
    console.log("tableState", tableState);

    //filter by manager
    if(tableState.managerFilter){
      // const managerFound = state.managerContext.managers.find((manager: Manager) => manager.manager_n_number === tableState.manager);
      // if(managerFound){
      filteredList = filteredList.filter((worker: Worker) => worker.attributes.manager_n_number === tableState.managerFilter);
      // }
    }
    console.log("**Manager FL", filteredList);


    //filter by deltaFilter
    if(tableState.deltaFilter){
      filteredList = filteredList.filter(worker => worker.skillsDifferent);
    }

    console.log("**Delta FL", filteredList);

    //filter by searchBy
    const trimmedSearch = tableState.searchBy.trim();
    filteredList = filteredList.filter((worker: any) => filterByNameAndSkills(worker, trimmedSearch));

    console.log("**Search FL", filteredList);

    const length = filteredList.slice().length;
    //filter by pagination
    const startingUserIndex = tableState.pagination.pageNumber !== 1 ? ((tableState.pagination.pageNumber - 1) * tableState.pagination.usersPerPage) + 1 : 0;
    const endingUserIndex = tableState.pagination.pageNumber * tableState.pagination.usersPerPage;
    filteredList = filteredList.slice(startingUserIndex, endingUserIndex);

    console.log("**pagination FL", filteredList);

    setTableState({
      ...tableState,
      filteredList,
      pagination: {
        ...tableState.pagination,
        length: length,
        startingUserIndex,
        endingUserIndex
      }
    });
    console.log("final filtered list", filteredList);
  }, [tableState.searchBy, tableState.managerFilter, tableState.pagination.pageNumber, state.workerContext]);

  return (
    <ManagementContainer>
      <ManagementHeader
        tableState={tableState}
        setTableState={setTableState}
      />
      <StyledPaper elevation={3}>
        <TritonUserTable
          tableState={tableState}
          setTableState={setTableState}
          workerOpts={workerOpts}
          setWorkerOpts={setWorkerOpts}
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