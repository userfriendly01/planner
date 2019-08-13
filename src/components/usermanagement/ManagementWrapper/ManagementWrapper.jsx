import { Paper } from "@material-ui/core";
import {
  ManagementFilter,
  ManagementPagination,
  ManagementTable
} from "components";
import { WorkersContext } from "context";
import React, {
  useContext,
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

const PageButton = styled.button`
  background-color: ${props => props.value !== props.pageSelected ? "transparent" : "#1A1446"};
  border: ${props => props.value !== props.pageSelected ? "#C0BFC0" : "#1A1446"};
  border-radius: 5px;
  border-style: solid;
  border-width: 2px;
  color: #C0BFC0;
  cursor: pointer;
  margin: 0 2 0 2;
  outline: none;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const workersPerPage = 10;

const ManagementWrapper = () => {
  const { workers } = useContext(WorkersContext);
  const [filterBy, setFilterBy] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState(workers);
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

  const buttons = [];
  const numWorkers = filteredWorkers.length;
  const numPages = Math.ceil(numWorkers / workersPerPage);

  for (let i = 0; i < numPages; i++) {
    const page = i + 1;
    buttons.push(<PageButton key={i} value={page} pageSelected={pageSelected} onClick={() => setPageSelected(page)}>{page}</PageButton>);
  }

  return (
    <ManagementContainer>
      <ManagementFilter filterBy={filterBy} options={filterOptions} setFilter={setFilterBy} />
      <StyledPaper elevation={3}>
        <ManagementTable workers={filteredWorkers.slice(workersStart - 1, workersEnd)} />
      </StyledPaper>
      <ManagementPagination buttons={buttons} end={workersEnd} length={filteredWorkers.length}  start={workersStart}/>
    </ManagementContainer>
  );
};

export default ManagementWrapper;