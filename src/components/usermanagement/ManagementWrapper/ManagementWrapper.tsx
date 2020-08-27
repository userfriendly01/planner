import {
  Modal,
  Paper
} from "@material-ui/core";
import {
  ManagementHeader,
  ManagementPagination,
  ManagementTable,
  UserEntryForm
} from "components";
import {
  useAdminState
} from "context";
import { workersPerPage } from "globals";
import React, {
  useState
} from "react";
import styled from "styled-components";
import { filterByNameAndSkills } from "utils";

// @ts-ignore
const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1%;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

// TODO worker object args???
const sortByWorkerFullName = (a: any, b: any) => {
  const sortLast = "zzzzzzzzzzz";
  const [aName, bName] = [a.attributes.full_name || sortLast, b.attributes.full_name || sortLast];
  if (aName < bName) { return -1; }
  if (aName > bName) { return 1; }
  return 0;
};
// TODO type out worker object?
const getWorkersStartAndEnd = (pageSelected: number, filteredWorkers: any) => {
  const workersStart = ((pageSelected - 1) * workersPerPage);
  if (pageSelected * workersPerPage > filteredWorkers.length) {
    return {
      workersStart,
      workersEnd: (((pageSelected - 1) * workersPerPage) + (filteredWorkers.length % workersPerPage))
    };
  } else {
    return {
      workersStart,
      workersEnd: pageSelected * workersPerPage
    };
  }
};

interface ManagementWrapperState {
  deltaToggle: boolean,
  pageSelected: number,
  filterBy: string,
  searchBy: string
};

interface UserEntryFormState {
  formMode: string,
  open: boolean,
  worker: any // TODO type out worker object???
};

const initialManagementWrapperState: ManagementWrapperState = {
  deltaToggle: false,
  pageSelected: 1,
  filterBy: "show-all",
  searchBy: ""
};

const initialUserEntryFormState: UserEntryFormState = {
  formMode: "",
  open: false,
  worker: null
};

export const ManagementWrapper = () => {
  const workersFromContext = useAdminState().workerContext.workers;
  let workers = [ ...workersFromContext ].sort(sortByWorkerFullName); // TODO type out workers?

  const [state, setState] = useState(initialManagementWrapperState);

  const [userEntryFormState, setUserEntryFormState] = useState(initialUserEntryFormState);

  if (state.filterBy !== "show-all") {
    workers = workers.filter(worker => worker.attributes.manager_n_number === state.filterBy);
  }
  if (state.deltaToggle) {
    workers = workers.filter(worker => worker.skillsDifferent);
  }
  const trimmedSearch = state.searchBy.trim();
  if (trimmedSearch !== "") {
    workers = workers.filter(worker => filterByNameAndSkills(worker, trimmedSearch));
  }

  const {
    workersStart,
    workersEnd
  } = getWorkersStartAndEnd(state.pageSelected, workers);

  const setStateFromDeltaToggle = (deltaToggle: boolean) => setState({
    ...state,
    deltaToggle,
    pageSelected: 1
  });

  const setStateFromFilterChange = (filterBy: string) => setState({
    ...state,
    pageSelected: 1,
    filterBy
  });

  const setStateFromPageChange = (pageSelected: number) => setState({
    ...state,
    pageSelected
  });

  const setStateFromSearchChange = (searchBy: string) => setState({
    ...state,
    pageSelected: 1,
    searchBy
  });

  return (
    <ManagementContainer>
      <Modal disableBackdropClick={true} open={userEntryFormState.open}>
        <UserEntryForm handleClose={() => setUserEntryFormState({
          formMode: "",
          open: false,
          worker: null
        })} />
      </Modal>
      <ManagementHeader
        filterBy={state.filterBy}
        searchBy={state.searchBy}
        setFilter={setStateFromFilterChange}
        setSearch={setStateFromSearchChange}
        setUserEntryFormState={setUserEntryFormState} />
      <StyledPaper elevation={3}>
        <ManagementTable
          deltaToggle={state.deltaToggle}
          setDeltaToggle={setStateFromDeltaToggle}
          setUserEntryFormState={setUserEntryFormState}
          workers={workers.slice(workersStart, workersEnd)} />
      </StyledPaper>
      <ManagementPagination
        end={workersEnd}
        length={workers.length}
        page={state.pageSelected}
        setPage={setStateFromPageChange}
        start={workersStart + 1}/>
    </ManagementContainer>
  );
};