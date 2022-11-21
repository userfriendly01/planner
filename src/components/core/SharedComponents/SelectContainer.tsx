import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export interface SelectContainerProps{
  dropDownOptions: string[],
  name: string,
  label: string,
  value: unknown,
  onChange: any,
  disabled: boolean,
  error: boolean,
  required: boolean
}
export default function SelectContainer({
  dropDownOptions,
  name,
  label,
  value,
  onChange,
  disabled,
  error,
  required
}:SelectContainerProps){
  return (
    <div>
      <FormControl sx={{ width: "calc(95%)" }} error={error} required={required}>
        <InputLabel id={`select-helper-label-${name}`}>{label}</InputLabel>
        <Select
          fullWidth
          name={name}
          labelId={`select-helper-label-${name}`}
          label={label}
          value={value}
          onChange={onChange}
          displayEmpty
          disabled={disabled}
          variant="outlined"
        >
          {dropDownOptions?.map(options => (
            <MenuItem key={options} value={options}>
              {options}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
