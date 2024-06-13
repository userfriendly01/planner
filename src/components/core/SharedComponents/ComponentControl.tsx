import React from "react";
import {
  TextField, Switch, FormControlLabel
} from "@mui/material";
import SelectContainer from "./SelectContainer";
import TimePickerComponent from "./TimepickerComponent";
import { Control } from "globals/interfaces";
import { Dropdown } from "components/Dropdown";
import {
  MultiFieldContainer, MultiFieldContainerFormProps
} from "./MultiFieldContainer";
import { MultiValueTextField } from "./MultiValueTextField";

interface ComponentControlProps {
  control: Control;
  dropDownOptions?: string[];
  name: string;
  label: string;
  type: string;
  value: any;
  onChange: any;
  disabled?: boolean ;
  error: boolean;
  required: boolean,
  isBlankFirstValue?: boolean;
  multiple?: boolean;
  formFields?: Array<MultiFieldContainerFormProps>
}

export function ComponentControl({
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
  isBlankFirstValue,
  formFields
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
          error={error}
          disabled={disabled}
          required={required}
        />
      );

    case "multiField":
      return (<MultiFieldContainer
        label={label}
        name={name}
        value={value}
        error={error}
        required={required}
        formFields={formFields}
        updateValue={(event: any, value: any)=>onChange(event,value)}
      />);
    case "multiTextField":
      return (
        <MultiValueTextField
          label={label}
          name={name}
          onChange={onChange}
          value={value}
          disabled={disabled}
          error={error}
          key={name}
          required={required}
          helperText={`Please add Enter after each ${label}`}
        />
      );
    case "switch":
      return (
        <FormControlLabel
          label={label}
          required={required}
          labelPlacement="start"
          control={<Switch checked={value} disabled={disabled} name={name} onChange={(event,checked)=>{
            const newEvent = {
              target: {
                name: event.target.name,
                value: checked
              }
            };
            onChange(newEvent);
          }} size="medium" color="warning"/>}
        />
      );
    default:
      return null;
  }
}