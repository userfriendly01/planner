import {
  FilledInput,
  FormControl,
  InputLabel,
  Select
} from "@material-ui/core";
import { useAdminState } from "context";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { sortManagersByName } from "utils";

const Wrapper = styled.div`
  display: flex;
`;

const ManagerFilter = props => {
  const {
    filterBy,
    setFilter
  } = props;

  const managers = useAdminState().managerContext.managers;
  const sortedManagers = [ ...managers ].sort(sortManagersByName);

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

ManagerFilter.propTypes = {
  filterBy: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired
};

export default ManagerFilter;
