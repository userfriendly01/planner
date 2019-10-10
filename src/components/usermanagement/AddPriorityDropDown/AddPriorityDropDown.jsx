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

  console.log(priorityValue === "");
  console.log(typeof priorityValue);

  // we want error to be true when disabledProp is false but nothing has been selected, i.e. priorityValue === ""

  return (
    <CustomSelect
      disabled={disabled}
      error={!disabled && priorityValue === ""}
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