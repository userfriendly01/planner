import React from "react";
import TextField from "@mui/material/TextField";
import SelectContainer from "./SelectContainer";
import TimePickerComponent from "./TimepickerComponent";

export interface ComponentControlProps{
    control: string,
    dropDownOptions: string[],
    name: string,
    label: string,
    type: string,
    value: any,
    onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
    disabled?: boolean,
    error: boolean,
    required: boolean
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
  required
}:ComponentControlProps) {
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
        />
      );
    case "timePicker":
      return (
        <TimePickerComponent
          label={label}
          value={value}
          onChange={onChange}
          name={name}
        />
      );
    default:
      return null;
  }
}

export default ComponentControl;
