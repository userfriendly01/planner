import React, {
  useEffect, useState
} from "react";
import {
  Autocomplete,
  Button,
  Fade,
  Grid,
  Paper,
  Popper,
  TextField
} from "@mui/material";
import { MultiFieldContainerFormProps } from "./MultiFieldContainer";
import { MultiValueTextField } from "./MultiValueTextField";

interface MultiFieldContainerModalViewProps{
    formFields:Array<MultiFieldContainerFormProps>;
    isOpen: boolean;
    anchorEl: HTMLDivElement | null;
    formLabel: string;
    onClose: ()=>void;
    handleOnSet:(formData: any, index: number)=> void;
    indexOf: number;
}

const MultiFieldContainerModalView = ({
  formFields,isOpen,anchorEl, formLabel, onClose,handleOnSet,indexOf
}: MultiFieldContainerModalViewProps): JSX.Element =>{
  const [formData, setFormData] = useState<{[key: string]: any}>({});

  useEffect(()=>{
    let newFormData: {[key: string]: any}={};
    formFields.forEach((field:MultiFieldContainerFormProps)=>{
      newFormData={
        ...newFormData,
        [field.name]: field.value
      };
    });
    setFormData(newFormData);
  },[formFields]);

  const handleOnSetModalData = () =>{
    handleOnSet(formData, indexOf);
    setFormData({});
  };

  const handleOnClose = () =>{
    setFormData({});
    onClose();
  };

  const handleOnMultiModalOnChange = (event: any) =>{
    const key: string = event.target.name;
    let value = event.target.value;
    const type = event.target.type;
    if(type === "number" ){
      value=parseInt(value);
    }
    setFormData(existingData=>({
      ...existingData,
      [key]: value
    }));
  };

  return (
    <Popper
      disablePortal={true}
      placement="right-start"
      open={isOpen}
      anchorEl={anchorEl}
      transition
      sx={{
        opacity: 1,
        backgroundColor: "##e6e6e6",
        zIndex: 1500,
        width: 300
      }}
    >{
        ({ TransitionProps })=>(
          <Fade {...TransitionProps} timeout={350}>
            <Paper variant="elevation" elevation={3} sx={{ padding: 3 }}>
              <Grid container rowSpacing={1}>
                {formFields && formFields.map((item: MultiFieldContainerFormProps)=>(
                  <Grid key={item.label} item xs={12}>
                    {(item.type === "multiValueText") ? (
                      <MultiValueTextField
                        name={item.name}
                        value={item.value}
                        label={item.label}
                        onChange={handleOnMultiModalOnChange}
                        helperText={item.helperText}
                      />
                    ) : (item.name === "callerState") ? (
                      <div>Hello!</div>
                    ) : (
                      <TextField
                        variant="outlined"
                        name={item.name}
                        type={item.type}
                        value={formData[item.name]}
                        label={item.label}
                        helperText={item.helperText}
                        onChange={handleOnMultiModalOnChange}
                      />
                    )}
                  </Grid>))}
                <Grid key={`set-button-${formLabel}`} item xs={6}>
                  <Button
                    type="submit"
                    value="Save"
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: 1 }}
                    aria-label = "setModalDataButton"
                    onClick={()=>handleOnSetModalData()}
                  >
                  Confirm
                  </Button>
                </Grid>
                <Grid key={`cancel-button-${formLabel}`} item xs={6}>
                  <Button
                    type="submit"
                    value="Cancel"
                    variant="contained"
                    color="error"
                    aria-label = "cancelModal"
                    onClick={()=>handleOnClose()}
                  >
                  Cancel
                  </Button>
                </Grid>
              </Grid>

            </Paper>
          </Fade>
        )}
    </Popper>
  );
};

export {
  MultiFieldContainerModalView
};