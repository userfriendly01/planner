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
    updateSkill
  } = props;

  const getOptions = optionsList => {
    return optionsList.map(option => ({
      value: option.skill,
      label: option.skill
    }));
  };

  return (
    <Wrapper>
      <Select
        clearable={true}
        onChange={updateSkill}
        onSelectResetsInput={true}
        options={getOptions(optionsList)}
        searchable={true}
      />
    </Wrapper>
  );
};

FilterableSelect.propTypes = {
  optionsList: PropTypes.array.isRequired,
  updateSkill: PropTypes.func.isRequired
};


export default FilterableSelect;
