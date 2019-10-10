import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const AddPriorityDropDown = props => {
  const {
    availablePriorities,
    disabled,
    priorityValue,
    updatePriority
  } = props;

  return (
    <CustomSelect
      disabled={disabled}
      label={""}
      labelWidth={0}
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

AddPriorityDropDown.propTypes = {
  availablePriorities: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  priorityValue: PropTypes.number,
  updatePriority: PropTypes.func.isRequired
};

export default AddPriorityDropDown;