import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { FlowAdvanceFilter } from "../AlohaFlow.Interfaces";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

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
      case "Filter":
        openAdvanceSearchModal(true);
        break;
      case "Export":
        exportDataFile();
        break;
      default:
        break;
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
          <MenuItem key="Filter" value="Filter">
            <SearchIcon /> &nbsp;&nbsp; Advance Search
          </MenuItem>
          <MenuItem key="Export" value="Export">
            <FileDownloadIcon /> &nbsp;&nbsp; Export
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
