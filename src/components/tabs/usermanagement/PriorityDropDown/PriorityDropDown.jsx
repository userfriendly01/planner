import { Dropdown } from "components";
import PropTypes from "prop-types";
import React from "react";

const PriorityDropDown = props => {
  const {
    availablePriorities,
    priorityValue,
    updatePriority
  } = props;

  return (
    <Dropdown
      styles={{
        small: true,
        noBorder: true,
        height: "40px"
      }}
      options={availablePriorities.map(priority => ({
        label: priority.toString(),
        value: priority
      }))}
      updateValue={(event, selectedRoles) => updatePriority(selectedRoles.value)}
      value={{
        label: priorityValue.toString(),
        value: priorityValue
      }}
    />
  );
};

PriorityDropDown.propTypes = {
  availablePriorities: PropTypes.arrayOf(PropTypes.number),
  priorityValue: PropTypes.number,
  updatePriority: PropTypes.func.isRequired
};

export default PriorityDropDown;