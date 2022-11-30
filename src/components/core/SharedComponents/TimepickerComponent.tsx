import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormControl from "@mui/material/FormControl";


export interface TimePickerComponentProps {
  label: string;
  value: string;
  onChange: any;
  name: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
}

export default function TimePickerComponent({
  label,
  value,
  onChange,
  disabled,
  error,
  required
}: TimePickerComponentProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl sx={{ width: "calc(95%)" }} error={value !== null && error}>
        <TimePicker
          value={value || null}
          onChange={onChange}
          label={label}
          disabled={disabled}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params: TextFieldProps) => <TextField required={required} {...params} />}
        />
      </FormControl>
    </LocalizationProvider>
  );
}
