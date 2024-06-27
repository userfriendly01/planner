import {
  Autocomplete,
  Chip,
  FormControl,
  TextField
} from "@mui/material";
import React, { useState } from "react";
import {
  useFormDispatch,
  useFormState
} from "context/appContext";

interface AutoCompleteProps {
  field: string;
  label: string;
  routingAttribute: string;
  type: string;
}

export default function AutoCompleteContainer({ type, field, label, routingAttribute }: AutoCompleteProps): JSX.Element{
  const setForm = useFormDispatch();
  const form = useFormState();
  const [formValidations, setFormValidations]= useState({
    error: false,
    errorMessage: ""
  });
  const setFormValue=(value:any)=>{
    const workerArray:string[] =[];
    for(let i=0; i<value?.length; i++){
      workerArray.push(value[i]);
    }
    setForm({
      type,
      payload: {
        [routingAttribute]: workerArray
      }
    });
  };
  const handleChange=(event:any, value:any)=>{
    if(event.key !== "Enter"){
      setFormValue(value);
    }
    else if(validate(value)){
      setFormValue(value);
    }

  };
  const validate=(value:any)=>{
    const pattern = "n[0-9]{7}$";
    const input = value[value.length-1];
    if (!input.match(pattern)){
      setFormValidations({
        ...formValidations,
        errorMessage: "please enter Id starts with n followed by 7 digits",
        error: true
      });
      return false;
    }
    else{
      setFormValidations({
        ...formValidations,
        error: false,
        errorMessage: ""
      });
      return true;
    }
  };
  return (
    <div>
      <FormControl sx={{ width: "calc(95%)" }}  >
        <Autocomplete
          clearIcon={false}
          options={[]}
          freeSolo = {true}
          multiple
          value = {(form.triton.routing && form.triton.routing[field])||[]}
          renderTags={(value, props) =>
            value.map((option, index) => (
              <Chip key={index} label={option} {...props({ index })} />
            ))
          }
          renderInput={params => <TextField label={label}  helperText={formValidations.errorMessage} {...params} />}
          onChange={(event: any, value: any) => handleChange(event, value)}
        />
      </FormControl>
    </div>
  );
}
