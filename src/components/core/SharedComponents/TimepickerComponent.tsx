import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";


export interface TimePickerComponentProps{
  label: string,
  value: string,
  onChange: any,
  name: string
}

export default function TimePickerComponent({
  label,
  value,
  onChange,
  name
}:TimePickerComponentProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        value={value || null}
        onChange={onChange}
        label={label}
        InputProps={{
          sx: {
            width: "calc(95%)"
          }
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params:any) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
