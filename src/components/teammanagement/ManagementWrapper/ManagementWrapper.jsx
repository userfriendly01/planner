import {
  FilledInput,
  FormControl,
  InputLabel,
  Paper,
  Select
} from "@material-ui/core";
import { ManagementTable } from "components";
import { WorkersContext } from "context";
import React, {
  useContext,
  useEffect,
  useState
} from "react";
import { getUniqueManagerList } from "utils";
import styled from "styled-components";

const Highlight = styled.span`
  color: #1A1446;
`;

const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1% 2% 1% 2%;
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

const PageSection = styled.div`
  color: #C0BFC0;
  font-size: 1em;
`;

const ShowingSection = styled.div`
  color: #C0BFC0;
  font-size: .825em;
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
  }, [filterBy, workers]);

  const buttons = [];
  const filterOptions = getUniqueManagerList(workers);
  const numWorkers = filteredWorkers.length;
  const numPages = Math.ceil(numWorkers / workersPerPage);

  for (let i = 0; i < numPages; i++) {
    const page = i + 1;
    buttons.push(<PageButton key={i} value={page} pageSelected={pageSelected} onClick={() => setPageSelected(page)}>{page}</PageButton>);
  }

  const handleChange = () => event => {
    const filter = event.target.value;
    setFilterBy(filter);
  };

  return (
    <ManagementContainer>
      <FormControl variant="filled">
        <InputLabel shrink htmlFor="filled-filter-native-simple">Manager Filter</InputLabel>
        <Select
          native
          value={filterBy}
          onChange={handleChange()}
          input={<FilledInput name="filter" id="filled-filter-native-simple" />}
        >
          <option value="">Show All</option>
          {
            filterOptions.map(manager => <option key={manager.manager_n_number} value={manager.manager_n_number}>{manager.manager_first_name} {manager.manager_last_name}</option>)
          }
        </Select>
      </FormControl>
      <StyledPaper elevation={3}>
        <ManagementTable workers={filteredWorkers.slice((workersStart - 1), workersEnd)} ></ManagementTable>
      </StyledPaper>
      <PaginationWrapper>
        <ShowingSection>
          Showing <Highlight>{workersStart}</Highlight> to <Highlight>{workersEnd}</Highlight> of <Highlight>{filteredWorkers.length}</Highlight> workers
        </ShowingSection>
        <PageSection>
          Pages: {buttons}
        </PageSection>
      </PaginationWrapper>
    </ManagementContainer>
  );
};

export default ManagementWrapper;