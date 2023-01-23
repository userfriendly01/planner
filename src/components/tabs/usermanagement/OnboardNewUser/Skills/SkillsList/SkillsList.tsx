import { SkillDropdownProps } from "./SkillsList.Interfaces";
import { Dropdown } from "components";
import { useFormState } from "context";
import { formModes } from "globals";
import React from "react";

const SkillsList = (props: SkillDropdownProps) => {
  const {
    skills,
    updateSkill,
    skill
  } = props;

  const form = useFormState();

  const getSkillOptions = (optionsList: any) => {
    return optionsList.map((option: any) => ({
      value: option.name,
      label: option.name
    }));
  };

  return (
    <Dropdown
      disabled={form.formMode === formModes.DELETE}
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

export default SkillsList;