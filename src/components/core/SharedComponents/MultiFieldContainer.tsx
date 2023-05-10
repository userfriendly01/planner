import React, {
  useState, useEffect
} from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import { MultiValueTextField } from "./MultiValueTextField";

interface MultiFieldContainerFormProps{
    label: string;
    name: string;
    value?: any;
    type: React.HTMLInputTypeAttribute | "multiValueText";
    helperText?: string;
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

/**
 * This function used to get the key from data for Chip component
 * @param item can be a String | Array | Object  
 * @returns string having key for Chip Component
 */
const getTagKey = (item:any, tagIndex:  number): string =>{
  let tagKey="";
  if(typeof item === "string"){
    tagKey = item;
  }
  else if (Array.isArray(item)){
    tagKey=item.join("-");
  }
  else{
    Object.keys(item).forEach((key: string, index: number)=>{
      tagKey+=`${key}-${index}`;
    });
    tagKey+=`-${tagIndex}`;
  }

  return tagKey;
};

/**
 * This function used to get the Display for Chip Component from multiple data field
 * @param item data can be a String | Array | Object
 * @param formFields form design configuration and type should be Array<Object>
 * @returns 
 */
const getTagLabel = (item:any, formFields:Array<MultiFieldContainerFormProps>): string =>{
  let label="";
  if(typeof item === "string"){
    label = item;
  }
  else if (Array.isArray(item)){
    label=item.join(", ");
  }
  else{
    formFields.forEach((field: MultiFieldContainerFormProps, index: number)=>{
      if(index === 0){
        label+=item[field.name];
      }
      else{
        label+=` - ${item[field.name]}`;
      } });
  }

  return label;
};

const MultiFieldContainer = (
  {
    error, name, label, required, value, formFields, updateValue
  }:MultiFieldContainerProps): JSX.Element =>{

  const [isModalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [listItems, setListItems] = useState([]);
  useEffect(()=>{
    setListItems(value);
  }, [value]);
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

  const handleOnDelete = (tagIndex: number) =>{
    const filteredIList = listItems.filter((item: any, index: number)=>tagIndex!==index);
    setListItems(filteredIList);
    updateValue({
      target: {
        name,
        value: filteredIList
      }
    },filteredIList);
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
            startAdornment: listItems && listItems.map((item:any, index: number)=>(
              <Chip
                key={getTagKey(item, index)}
                tabIndex={index}
                label={getTagLabel(item, formFields)}
                onDelete={(event: any)=>handleOnDelete(index)}
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
                    ):(
                      <TextField
                        variant="outlined"
                        name={item.name}
                        type={item.type}
                        value={item.value}
                        label={item.label}
                        helperText={item.helperText}
                        onChange={handleOnMultiModalOnChange}
                      />
                    ) }
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

export default MultiFieldContainer;
export {
  MultiFieldContainerFormProps,
  getTagKey,
  getTagLabel
};