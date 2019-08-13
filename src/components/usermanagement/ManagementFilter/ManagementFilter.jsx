import {
  ButtonBase,
  FilledInput,
  FormControl,
  InputLabel,
  Modal,
  Select
} from "@material-ui/core";
import { AddUserModal } from "components";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
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

const ManagementFilter = props => {
  const {
    filterBy,
    options,
    setFilter
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
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
        >
          <option value="">Show All</option>
          {options.map(manager => (
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
        <AddUserModal handleClose={handleClose} managerList={options} />
      </Modal>
    </ControlsWrapper>
  );
};

ManagementFilter.propTypes = {
  filterBy: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  setFilter: PropTypes.func.isRequired
};

export default ManagementFilter;