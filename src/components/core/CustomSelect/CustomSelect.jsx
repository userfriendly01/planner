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

const CustomSelect = props => {
  const {
    disabled,
    label,
    labelWidth,
    optionsDisplayFunc,
    optionsList,
    updateValue,
    value
  } = props;

  return (
    <FormField variant="outlined">
      <InputLabel htmlFor={`outlined-${label}-native-simple`}>
        {label}
      </InputLabel>
      <Select
        disabled={disabled}
        native
        value={value}
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
        <option value="" />
        {optionsList.map(option => {
          const {
            display,
            key,
            value
          } = optionsDisplayFunc(option);
          return (
            <option
              key={key}
              value={value}
            >
              {display}
            </option>
          );
        })}
      </Select>
    </FormField>
  );
};

CustomSelect.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  labelWidth: PropTypes.number,
  optionsList: PropTypes.array.isRequired,
  optionsDisplayFunc: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};

export default CustomSelect;