import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const OutlinedSelectFormControl = styled(FormControl)`
  && {
    width: 230px;
    margin: 8px 20px;
  }
`;

export const MultiSelect = props => {
  const {
    options,
    label,
    multiple,
    updateValue,
    value
  } = props;

  return (
    <OutlinedSelectFormControl variant={"outlined"} error={false}>
      <InputLabel style={{
        backgroundColor: "white",
        padding: "0 5"
      }} htmlFor={"outlined-${label}-native-simple"}>
        {label}
      </InputLabel>
      <Select
        disabled={false}
        multiple={multiple}
        value={value}
        onChange={event => updateValue(event.target.value)}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))

        }
      </Select>
    </OutlinedSelectFormControl>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  options: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.string
  ])
};