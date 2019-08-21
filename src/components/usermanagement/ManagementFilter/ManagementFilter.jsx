import {
  ButtonBase,
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
  AddManagerModal
} from "components";
import { useAdminState } from "context";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";

const ControlsWrapper = styled.div`
  display: flex;
  padding 1%;
`;

const AddUserButton = styled(ButtonBase)`
  && {
    background-color: #AAEDED;
    border: none;
    border-radius: 3px;
    color: theme.textColor;
    cursor: pointer;
    font-size: 1.15em;
    font-weight: 700;
    justify-self: flex-end;
    margin-left: auto;
    margin-right: 1em;
    outline: none;
    padding: 5 10 5 10;
  }
`;

const AddManagerButton = styled(ButtonBase)`
  && {
    align-self: center;
    background-color: rgba(0, 0, 0, 0.09);
    border: none;
    border-radius: 50%;
    color: theme.textColor;
    cursor: pointer;
    font-size: 1.15em;
    font-weight: 700;
    height: 2em;
    margin-left: .5em;
    outline: none;
    padding: 5 10 5 10;
    width: 2em;
  }
`;

const ManagementFilter = props => {
  const {
    filterBy,
    setFilter
  } = props;

  const {
    managerContext: {
      managers
    }
  } = useAdminState();

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
          input={<FilledInput name="filter" id="filled-filter-native-simple" />}
        >
          <option value="">Show All</option>
          {managers.map(manager => (
            <option
              key={manager.manager_n_number}
              value={manager.manager_n_number}
            >
              {manager.manager_first_name} {manager.manager_last_name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Tooltip title="Add a manager" placement="right">
        <AddManagerButton onClick={handleOpenAddManager}>
          <AddIcon/>
        </AddManagerButton>
      </Tooltip>
      <AddUserButton onClick={handleOpenAddUser}>Add User</AddUserButton>
      <Modal disableBackdropClick={true} open={isAddUserModalOpen}>
        <AddUserModal handleClose={handleCloseAddUser} managerList={managers} />
      </Modal>
      <Modal disableBackdropClick={true} open={isAddManagerModalOpen}>
        <AddManagerModal handleClose={handleCloseAddManager} />
      </Modal>
    </ControlsWrapper>
  );
};

ManagementFilter.propTypes = {
  filterBy: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired
};

export default ManagementFilter;
