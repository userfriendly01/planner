import React from "react";
import TextField from "@material-ui/core/Textfield";
import Autocomplete from "@material-ui/lab/Autocomplete";
import styled from "styled-components";
import PropTypes from "prop-types";

const FilterableSelect = props => {
  const {
    optionsList
  } = props;

  const StyledTextField = styled(TextField)`
    margin: 0px;
  `;

  const StyledAutoComplete = styled(Autocomplete)`
    width: 200px;
  `;

  console.log("I'm on options list! ", optionsList);

  const test = [{ name: "option 1" }, { name: "option 2" }];

  return (
    <StyledAutoComplete
      options={test}
      getOptionLabel={option => option.name}
      disabled={false}
      style={{ margin: "0" }}
      renderInput={params => (
        <StyledTextField {...params} varient="outlined" fullWidth />
      )}
    />
  );
};

FilterableSelect.propTypes = {
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

export default FilterableSelect;