import React, { useState } from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";

export interface MultiFieldContainerFormProps{
    label: string;
    name: string;
    value?: any;
    type: string;
}
interface MultiFieldContainerProps{
    label: string;
    name: string;
    value?: Array<any>;
    error: boolean;
    required: boolean;
    formFields: Array<MultiFieldContainerFormProps>;
    updateValue: (event: any,value: any)=>void
}
interface MultiFieldContainerModalViewProps{
    formFields:Array<MultiFieldContainerFormProps>;
    isOpen: boolean;
    anchorEl: HTMLDivElement | null;
    formLabel: string;
    onClose: ()=>void;
    handleOnSet:(formData: any)=> void;
}

const MultiFieldContainer = (
  {
    error, name, label, required, value, formFields, updateValue
  }:MultiFieldContainerProps): JSX.Element =>{

  const [isModalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [listItems, setListItems] = useState(value || []);
  const handleClick =(event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setModalOpen(!isModalOpen);
  };
  const handleOnClose =() => {
    setAnchorEl(null);
    setModalOpen(false);
  };

  const handleOnSet = (formData: any) =>{
    const updatedListItems = [...listItems, formData];
    setListItems(updatedListItems);
    setAnchorEl(null);
    setModalOpen(false);
    updateValue({
      target: {
        name,
        value: updatedListItems
      }
    },updatedListItems);
  };

  const getTagKey = (item:any): string =>{
    let tagKey="";
    if(typeof item === "string"){
      tagKey = item;
    }
    else if (Array.isArray(item)){
      tagKey=item.join("-");
    }
    else{
      Object.keys(item).forEach((key: string)=>{
        tagKey+=`${key}-${item[key]}`;
      });
    }

    return tagKey;
  };

  const getTagLabel = (item:any): string =>{
    let label="";
    if(typeof item === "string"){
      label = item;
    }
    else if (Array.isArray(item)){
      label=item.join(", ");
    }
    else{
      Object.keys(item).forEach((key: string, index: number)=>{
        if(index === 0){
          label+=item[key];
        }
        else{
          label+=` - ${item[key]}`;
        } });
    }

    return label;
  };

  return (
    <>
      <FormControl sx={{ width: "calc(95%)" }} error={error} required={required}>
        <TextField
          variant="outlined"
          label={label}
          name={name}
          type="button"
          InputProps={{
            startAdornment: listItems && listItems.map(item=>(
              <Chip
                key={getTagKey(item)}
                tabIndex={-1}
                label={getTagLabel(item)}
              />
            ))
          }}
          onClick={handleClick}
        />
      </FormControl>
      <MultiFieldContainerModalView
        formFields={formFields}
        isOpen={isModalOpen}
        anchorEl={anchorEl}
        formLabel={label}
        onClose={handleOnClose}
        handleOnSet={handleOnSet}
      />
    </>
  );
};

const MultiFieldContainerModalView = ({
  formFields,isOpen,anchorEl, formLabel, onClose,handleOnSet
}: MultiFieldContainerModalViewProps): JSX.Element =>{
  const [formData, setFormData] = useState({});
  const handleOnSetModalData = () =>{
    handleOnSet(formData);
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
                    <TextField
                      variant="outlined"
                      name={item.name}
                      type={item.type}
                      value={item.value}
                      label={item.label}
                      onChange={handleOnMultiModalOnChange}
                    />
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
                    onClick={()=>onClose()}
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

export default MultiFieldContainer;