import {
  ManagementWrapperState,
  UserModalState
} from "./ManagementWrapper.Interfaces";
import {
  ManagementContainer,
  StyledPaper
} from "./ManagementWrapper.Styles";
import { Modal } from "@material-ui/core";
import {
  ManagementHeader,
  ManagementPagination,
  ManagementTable,
  MergeUsersModal,
  UserEntryForm
} from "components";
import {
  useAdminState,
  FormStateProvider
} from "context";
import {
  Worker,
  workersPerPage
} from "globals";
import React, {
  useState
} from "react";
import {
  filterByNameAndSkills,
  sortWorkersByFullName
} from "utils";

const initialManagementWrapperState: ManagementWrapperState = {
  deltaToggle: false,
  pageSelected: 1,
  filterBy: "show-all",
  searchBy: ""
};

const initialUserModalState: UserModalState = {
  open: false,
  worker: null
};

const getWorkersStartAndEnd = (pageSelected: number, filteredWorkers: Worker[]) => {
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

export const ManagementWrapper: React.FC = () => {
  const workersFromContext = useAdminState().workerContext.workers;
  const skillsFromContext = useAdminState().skillContext.taskrouterSkills;

  let workers = [ ...workersFromContext ].sort(sortWorkersByFullName);

  const [state, setState] = useState(initialManagementWrapperState);

  const [userModalState, setUserModalState] = useState(initialUserModalState);

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
    <FormStateProvider>
      <ManagementContainer>
        <Modal disableBackdropClick={true} open={userModalState.open}>
          <UserEntryForm
            handleClose={() => setUserModalState(initialUserModalState) }
            worker={userModalState.worker}
            skills={skillsFromContext}
            workers={workersFromContext.sort(sortWorkersByFullName)}
          />
        </Modal>
        <Modal disableBackdropClick={true} open={userModalState.open}>
          <MergeUsersModal />
        </Modal>
        <ManagementHeader
          filterBy={state.filterBy}
          searchBy={state.searchBy}
          setFilter={setStateFromFilterChange}
          setSearch={setStateFromSearchChange}
          setUserModalState={setUserModalState} />
        <StyledPaper elevation={3}>
          <ManagementTable
            deltaToggle={state.deltaToggle}
            setDeltaToggle={setStateFromDeltaToggle}
            setUserModalState={setUserModalState}
            skills={skillsFromContext}
            paginatedWorkers={workers.slice(workersStart, workersEnd)}
            workers={workersFromContext.sort(sortWorkersByFullName)}
          />
        </StyledPaper>
        <ManagementPagination
          end={workersEnd}
          length={workers.length}
          page={state.pageSelected}
          setPage={setStateFromPageChange}
          start={workersStart + 1}/>
      </ManagementContainer>
    </FormStateProvider>
  );
};