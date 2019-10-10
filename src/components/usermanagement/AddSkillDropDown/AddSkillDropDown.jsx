import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React from "react";
import { sortTaskRouterSkillByName } from "utils";

const AddSkillDropDown = props => {
  const {
    taskrouterSkills,
    skillValue,
    updateSkill
  } = props;

  return (
    <CustomSelect
      label={"Add Default Skill"}
      labelWidth={120}
      optionsList={taskrouterSkills.sort(sortTaskRouterSkillByName)}
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

AddSkillDropDown.propTypes = {
  taskrouterSkills: PropTypes.array.isRequired,
  skillValue: PropTypes.string,
  updateSkill: PropTypes.func.isRequired
};

export default AddSkillDropDown;