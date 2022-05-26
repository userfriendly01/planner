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

export const SimpleFilter = (props: any) => {
  const {
    options,
    label,
    multiple,
    styles,
    updateValue,
    value
  } = props;

  const stylesObject = {
    width: styles && styles.width ? styles.width : 250,
    minHeight: styles && styles.height ? styles.height : 56,
    margin: "5px"
  };

  const ListItem = styled.li`
    font-size: ${styles && styles.size ? styles.size : "15px"};
  `;

  return (
    <Autocomplete
      multiple={multiple}
      limitTags={1}
      disableClearable={!multiple}
      disableCloseOnSelect={multiple}
      options={options}
      value={value}
      isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
      onChange={updateValue}
      sx={stylesObject}
      renderInput={(params: any) => <TextField {...params} label={label} />}
      renderOption={(props: any, option: any) => {
        console.log("RENDERED OPTION", option, props["data-option-index"]);
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