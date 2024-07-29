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

import { styled } from '@mui/material/styles';

// Define custom styles using styled
const ErrorHelperText = styled('span')({
  color: 'red',
});

interface AutoCompleteProps {
  field: string;
  label: string;
  routingAttribute: string;
  type: string;
  updateOnChange?: string;
}


/**
 * AutoCompleteContainer component
 * 
 * This component renders an autocomplete input field with various props to customize its behavior.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.field - The field name for the autocomplete.
 * @param {string} props.label - The label for the autocomplete input.
 * @param {string} props.routingAttribute - The routing attribute for the autocomplete.
 * @param {string} props.type - The type of action to be dispatched.
 * @param {Function} props.onChange - The callback function to handle changes in the input.
 * @param {Array} [props.options] - The options for the autocomplete dropdown.
 * 
 * @returns {JSX.Element} The rendered AutoCompleteContainer component.
 */
export default function AutoCompleteContainer({ type, field, label, updateOnChange, routingAttribute }: AutoCompleteProps){
  const setForm = useFormDispatch();
  const form = useFormState();
  const [formValidations, setFormValidations]= useState({
    error: false,
    errorMessage: ''
  });
  
  const updateFormValidations = (error: boolean, errorMessage?: string) => {
    setFormValidations({
      ...formValidations,
      error,
      errorMessage: errorMessage || ''
    });
  }
  const setFormValue=(value: any)=>{
    const workerArray:string[] =[];
    for(let i=0; i<value?.length; i++){
      workerArray.push(value[i].toLowerCase());
    }

    setForm({
      type,
      payload: {
        [routingAttribute]: workerArray
      }
    });

    if(updateOnChange && workerArray.length === 0){
      setForm({ type: updateOnChange });
    }
  };

  const handleClose=(event: any)=>{
    let value = event?.target?.value;
    if(!value) {
      return;
    }
    let existingValues = form.triton.routing[field] || [];
    const newValue = [...existingValues, value.toLowerCase()];
    if(validate(newValue)){
      setFormValue(newValue);
    } else {
      setFormValue(existingValues);
    }
  };

  const handleCloseEvent = (event: any) => handleClose(event);

  const handleChange=(event: any, value: any)=>{
    if(event.key !== 'Enter'){
      setFormValue(value);
    }
    else if(validate(value)){
      setFormValue(value);
    } 
  };
  const validate=(value: any)=>{
    const pattern = /^n\d{7}$/i;
    const input = value[value.length-1];
    const isDuplicate = value.filter((item: any) => item === input).length > 1;
    if (!input.match(pattern)){
      updateFormValidations(true, 'Please enter an ’n’ followed by 7 digits.  Example: n1234567');
    } else if (isDuplicate) {
      updateFormValidations(true, `User ’${input}’ already exists in the workers list.`);
    } else{
      updateFormValidations(false);
      return true;
    }
    return false;
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
              <Chip key={index} label={option.toLowerCase()} {...props({ index })} />
            ))
          }
          renderInput={params => <TextField label={label}  helperText={formValidations.errorMessage && (
            <ErrorHelperText>
              {formValidations.errorMessage}.
            </ErrorHelperText>
          )} {...params} 
          />}
          autoSelect={true}
          onKeyDown={() => updateFormValidations(false)}
          onChange={(event: any, value: any) => handleChange(event, value)}
          onClose={handleCloseEvent}
        />
      </FormControl>
    </div>
  );
}
