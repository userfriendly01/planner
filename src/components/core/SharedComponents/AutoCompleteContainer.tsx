import React, { useState } from "react";
import { FormControl,Autocomplete} from "@mui/material";
import { Chip, TextField } from "@mui/material";
import { useFormDispatch, useFormState, userFormActions } from "context";


export default function AutoCompleteContainer(): JSX.Element{
    const setForm = useFormDispatch();
    const form = useFormState();
    const [formValidations, setFormValidations]= useState({error:false, errorMessage:""})
    const setFormValue=(value:any)=>{
    var salesAssociateWorkerArray:String[] =[];  
        for(let i=0;i<value?.length;i++){
            salesAssociateWorkerArray.push(value[i]);
        }
        setForm({
          type: userFormActions.SET_SALES_ASSOCIATE_WORKER,
          payload: {
            salesAssociateWorkerRouting: salesAssociateWorkerArray
          }
        });
    }
    const handleChange=(event:any, value:any)=>{
      if(event.key !== "Enter"){
        setFormValue(value)
      }
      else if(validate(value)){
        setFormValue(value)
      }
        
    }
    const validate=(value:any)=>{
     const pattern = "n[0-9]{7}$"
     const input = value[value.length-1];
     if (!input.match(pattern)){
        setFormValidations({
            ...formValidations,
            errorMessage: "please enter Id start with n followed by 7 digits",
            error: true
        });
        return false
     }
     else{
        setFormValidations({
            ...formValidations,
            error:false,
            errorMessage:""       
        });
        return true;
     }
    }
  return (
    <div>
      <FormControl sx={{ width: "calc(95%)" }}  >
        <Autocomplete
          clearIcon={false}
          options={[]}
          freeSolo = {true}
          multiple
          value = {form.triton.routing?.sales_assoc_workers}
          renderTags={(value, props) =>
            value.map((option, index) => (
              <Chip label={option} {...props({ index })} />
          ))
        }
        renderInput={(params) => <TextField label="Sales Associate Worker"  helperText={formValidations.errorMessage} {...params} />}
        onChange={(event: any, value: any) => handleChange(event, value)}
      />
      </FormControl>
    </div>
  );
}
