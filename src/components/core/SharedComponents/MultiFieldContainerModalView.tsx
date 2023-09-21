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
import { routingDropDownList } from "utils";
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

  const handleOnMultiModalOnChange = (event: any, values: any = "") =>{
    let key: string = event.target.name;
    let value = event.target.value;
    const type = event.target.type;
    if(type === "number" ){
      value=parseInt(value);
    }
    if(values) {
      const keyValueArray = values.id.split("-");

      key = keyValueArray[0];
      value = keyValueArray[1];
    }
    { setFormData(existingData=>({
      ...existingData,
      [key]: value
    })); }
  };

  const getGridItem = (item:MultiFieldContainerFormProps) => {
    if (item.type === "multiValueText")  {
      return (
        <MultiValueTextField
          name={item.name}
          value={item.value}
          label={item.label}
          onChange={handleOnMultiModalOnChange}
          helperText={item.helperText}
        />
      ); } else if (item.type === "select")  {
      let options: any = [];

      if (item.name === "callerState") {
        options = routingDropDownList.callerState.map(x => {
          return {
            id: `${item.name}-${x}`,
            label: x
          }; });
      }
      return (
        <Autocomplete
          data-testid={"auto" + item.name}
          onChange={handleOnMultiModalOnChange}
          options={options}
          renderInput={(params: any) => <TextField
            {...params}
            helperText={item.helperText}
            label={item.label}
          />}
          value={item.value}
        />
      ); } else {
      return (
        <TextField
          variant="outlined"
          name={item.name}
          type={item.type}
          value={formData[item.name]}
          label={item.label}
          helperText={item.helperText}
          onChange={handleOnMultiModalOnChange}
        />
      ); }

  };

  return (
    <Popper
      disablePortal={true}
      placement="bottom-end"
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
                    {getGridItem(item)}
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