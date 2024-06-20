import * as React from "react";
import {
  Autocomplete,
  Divider,
  TextField
}from "@mui/material";
import styled from "styled-components";

/*
  To use this shared dropdown:
    options: an array of objects where the display text is named "label" within the object and the unique identifier set as "value".
       The rest of the object structure doesnt matter
    multiple: Pass this boolean as "true" if you want the option to select multiple dropdown options
    divider: If you want to display a divider in your list, add an object to the array where the label is "divider"
    syles: You can pass through multiple styles to control width, height, if there is a border etc
*/

const ListItem = styled.li<{ styles?: any }>`
width: ${props => props.styles && props.styles.width ? props.styles.width : "250px"};
font-size: ${props => props.styles && props.styles.fontSize ? props.styles.fontSize : "15px"};
`;

export const Dropdown = (props: any) => {
  const {
    CustomRender,
    disabled,
    error,
    label,
    multiple,
    onBlur,
    options,
    styles,
    updateValue,
    value,
    disableClear,
    required
  } = props;

  const stylesObject = {
    width: styles && styles.width ? styles.width : "250px",
    minHeight: styles && styles.height ? styles.height : "56px",
    margin: styles && styles.margin ? styles.margin : "5px",
    ".MuiOutlinedInput-notchedOutline": {
      border: styles && styles.noBorder ? "none" : "invalidValueToForceOriginalStyling"
    }
  };

  const handleCheckEqual = (option: any, value: any) => {
    if(typeof value === "object") {
      return option?.value === value?.value || value?.value === "";
    } else {
      return option?.value === value || option?.label === value || value === "";
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      blurOnSelect={true}
      size={styles && styles.small ? "small" :"medium"}
      disableClearable={disableClear}
      disableCloseOnSelect={multiple}
      limitTags={1}
      options={options}
      value={value}
      isOptionEqualToValue={handleCheckEqual}
      onChange={updateValue}
      disabled={disabled}
      onBlur={onBlur}
      sx={stylesObject}
      renderInput={(params: any) => <TextField {...params} label={label} error={error} key={props["data-option-index"]}  required={required}/>}
      renderOption={(props: any, option: any) => {
        if (option?.label === "divider") {
          return <Divider key={props["data-option-index"]} />;
        } else if (CustomRender){
          return <ListItem  {...props} key={props["data-option-index"]}>
            <CustomRender option={option}/>
          </ListItem>;
        } else if(option.label){
          return <ListItem  {...props} key={props["data-option-index"]}>
            {option.label}
          </ListItem>;
        } else if(option.value){
          return <ListItem  {...props} key={props["data-option-index"]}>
            {option.value}
          </ListItem>;
        } else {
          return <ListItem  {...props} key={props["data-option-index"]}>
            {option}
          </ListItem>;
        }
      }}
    />
  );
};
