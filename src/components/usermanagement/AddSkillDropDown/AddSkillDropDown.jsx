import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const AddSkillDropDown = props => {
  const {
    availableSkills,
    skillValue,
    updateSkill
  } = props;

  return (
    <CustomSelect
      label={"Add Default Skill"}
      labelWidth={120}
      optionsList={availableSkills.skills}
      optionsDisplayFunc={option => {
        return {
          display: option,
          key: option,
          value: option
        };
      }}
      updateValue={updateSkill}
      value={skillValue}
    />
  );
};

AddSkillDropDown.propTypes = {
  availableSkills: PropTypes.shape({
    levels: PropTypes.object.isRequired,
    skills: PropTypes.array.isRequired
  }),
  skillValue: PropTypes.string.isRequired,
  updateSkill: PropTypes.func.isRequired
};

export default AddSkillDropDown;