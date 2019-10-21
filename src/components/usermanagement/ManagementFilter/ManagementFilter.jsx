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
  justify-content: space-between;
  padding 1%;
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
      <ManagerFilter filterBy={filterBy} setFilter={setFilter}/>
      <SearchBox searchBy={searchBy} setSearch={setSearch}/>
      <AddUser />
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
