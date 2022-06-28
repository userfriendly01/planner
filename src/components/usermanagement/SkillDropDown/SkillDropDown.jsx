import { Dropdown } from "components";
import PropTypes from "prop-types";
import React from "react";

const SkillDropDown = props => {
  const {
    taskrouterSkills,
    updateSkill,
    skill
  } = props;

  const getSkillOptions = optionsList => {
    return optionsList.map(option => ({
      value: option.skill,
      label: option.skill
    }));
  };

  return (
    <Dropdown
      styles={{
        small: true,
        height: "40px",
        width: "180px"
      }}
      options={getSkillOptions(taskrouterSkills)}
      value={{
        label: skill,
        value: skill
      }}
      updateValue={(event, newInputValue) => updateSkill(newInputValue)}
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
  skill: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }),
    PropTypes.string.isRequired
  ]),
  updateSkill: PropTypes.func.isRequired
};

export default SkillDropDown;