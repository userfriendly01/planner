import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 200px;
  height: ${props => props.theme.inputHeight}px;
`;
const FilterableSelectReact = props => {
  const {
    optionsList,
    skillValue,
    updateSkill
  } = props;

  console.log(optionsList);
  const test = [
    {
      value: "chocolate",
      label: "Chocolate"
    },
    {
      value: "strawberry",
      label: "Strawberry"
    },
    {
      value: "vanilla",
      label: "Vanilla"
    }
  ];

  return (
    <Wrapper>
      <Select
        clearable={true}
        disabled={false}
        noResultsText="" // do not show "no results found"... allow users to enter own number
        onChange={updateSkill}
        onSelectResetsInput={true}
        options={test}
        placeholder={"wait here"}
        searchable={true}
        value={skillValue}
      />
    </Wrapper>
  );
};

FilterableSelectReact.propTypes = {
  optionsList: PropTypes.array.isRequired,
  skillValue: PropTypes.object,
  updateSkill: PropTypes.func.isRequired
};


export default FilterableSelectReact;
