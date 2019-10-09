import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React from "react";
import { sortSkillsByName } from "utils";

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
      optionsList={taskrouterSkills.sort(sortSkillsByName)}
      optionsDisplayFunc={option => {
        return {
          display: option.name,
          key: option.name,
          value: option.name
        };
      }}
      updateValue={updateSkill}
      value={skillValue}
    />
  );
};

AddSkillDropDown.propTypes = {
  taskrouterSkills: PropTypes.array.isRequired,
  skillValue: PropTypes.string.isRequired,
  updateSkill: PropTypes.func.isRequired
};

export default AddSkillDropDown;