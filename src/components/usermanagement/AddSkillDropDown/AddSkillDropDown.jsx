import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React from "react";
import { sortSkillsByName } from "utils";

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
      optionsList={availableSkills.sort(sortSkillsByName)}
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
  availableSkills: PropTypes.array.isRequired,
  skillValue: PropTypes.string.isRequired,
  updateSkill: PropTypes.func.isRequired
};

export default AddSkillDropDown;