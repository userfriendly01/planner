import {
  ManagerFilter,
  ResetSkillsButton,
  SearchBox,
  StyledButton
} from "components";
import { formModes } from "globals";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ControlsWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 1%;
`;

const ControlItem = styled.div`
  align-items: center;
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

const RightPadding = styled.div`
  padding-right: 8px;
`;

const ManagementHeader = props => {
  const {
    filterBy,
    searchBy,
    setFilter,
    setSearch,
    setUserEntryFormState
  } = props;

  const addUserOnClick = () => setUserEntryFormState({
    open: true,
    worker: null
  });

  return (
    <ControlsWrapper>
      <ControlItem>
        <ManagerFilter filterBy={filterBy} setFilter={setFilter}/>
      </ControlItem>
      <ControlItem>
        <SearchBox searchBy={searchBy} setSearch={setSearch}/>
      </ControlItem>
      <ControlItem>
        <RightPadding>
          <ResetSkillsButton />
        </RightPadding>
        <StyledButton onClick={addUserOnClick} data-testid={"add-user-button"}>
          Add User
        </StyledButton>
      </ControlItem>
    </ControlsWrapper>
  );
};

ManagementHeader.propTypes = {
  filterBy: PropTypes.string.isRequired,
  searchBy: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  setUserEntryFormState: PropTypes.func.isRequired
};

export default ManagementHeader;
