import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import styled from "styled-components";
import { OutlinedInput } from "@material-ui/core";

const Wrapper = styled.div`
  width: 200px;
  height: ${props => props.theme.inputHeight}px;
  z-index: 2;
`;
const FilterableSelect = props => {
  const {
    optionsList,
    updateValue
  } = props;

  return (
    <Wrapper>
      <Select
        clearable={true}
        onChange={updateValue}
        onSelectResetsInput={true}
        options={optionsList}
        searchable={true}
        input={
          <OutlinedInput
            name={"Roles"}
            labelWidth={"200px"}
          />
        }
      />
    </Wrapper>
  );
};

FilterableSelect.propTypes = {
  optionsList: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired
};


export default FilterableSelect;
