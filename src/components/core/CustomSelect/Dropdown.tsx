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
*/

export const Dropdown = (props: any) => {
  const {
    options,
    label,
    multiple,
    styles,
    updateValue,
    value,
    error,
    onBlur
  } = props;

  const stylesObject = {
    width: styles && styles.width ? styles.width : "250px",
    minHeight: styles && styles.height ? styles.height : "56px",
    margin: styles && styles.margin ? styles.margin : "5px",
    ".MuiOutlinedInput-notchedOutline": {
      border: styles && styles.noBorder ? "none" : "invalidValueToForceOriginalStyling"
    }
  };

  const ListItem = styled.li`
    font-size: ${styles && styles.fontSize ? styles.fontSize : "15px"};
  `;

  const handleCheckEqual = (option: any, value: any) => {
    if(typeof value === "object") {
      return option?.value === value?.value || value?.value === "";
    } else if(typeof value === "string"){
      return option?.value === value || option?.label === value || value === "";
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      size={styles && styles.small ? "small" :"medium"}
      disableClearable={!multiple}
      disableCloseOnSelect={multiple}
      limitTags={1}
      options={options}
      value={value}
      isOptionEqualToValue={handleCheckEqual}
      onChange={updateValue}
      disabled={false}
      onBlur={onBlur}
      sx={stylesObject}
      renderInput={(params: any) => <TextField {...params} label={label} error={error} />}
      renderOption={(props: any, option: any) => {
        if (option.label === "divider") {
          return <Divider key={props["data-option-index"]} />;
        } else {
          return <ListItem {...props}>
            { option.label}
          </ListItem>;
        }
      }}
    />
  );
};