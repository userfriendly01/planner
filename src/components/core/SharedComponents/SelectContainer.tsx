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
  disabled?: boolean,
  error?: boolean,
  required: boolean;
  isBlankFirstValue?: boolean
}
export default function SelectContainer({
  dropDownOptions,
  name,
  label,
  value,
  onChange,
  disabled,
  error,
  required,
  isBlankFirstValue
}:SelectContainerProps): JSX.Element{
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
          {isBlankFirstValue?(<MenuItem key = "null_value" value= {null}>{label}</MenuItem>):null}
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
