import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 200px;
  height: ${props => props.theme.inputHeight}px;
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
      />
    </Wrapper>
  );
};

FilterableSelect.propTypes = {
  optionsList: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired
};


export default FilterableSelect;
