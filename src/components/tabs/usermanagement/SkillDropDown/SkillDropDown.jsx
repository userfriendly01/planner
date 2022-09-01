import { Dropdown } from "components";
import PropTypes from "prop-types";
import React from "react";

const SkillDropDown = props => {
  const {
    skills,
    updateSkill,
    skill
  } = props;

  const getSkillOptions = optionsList => {
    return optionsList.map(option => ({
      value: option.name,
      label: option.name
    }));
  };

  return (
    <Dropdown
      styles={{
        small: true,
        height: "40px",
        width: "180px"
      }}
      options={getSkillOptions(skills)}
      value={{
        label: skill,
        value: skill
      }}
      updateValue={(event, newInputValue) => updateSkill(newInputValue)}
    />
  );
};

SkillDropDown.propTypes = {
  skills: PropTypes.arrayOf(
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