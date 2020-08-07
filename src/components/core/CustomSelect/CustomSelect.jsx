import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  OutlinedInput,
  Select
} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const getOptions = (optionsList, optionsDisplayFunc, noBlankValue) => {
  const getOption = (key, value, display) => (
    <option key={key} value={value} data-testid={"select-option"}>
      {display}
    </option>
  );
  const options = [];
  if (!noBlankValue) {
    options.push(getOption("select-blank-entry", "", ""));
  }
  optionsList.forEach(option => {
    const elementOptions = optionsDisplayFunc(option);
    options.push(getOption(elementOptions.key, elementOptions.value, elementOptions.display));
  });
  return options;
};

const OutlinedSelectFormControl = styled(FormControl)`
  && {
    margin: 8px 0;
  }
`;

export const OutlinedSelect = props => {
  const {
    disabled,
    error,
    helperText,
    label,
    labelWidth,
    noBlankValue,
    optionsDisplayFunc,
    optionsList,
    updateValue,
    value
  } = props;

  return (
    <OutlinedSelectFormControl variant={"outlined"} error={error}>
      <InputLabel htmlFor={`outlined-${label}-native-simple`}>
        {label}
      </InputLabel>
      <Select
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
        inputProps={{ "data-testid": "outlined-select-input" }}
      >
        {getOptions(optionsList, optionsDisplayFunc, noBlankValue)}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </OutlinedSelectFormControl>
  );
};

OutlinedSelect.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelWidth: PropTypes.number.isRequired,
  noBlankValue: PropTypes.bool,
  optionsDisplayFunc: PropTypes.func.isRequired,
  optionsList: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

const SimpleSelectInput = styled(Input)`
  && {
    font-size: inherit;
  }
`;

export const SimpleSelect = props => {
  const {
    disabled,
    fontSize,
    noBlankValue,
    optionsDisplayFunc,
    optionsList,
    value,
    updateValue
  } = props;

  return (
    <FormControl>
      <Select
        disabled={disabled}
        input={<SimpleSelectInput fontSize={fontSize}/>}
        inputProps={{ "data-testid": "simple-select-input" }}
        native
        onChange={event => updateValue(event.target.value)}
        value={value}
      >
        {getOptions(optionsList, optionsDisplayFunc, noBlankValue)}
      </Select>
    </FormControl>
  );
};

SimpleSelect.propTypes = {
  disabled: PropTypes.bool,
  fontSize: PropTypes.string,
  noBlankValue: PropTypes.bool,
  optionsDisplayFunc: PropTypes.func.isRequired,
  optionsList: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};