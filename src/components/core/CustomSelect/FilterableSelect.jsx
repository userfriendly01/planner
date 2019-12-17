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
    skillValue,
    updateSkill
  } = props;

  const getOptions = optionsList => {
    const optionsArray = [];
    optionsList.map(option => {
      const optionObject = {
        value: option.skill,
        label: option.skill
      };
      optionsArray.push(optionObject);
    });
    return optionsArray;
  };

  return (
    <Wrapper>
      <Select
        clearable={true}
        onChange={() => updateSkill(event.target.innerText)}
        onSelectResetsInput={true}
        options={getOptions(optionsList)}
        searchable={true}
        value={skillValue}
      />
    </Wrapper>
  );
};

FilterableSelect.propTypes = {
  optionsList: PropTypes.array.isRequired,
  skillValue: PropTypes.object,
  updateSkill: PropTypes.func.isRequired
};


export default FilterableSelect;
