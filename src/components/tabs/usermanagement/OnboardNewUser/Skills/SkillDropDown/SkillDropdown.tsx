import { SkillDropdownProps } from "./";
import { Dropdown } from "components";
import React from "react";

const SkillDropdown = (props: SkillDropdownProps) => {
  const {
    skills,
    updateSkill,
    skill
  } = props;

  const getSkillOptions = (optionsList: any) => {
    return optionsList.map((option: any) => ({
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
      updateValue={(event: any, newInputValue: any) => updateSkill(newInputValue)}
    />
  );
};

export default SkillDropdown;