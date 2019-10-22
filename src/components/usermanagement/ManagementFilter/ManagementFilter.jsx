import {
  AddUser,
  ManagerFilter,
  SearchBox
} from "components";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ControlsWrapper = styled.div`
  align-items: center;
  display: flex;
  padding 1%;
`;

const ControlItem = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  &:first-child {
    justify-content: flex-start;
    margin-right: auto;
  }
  &:last-child {
    justify-content: flex-end;
    margin-left: auto;
  }
`;

const ManagementFilter = props => {
  const {
    filterBy,
    searchBy,
    setFilter,
    setSearch
  } = props;

  return (
    <ControlsWrapper>
      <ControlItem>
        <ManagerFilter filterBy={filterBy} setFilter={setFilter}/>
      </ControlItem>
      <ControlItem>
        <SearchBox searchBy={searchBy} setSearch={setSearch}/>
      </ControlItem>
      <ControlItem>
        <AddUser />
      </ControlItem>
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
