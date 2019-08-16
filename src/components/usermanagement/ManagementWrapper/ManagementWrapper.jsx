import { Paper } from "@material-ui/core";
import {
  ManagementFilter,
  ManagementPagination,
  ManagementTable
} from "components";
import { useStateValue } from "context";
import React, {
  useEffect,
  useState
} from "react";
import { getUniqueManagerList } from "utils";
import styled from "styled-components";

const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const workersPerPage = 10;

const ManagementWrapper = () => {
  const [{
    workerContext: {
      workers
    }
  // eslint-disable-next-line no-unused-vars
  }, dispatch] = useStateValue();
  const [filterBy, setFilterBy] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [workersStart, setWorkersStart] = useState(1);
  const [workersEnd, setWorkersEnd] = useState(workersPerPage);
  const [pageSelected, setPageSelected] = useState(1);

  useEffect(() => {
    if (pageSelected * workersPerPage > filteredWorkers.length) {
      setWorkersEnd((((pageSelected - 1) * workersPerPage) + (filteredWorkers.length % workersPerPage)));
    } else {
      setWorkersEnd(pageSelected * workersPerPage);
    }
    setWorkersStart(((pageSelected - 1) * workersPerPage) + 1);
  }, [filteredWorkers, pageSelected]);

  useEffect(() => {
    setPageSelected(1);
    if (filterBy === "") {
      setFilteredWorkers(workers);
    } else {
      setFilteredWorkers(workers.filter(worker => worker.attributes.manager_n_number === filterBy));
    }
    setFilterOptions(getUniqueManagerList(workers));
  }, [filterBy, workers]);

  return (
    <ManagementContainer>
      <ManagementFilter filterBy={filterBy} options={filterOptions} setFilter={setFilterBy} />
      <StyledPaper elevation={3}>
        <ManagementTable workers={filteredWorkers.slice(workersStart - 1, workersEnd)} />
      </StyledPaper>
      <ManagementPagination end={workersEnd} length={filteredWorkers.length} page={pageSelected} setPage={setPageSelected} start={workersStart}/>
    </ManagementContainer>
  );
};

export default ManagementWrapper;