import { SimpleSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const PriorityDropDown = props => {
  const {
    availablePriorities,
    priorityValue,
    updatePriority
  } = props;

  return (
    <SimpleSelect
      noBlankValue={true}
      optionsList={availablePriorities}
      optionsDisplayFunc={option => {
        return {
          display: option,
          key: option,
          value: option
        };
      }}
      updateValue={updatePriority}
      value={priorityValue}
    />
  );
};

PriorityDropDown.propTypes = {
  availablePriorities: PropTypes.array.isRequired,
  priorityValue: PropTypes.number,
  updatePriority: PropTypes.func.isRequired
};

export default PriorityDropDown;