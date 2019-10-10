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
  const [aName, bName] = [a.attributes.full_name, b.attributes.full_name];
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
  const workers = useAdminState().workerContext.workers;
  const sortedWorkers = [ ...workers ].sort(sortByWorkerFullName);

  const [state, setState] = useState({
    pageSelected: 1,
    filterBy: "show-all"
  });

  const filteredWorkers = state.filterBy === "show-all"
    ? sortedWorkers
    : sortedWorkers.filter(worker => worker.attributes.manager_n_number === state.filterBy);

  const {
    workersStart,
    workersEnd
  } = getWorkersStartAndEnd(state.pageSelected, filteredWorkers);

  const setStateFromFilterChange = filterBy => setState({
    pageSelected: 1,
    filterBy
  });

  const setStateFromPageChange = pageSelected => setState({
    pageSelected,
    filterBy: state.filterBy
  });

  return (
    <ManagementContainer>
      <ManagementFilter
        filterBy={state.filterBy}
        setFilter={setStateFromFilterChange} />
      <StyledPaper elevation={3}>
        <ManagementTable
          workers={filteredWorkers.slice(workersStart, workersEnd)} />
      </StyledPaper>
      <ManagementPagination
        end={workersEnd}
        length={filteredWorkers.length}
        page={state.pageSelected}
        setPage={setStateFromPageChange}
        start={workersStart + 1}/>
    </ManagementContainer>
  );
};

export default ManagementWrapper;