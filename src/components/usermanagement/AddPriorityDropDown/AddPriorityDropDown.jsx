import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const AddPriorityDropDown = props => {
  const {
    disabled,
    max,
    priorityValue,
    updatePriority
  } = props;

  const getOptionsList = max => {
    const options = [];
    for (let i = 1; i <= max; i++) {
      options.push(i);
    }
    return options;
  };

  return (
    <CustomSelect
      disabled={disabled}
      label={""}
      labelWidth={0}
      optionsList={getOptionsList(max)}
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
  disabled: PropTypes.bool,
  max: PropTypes.number,
  priorityValue: PropTypes.string.isRequired,
  updatePriority: PropTypes.func.isRequired
};

export default AddPriorityDropDown;