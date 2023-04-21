import {
  Chip,Grid,FormControl, IconButton ,InputLabel, MenuItem, Select, TextField, InputAdornment
} from "@mui/material";
import React from "react";
import {
  CACHE_FILTER_FLOW, getAdvanceFilter
} from "utils";
import { FlowAdvanceFilter } from "../AlohaFlow.Interfaces";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";

interface CustomFlowGridToolBarProps {
  openAddModal: (flag: boolean, isSubmitted?: boolean) => void,
  openAdvanceSearchModal: (flag: boolean, advanceFilter?: FlowAdvanceFilter) => void
  exportDataFile: ()=> void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CustomFlowGridToolBar = ({
  openAddModal, openAdvanceSearchModal, exportDataFile
}:CustomFlowGridToolBarProps) =>{
  const handleChange=(event:any):void=> {
    const { value } = event.target;
    switch (value) {
      case "addFlow":
        openAddModal(true);
        break;
      case "Export":
        exportDataFile();
        break;
      default:
        break;
    }
  };
  const filterItem: FlowAdvanceFilter = getAdvanceFilter(CACHE_FILTER_FLOW);

  const handleOnDelete = (key: string) =>{
    delete filterItem[key as keyof FlowAdvanceFilter];
    localStorage.setItem(CACHE_FILTER_FLOW,JSON.stringify(filterItem));
  };

  return (
    <Grid container>
      <Grid item key="flow-search-box" xs={11}>
        <TextField
          InputProps={{
            startAdornment: Object.keys(filterItem).map((key: string, index:number)=>(
              <Chip
                key={key}
                color="primary"
                tabIndex={index}
                label={`${key.toLowerCase()} : ${filterItem[key as keyof FlowAdvanceFilter]}`}
                onDelete={(event: any)=>{ handleOnDelete(key); }}
                sx={{ margin: 1 }}
              />
            )),
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>)
          }}

          fullWidth
          id="flow-SearchBox-input"
          label="Search"
          margin="normal"
          name="flow-SearchBox-input"
          variant="standard"
          sx={{ padding: 1 }}
          onClick={()=>openAdvanceSearchModal(true)}
        />
      </Grid>
      <Grid item key="flow-action-box" xs={1}>
        <FormControl>
          <InputLabel>Actions</InputLabel>
          <Select
            inputProps={{
              sx: {
                width: 120
              }
            }}
            label="Actions"
            value=""
            onChange={handleChange}
            variant="filled"
            size="small"
            displayEmpty
          >
            <MenuItem key="addFlow" value="addFlow">
              <PlaylistAddIcon />&nbsp;&nbsp; Add Flow
            </MenuItem>
            <MenuItem key="Export" value="Export">
              <FileDownloadIcon /> &nbsp;&nbsp; Export
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
