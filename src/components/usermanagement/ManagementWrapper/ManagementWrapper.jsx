import { Paper } from "@material-ui/core";
import {
  ManagementFilter,
  ManagementPagination,
  ManagementTable
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

const sortByWorkerFullName = (a, b) => {
  const sortLast = "zzzzzzzzzzz";
  const [aName, bName] = [a.attributes.full_name || sortLast, b.attributes.full_name || sortLast];
  if (aName < bName) { return -1; }
  if (aName > bName) { return 1; }
  return 0;
};

const getWorkersStartAndEnd = (pageSelected, filteredWorkers) => {
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

const ManagementWrapper = () => {
  const workersFromContext = useAdminState().workerContext.workers;
  let workers = [ ...workersFromContext ].sort(sortByWorkerFullName);

  const [state, setState] = useState({
    deltaToggle: false,
    pageSelected: 1,
    filterBy: "show-all",
    searchBy: ""
  });

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

  const setStateFromDeltaToggle = deltaToggle => setState({
    ...state,
    deltaToggle,
    pageSelected: 1
  });

  const setStateFromFilterChange = filterBy => setState({
    ...state,
    pageSelected: 1,
    filterBy
  });

  const setStateFromPageChange = pageSelected => setState({
    ...state,
    pageSelected
  });

  const setStateFromSearchChange = searchBy => setState({
    ...state,
    pageSelected: 1,
    searchBy
  });

  return (
    <ManagementContainer>
      <ManagementFilter
        filterBy={state.filterBy}
        searchBy={state.searchBy}
        setFilter={setStateFromFilterChange}
        setSearch={setStateFromSearchChange} />
      <StyledPaper elevation={3}>
        <ManagementTable
          deltaToggle={state.deltaToggle}
          setDeltaToggle={setStateFromDeltaToggle}
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

export default ManagementWrapper;