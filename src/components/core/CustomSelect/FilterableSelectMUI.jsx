import React, { useState } from "react";
import {
  NativeSelect,
  InputBase
} from "@material-ui/core";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledSelect = styled(NativeSelect)`
  width: 200px;
`;

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

const FilterableSelect = (
  {
    optionsList,
    optionsDisplayFunc,
    noBlankValue
  }
) => {

  const [age, setAge] = useState("");
  const handleChange = event => {
    setAge(event.target.value);
  };

  return (
    <StyledSelect
      value={age}
      onChange={handleChange}
      input={<InputBase />}
    >
      {getOptions(optionsList, optionsDisplayFunc, noBlankValue)}
    </StyledSelect>
  );
};

FilterableSelect.propTypes = {
  disabled: PropTypes.bool,
  noBlankValue: PropTypes.bool,
  optionsDisplayFunc: PropTypes.func.isRequired,
  optionsList: PropTypes.array.isRequired,
  updateValue: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default FilterableSelect;