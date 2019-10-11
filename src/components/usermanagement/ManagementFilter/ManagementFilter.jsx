import {
  Fab,
  FilledInput,
  FormControl,
  InputLabel,
  Modal,
  Select,
  Tooltip
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {
  AddUserModal,
  AddManagerModal,
  SearchBox,
  StyledButton
} from "components";
import { useAdminState } from "context";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";
import { sortManagersByName } from "utils";

const ControlsWrapper = styled.div`
  display: flex;
  padding 1%;
`;

const AddUserButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-self: flex-end;
  margin-left: auto;
`;

const AddManagerButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-left: 8px;
`;

const ManagementFilter = props => {
  const {
    filterBy,
    searchBy,
    setFilter,
    setSearch
  } = props;

  const managers = useAdminState().managerContext.managers;
  const sortedManagers = [ ...managers ].sort(sortManagersByName);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);

  const handleOpenAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUser = () => {
    setIsAddUserModalOpen(false);
  };

  const handleOpenAddManager = () => {
    setIsAddManagerModalOpen(true);
  };

  const handleCloseAddManager = () => {
    setIsAddManagerModalOpen(false);
  };

  return (
    <ControlsWrapper>
      <FormControl variant="filled">
        <InputLabel shrink htmlFor="filled-filter-native-simple">
          Manager Filter
        </InputLabel>
        <Select
          native
          value={filterBy}
          onChange={event => setFilter(event.target.value)}
          input={
            <FilledInput name="filter" id="filled-filter-native-simple" />
          }
          inputProps={{ "data-testid": "select" }}
        >
          {[
            <option data-testid="manager-list" key={"show-all"} value={"show-all"}>Show All</option>,
            ...sortedManagers.map(manager => (
              <option data-testid="manager-list"
                key={manager.manager_n_number}
                value={manager.manager_n_number}
              >
                {manager.manager_first_name} {manager.manager_last_name}
              </option>
            ))
          ]}
        </Select>
      </FormControl>
      <Tooltip title="Add a manager" placement="right">
        <AddManagerButtonWrapper>
          <Fab onClick={handleOpenAddManager} size={"small"} data-testid={"add-manager-button"}>
            <AddIcon/>
          </Fab>
        </AddManagerButtonWrapper>
      </Tooltip>
      <SearchBox searchBy={searchBy} setSearch={setSearch}/>
      <AddUserButtonWrapper>
        <StyledButton onClick={handleOpenAddUser} data-testid={"add-user-button"}>
          Add User
        </StyledButton>
      </AddUserButtonWrapper>
      <Modal disableBackdropClick={true} open={isAddUserModalOpen}>
        <AddUserModal handleClose={handleCloseAddUser} />
      </Modal>
      <Modal disableBackdropClick={true} open={isAddManagerModalOpen}>
        <AddManagerModal handleClose={handleCloseAddManager} />
      </Modal>
    </ControlsWrapper>
  );
};

ManagementFilter.propTypes = {
  filterBy: PropTypes.string.isRequired,
  searchBy: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default ManagementFilter;
