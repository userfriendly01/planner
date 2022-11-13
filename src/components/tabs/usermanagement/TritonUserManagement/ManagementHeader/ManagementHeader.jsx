import {
  ControlItem,
  ControlsWrapper
} from "./ManagementHeader.Styles";
import {
  ManagerDropdown,
  ResetSkillsButton,
  SearchBox
} from "components";
import PropTypes from "prop-types";
import React from "react";

const ManagementHeader = props => {
  const {
    filterBy,
    searchBy,
    setFilter,
    setSearch
  } = props;

  return (
    <ControlsWrapper>
      <ControlItem>
        <ManagerDropdown filterBy={filterBy} setFilter={setFilter}/>
      </ControlItem>
      <ControlItem>
        <SearchBox searchBy={searchBy} setSearch={setSearch}/>
      </ControlItem>
      <ControlItem>
        <ResetSkillsButton />
      </ControlItem>
    </ControlsWrapper>
  );
};

ManagementHeader.propTypes = {
  filterBy: PropTypes.string.isRequired,
  searchBy: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default ManagementHeader;
