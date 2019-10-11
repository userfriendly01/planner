import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select
} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FormField = styled(FormControl)`
  && {
    margin: 2%;
  }
`;

const getOption = (key, value, display) => (
  <option key={key} value={value}>
    {display}
  </option>
);

const CustomSelect = props => {
  const {
    disabled,
    error,
    label,
    labelWidth,
    optionsDisplayFunc,
    optionsList,
    noBlankValue,
    updateValue,
    value
  } = props;

  const options = [];
  if (!noBlankValue) {
    options.push(getOption("blank-starting-entry", "", ""));
  }
  optionsList.forEach(option => {
    const elementOptions = optionsDisplayFunc(option);
    options.push(getOption(elementOptions.key, elementOptions.value, elementOptions.display));
  });

  return (
    <FormField variant="outlined" error={error}>
      <InputLabel htmlFor={`outlined-${label}-native-simple`}>
        {label}
      </InputLabel>
      <Select
        // defaultValue={null}
        disabled={disabled}
        native
        value={value || ""}
        onChange={event => updateValue(event.target.value)}
        input={
          <OutlinedInput
            name={label}
            labelWidth={labelWidth}
            id={`outlined-${label}-native-simple`}
          />
        }
        inputProps={{ "data-testid": "customSelect" }}
      >
        {options}
      </Select>
    </FormField>
  );
};

CustomSelect.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  labelWidth: PropTypes.number,
  optionsList: PropTypes.array.isRequired,
  optionsDisplayFunc: PropTypes.func.isRequired,
  noBlankValue: PropTypes.bool,
  updateValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default CustomSelect;