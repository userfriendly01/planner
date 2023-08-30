import React, {
  useState, useEffect
} from "react";
import {
  Chip, TextField
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
  const [textFieldValue, setTextFieldValue] = useState("");

  useEffect(()=>{
    setChipList(value);
  }, [value]);

  const handleOnDelete = (index: number) =>{
    const newChipList = [...chipList];
    newChipList.splice(index, 1);
    setChipList(newChipList);
    const newEvent = {
      target: {
        value: newChipList,
        name
      }
    };
    onChange(newEvent);
  };

  const handleOnChange = (event: any) =>{
    if (event.code === "Enter" && event.target.value) {
      const updatedChipList = [...(chipList? chipList : []), event.target.value];
      setChipList(updatedChipList);
      setTextFieldValue("");
      const newEvent = {
        target: {
          value: updatedChipList,
          name
        }
      };
      onChange(newEvent);
    }
  };

  return (
    <TextField
      id="outlined-basic"
      name={name}
      label={label}
      variant="outlined"
      value={textFieldValue}
      error={error}
      disabled={disabled}
      required={required}
      helperText={helperText}
      onChange={e => {
        setTextFieldValue(e.target.value);
      }}
      onKeyPress={(e: any) => { handleOnChange(e); }}
      InputProps={{
        startAdornment:
            chipList &&
            chipList.map((chip: string, index: number) => (
              <Chip
                key={`chip-${index}`}
                tabIndex={index}
                label={chip}
                onDelete={(event: any) => {
                  handleOnDelete(index);
                }}
              />
            ))
      }}
    />
  );
};

export {
  MultiValueTextField
};