import {
  ManagementWrapperState,
  UserModalState
} from "./TritonUserManagementWrapper.Interfaces";
import {
  ManagementContainer,
  StyledPaper
} from "./TritonUserManagementWrapper.Styles";
import {
  ManagementHeader,
  ManagementPagination,
  TritonUserTable
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
import { View } from "../../UserManagementWrapper/UserManagement.Interfaces";
import { WorkerOpts } from "../../OnboardNewUser/UserEntryFormWrapper.Interfaces";

const initialManagementWrapperState: ManagementWrapperState = {
  deltaToggle: false,
  pageSelected: 1,
  filterBy: "show-all",
  searchBy: ""
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

interface TritonUserManagementWrapperProps {
  workerOpts: WorkerOpts
  setWorkerOpts: (opts: WorkerOpts) => void
  setView: (view: View) => void
  view?: View
}
const TritonUserManagementWrapper: any = (props: TritonUserManagementWrapperProps) => {
  const {
    workerOpts,
    setWorkerOpts,
    view,
    setView
  } = props;
  const workersFromContext = useAdminState().workerContext.workers;
  const skillsFromContext = useAdminState().skillContext.skills;

  let workers = [ ...workersFromContext ].sort(sortWorkersByFullName);

  const [state, setState] = useState(initialManagementWrapperState);

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
      <ManagementHeader
        filterBy={state.filterBy}
        searchBy={state.searchBy}
        setFilter={setStateFromFilterChange}
        setSearch={setStateFromSearchChange} />
      <StyledPaper elevation={3}>
        <TritonUserTable
          view={view}
          setView={setView}
          workerOpts={workerOpts}
          setWorkerOpts={setWorkerOpts}
          deltaToggle={state.deltaToggle}
          setDeltaToggle={setStateFromDeltaToggle}
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
  );
};

export default TritonUserManagementWrapper;