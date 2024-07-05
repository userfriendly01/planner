import { PriorityDropdownProps } from "usermanagement/SkillLevels.Interfaces";
import { Dropdown } from "components/Dropdown";
import React from "react";

export const SkillLevels = (props: PriorityDropdownProps) => {
  const {
    availablePriorities,
    priorityValue,
    updatePriority
  } = props;

  return (
    <Dropdown
      disableClear
      styles={{
        small: true,
        noBorder: true,
        height: "40px"
      }}
      options={availablePriorities.map((priority: number) => ({
        label: String(priority),
        value: priority
      }))}
      updateValue={(_event: any, selectedLevel: any) => updatePriority(selectedLevel.value)}
      value={{
        label: String(priorityValue),
        value: priorityValue
      }}
    />
  );
};