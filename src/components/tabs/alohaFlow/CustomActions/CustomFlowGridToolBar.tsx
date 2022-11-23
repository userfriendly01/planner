import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { FlowAdvanceFilter } from "../AlohaFlow.Interfaces";

interface CustomFlowGridToolBarProps{
    openAddModal:(flag:boolean, ruleType?:number)=>void,
    openAdvanceSearchModal:(flag:boolean,advanceFilter?:FlowAdvanceFilter)=>void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomFlowGridToolBar = ({
  openAddModal, openAdvanceSearchModal
}:CustomFlowGridToolBarProps) =>{
  const[dropDownOptions, setDropDownOptions]=useState({
    "addFlow": false,
    "Filter": false
  });
  const handleChange=(event:any)=> {
    if(event.target.value === "addFlow"){
      openAddModal(true);
    }
    else if(event.target.value === "Filter"){
      openAdvanceSearchModal(true);
    }
    else{
      console.log("here");
    }
  };
  return (
    <div>
      <FormControl sx={{
        minWidth: 120,
        marginLeft: "calc(75%)",
        marginTop: 1
      }}>
        <InputLabel>Actions</InputLabel>
        <Select
          inputProps={{
            sx: {
              width: "calc(25%)"
            }
          }}
          label="Actions"
          value={dropDownOptions}
          onChange={handleChange}
          variant="outlined"
          size="small"
        >
          <MenuItem key = "addFlow" value = "addFlow">
            Add Flow +
          </MenuItem>
          <MenuItem key = "Filter" value = "Filter">
            Advance Search
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomFlowGridToolBar;
