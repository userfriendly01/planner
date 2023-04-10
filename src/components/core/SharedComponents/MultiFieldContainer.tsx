import React from "react";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";


interface MultiContainerFormFieldsProps{
    label: string;
    name: string;
    value: any;
    type: string;
}

interface MultiFieldContainerProps{
    label: string;
    name: string;
    value: Array<any>;
    error: boolean;
    required: boolean;
    formFields: Array<MultiContainerFormFieldsProps>;
}

const MultiFieldContainer = (
  {
    error, name, label, required, value, formFields
  }:MultiFieldContainerProps): JSX.Element =>{
  return (
    <FormControl sx={{ width: "calc(95%)" }} error={error} required={required}>
      <InputLabel id={`select-helper-label-${name}`}>{label}</InputLabel>
      <TextField
        variant="outlined"
        label={label}
        name={name}
        type="button"
        InputProps={{
          startAdornment: value.map(item=>(
            <Chip
              key={item}
              tabIndex={-1}
              label={item}
            />
          ))
        }}
        onClick={()=>MultiFieldContainerModalView(formFields)}
      />
    </FormControl>
  );
};


const MultiFieldContainerModalView = (formFields: Array<any>): JSX.Element =>{
  return (
    <Grid container rowSpacing={1}>
      {formFields && formFields.map((item: MultiContainerFormFieldsProps)=>(<Grid key={item.label} item xs={12}>
        <FormControl sx={{ width: "calc(95%)" }}>
          <InputLabel id={`multi-field-container-modal-label-${item.name}`}>{item.label}</InputLabel>
          <TextField
            variant="outlined"
            name={item.name}
            type={item.type}
            value={item.value}
          />
        </FormControl>
      </Grid>))}
    </Grid>
  );
};

export default MultiFieldContainer;