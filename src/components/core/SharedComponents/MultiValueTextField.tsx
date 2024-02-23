import React, {
  useState, useEffect
} from "react";
import {
  Autocomplete,
  Chip,
  TextField
} from "@mui/material";

export interface MultiValueTextFieldProps{
  name: string;
  label: string;
  value: Array<string>;
  onChange: any;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  helperText?: string;
}

const MultiValueTextField = ({
  name, label, value, onChange, disabled, error, required, helperText
}:MultiValueTextFieldProps ): JSX.Element => {

  const [chipList, setChipList] = useState([]);

  useEffect(()=>{
    setChipList(value);
  }, [value]);

  const handleOnChange = (event: any, value: any) =>{
    setChipList(value);
    const newEvent = {
      target: {
        value: value,
        name
      }
    };
    onChange(newEvent);
  };
  return (
    <Autocomplete
      clearIcon={false}
      options={[]}
      freeSolo
      multiple
      disabled = {disabled}
      value={chipList||[]}
      renderTags={(value, props) =>
        value.map((item, index) => (
          <Chip  key = {index} label={item} {...props({ index })} />
        ))
      }
      onChange = {handleOnChange}
      renderInput={params => <TextField label={label}  helperText={helperText}{...params} />}
    />
  );
};

export {
  MultiValueTextField
};