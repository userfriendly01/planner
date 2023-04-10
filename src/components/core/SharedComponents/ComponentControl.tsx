import React from "react";
import TextField from "@mui/material/TextField";
import SelectContainer from "./SelectContainer";
import TimePickerComponent from "./TimepickerComponent";
import { Control } from "globals";
import { Dropdown } from "../index";
import MultiFieldContainer from "./MultiFieldContainer";
export interface ComponentControlProps {
  control: Control,
  dropDownOptions: string[],
  name: string,
  label: string,
  type: string,
  value: any,
  onChange: any,
  disabled?: boolean,
  error: boolean,
  required: boolean,
  isBlankFirstValue?: boolean,
  multiple?: boolean
}
function ComponentControl({
  control,
  dropDownOptions,
  name,
  label,
  type,
  value,
  onChange,
  disabled,
  error,
  required,
  isBlankFirstValue
}: ComponentControlProps): JSX.Element {
  switch (control) {
    case "input":
      return (
        <TextField
          variant="outlined"
          label={label}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          sx={{ width: "calc(95%)" }}
          error={error}
          required={required}
        />
      );
    case "select":
      return (
        <SelectContainer
          name={name}
          label={label}
          value={value}
          onChange={onChange}
          dropDownOptions={dropDownOptions}
          disabled={disabled}
          error={error}
          required={required}
          isBlankFirstValue={isBlankFirstValue}
        />
      );
    case "timePicker":
      return (
        <TimePickerComponent
          label={label}
          value={value}
          onChange={onChange}
          name={name}
          error={error}
          required={required}
          disabled={disabled}
        />
      );
    case "autoComplete" :
      return (
        <Dropdown
          label={label}
          value={value}
          options={dropDownOptions.sort()}
          updateValue= {(event: any, value: any) =>onChange(event,value)}
          styles={{
            width: "calc(95%)",
            margin: "0 0 0 0"
          }}
        />
      );

    case "multiField":
      return (<MultiFieldContainer
        label={label}
        name={name}
        value={["Mrinal"]}
        error={error}
        required={required}
        formFields={[
          {
            label: "Team",
            name: "team",
            type: "input"
          },
          {
            label: "Percentage (%)",
            name: "percentage",
            type: "number"
          }
        ]}
      />);
    default:
      return null;
  }
}

export default ComponentControl;