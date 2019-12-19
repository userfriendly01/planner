import { FilterableSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const SkillDropDown = props => {
  const {
    taskrouterSkills,
    updateSkill
  } = props;

  const getSkillOptions = optionsList => {
    return optionsList.map(option => ({
      value: option.skill,
      label: option.skill
    }));
  };

  return (
    <FilterableSelect
      optionsList={getSkillOptions(taskrouterSkills)}
      updateValue={updateSkill}
    />
  );
};

SkillDropDown.propTypes = {
  taskrouterSkills: PropTypes.arrayOf(
    PropTypes.shape({
      skill: PropTypes.string.isRequired,
      levels: PropTypes.arrayOf(PropTypes.number)
    })
  ).isRequired,
  updateSkill: PropTypes.func.isRequired
};

export default SkillDropDown;