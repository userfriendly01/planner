import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { FlowAdvanceFilter } from "../AlohaFlow.Interfaces";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SearchIcon from "@mui/icons-material/Search";

interface CustomFlowGridToolBarProps{
    openAddModal:(flag:boolean, ruleType?:number)=>void,
    openAdvanceSearchModal:(flag:boolean,advanceFilter?:FlowAdvanceFilter)=>void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomFlowGridToolBar = ({
  openAddModal, openAdvanceSearchModal
}:CustomFlowGridToolBarProps) =>{
  const[dropDownOptions, setDropDownOptions]=useState("");
  const handleChange=(event:any)=> {
    if(event.target.value === "addFlow"){
      openAddModal(true);
    }
    else if(event.target.value === "Filter"){
      openAdvanceSearchModal(true);
    }
  };
  return (
    <div>
      <FormControl sx={{
        minWidth: 120,
        marginLeft: "calc(85%)",
        marginTop: 1
      }}>
        <InputLabel>Actions</InputLabel>
        <Select
          inputProps={{
            sx: {
              width: "calc(35%)"
            }
          }}
          label="Actions"
          value={dropDownOptions}
          onChange={handleChange}
          variant="filled"
          size="small"
          displayEmpty
        >
          <MenuItem key = "addFlow" value = "addFlow">
            <PlaylistAddIcon/>&nbsp;&nbsp; Add Flow
          </MenuItem>
          <MenuItem key = "Filter" value = "Filter">
            <SearchIcon/> &nbsp;&nbsp; Advance Search
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomFlowGridToolBar;
