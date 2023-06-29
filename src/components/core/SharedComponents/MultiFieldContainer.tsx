import React, {
  useState, useEffect
} from "react";
import {
  Chip,FormControl,TextField
} from "@mui/material";
import { MultiFieldContainerModalView } from "./MultiFieldContainerModalView";

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
  const [multiFormFields, setMultiFormFields] = useState<Array<MultiFieldContainerFormProps>>(formFields);
  const [indexOf, setIndexOf] = useState<number>();

  useEffect(()=>{
    setListItems(value);
    setIndexOf(value.length);
  }, [value]);
  const handleClick =(event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setModalOpen(!isModalOpen);
  };
  const handleOnClose =() => {
    setAnchorEl(null);
    setModalOpen(false);
    setMultiFormFields(formFields);
  };

  const handleOnEdit = (item: any, index: number) =>{
    const newFormFields: Array<MultiFieldContainerFormProps> = [];
    formFields.forEach((field: MultiFieldContainerFormProps)=>{
      const newFormField = {
        ...field,
        value: item[field.name]
      };
      newFormFields.push(newFormField);
    });
    setMultiFormFields(newFormFields);
    setIndexOf(index);
  };

  const handleOnSet = (formData: any, index: number) =>{
    const updatedListItems = [...listItems];
    if(index===listItems.length){
      updatedListItems.push(formData);
    }else{
      updatedListItems[index]=formData;
    }
    setListItems(updatedListItems);
    setAnchorEl(null);
    setModalOpen(false);
    setMultiFormFields(formFields);
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
                label={getTagLabel(item, multiFormFields)}
                onDelete={(event: any)=>handleOnDelete(index)}
                onClick={(event: any)=>{
                  handleOnEdit(item, index);
                }}
              />
            ))
          }}
          onClick={handleClick}
        />
      </FormControl>
      <MultiFieldContainerModalView
        formFields={multiFormFields}
        isOpen={isModalOpen}
        anchorEl={anchorEl}
        formLabel={label}
        onClose={handleOnClose}
        handleOnSet={handleOnSet}
        indexOf={indexOf}
      />
    </>
  );
};

export {
  MultiFieldContainer,
  MultiFieldContainerFormProps,
  getTagKey,
  getTagLabel
};