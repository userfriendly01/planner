import { PriorityDropdownProps } from "./";
import { Dropdown } from "components";
import React from "react";

const PriorityDropdown = (props: PriorityDropdownProps) => {
  const {
    availablePriorities,
    priorityValue,
    updatePriority
  } = props;

  return (
    <Dropdown
      styles={{
        small: true,
        noBorder: true,
        height: "40px"
      }}
      options={availablePriorities.map((priority: number) => ({
        label: priority.toString(),
        value: priority
      }))}
      updateValue={(event: any, selectedRoles: any) => updatePriority(selectedRoles.value)}
      value={{
        label: priorityValue.toString(),
        value: priorityValue
      }}
    />
  );
};

export default PriorityDropdown;