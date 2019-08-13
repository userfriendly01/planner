import {
  ButtonBase,
  FilledInput,
  FormControl,
  InputLabel,
  Modal,
  Paper,
  Select
} from "@material-ui/core";
import {
  AddUserModal,
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

const ControlsWrapper = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  padding 1%;
`;

const CustomButton = styled(ButtonBase)`
  && {
    background-color: #AAEDED;
    border: none;
    border-radius: 3px;
    color: #1A1446;
    cursor: pointer;
    font-size: 1.15em;
    font-weight: 700;
    outline: none;
    padding: 5 10 5 10;
  }
`;

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <ManagementContainer>
      <ControlsWrapper>
        <FormControl variant="filled">
          <InputLabel shrink htmlFor="filled-filter-native-simple">
            Manager Filter
          </InputLabel>
          <Select
            native
            value={filterBy}
            onChange={event => setFilterBy(event.target.value)}
            input={
              <FilledInput name="filter" id="filled-filter-native-simple" />
            }
          >
            <option value="">Show All</option>
            {filterOptions.map(manager => (
              <option
                key={manager.manager_n_number}
                value={manager.manager_n_number}
              >
                {manager.manager_first_name} {manager.manager_last_name}
              </option>
            ))}
          </Select>
        </FormControl>
        <CustomButton onClick={handleOpen}>Add User</CustomButton>
        <Modal disableBackdropClick={true} open={isModalOpen}>
          <AddUserModal handleClose={handleClose} managerList={filterOptions} />
        </Modal>
      </ControlsWrapper>
      <StyledPaper elevation={3}>
        <ManagementTable workers={filteredWorkers.slice(workersStart - 1, workersEnd)} />
      </StyledPaper>
      <ManagementPagination buttons={buttons} end={workersEnd} length={filteredWorkers.length}  start={workersStart}/>
    </ManagementContainer>
  );
};

export default ManagementWrapper;