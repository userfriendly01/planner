import { SimpleSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const SkillDropDown = props => {
  const {
    taskrouterSkills,
    skillValue,
    updateSkill
  } = props;

  return (
    <SimpleSelect
      optionsList={taskrouterSkills}
      optionsDisplayFunc={skillObj => {
        return {
          display: skillObj.skill,
          key: skillObj.skill,
          value: skillObj.skill
        };
      }}
      updateValue={updateSkill}
      value={skillValue}
    />
  );
};

SkillDropDown.propTypes = {
  taskrouterSkills: PropTypes.array.isRequired,
  skillValue: PropTypes.string,
  updateSkill: PropTypes.func.isRequired
};

export default SkillDropDown;