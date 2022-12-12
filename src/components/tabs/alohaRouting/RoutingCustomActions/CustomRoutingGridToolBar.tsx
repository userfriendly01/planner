import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface CustomRoutingGridToolBarProps {
  openAddModal: (flag: boolean) => void;
  openAdvanceSearchModal:(flag: boolean)=>void;
  exportDataFile: ()=> void;
}

export const CustomFlowRoutingToolBar = ({
  openAddModal, openAdvanceSearchModal, exportDataFile
}: CustomRoutingGridToolBarProps):JSX.Element => {

  const handleChange = (event: any):void => {
    const { value } = event.target;
    switch (value) {
      case "addRouting":
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
        >
          <MenuItem key="addRouting" value="addRouting">
            <PlaylistAddIcon/> &nbsp;&nbsp;Add Routing
          </MenuItem>
          <MenuItem key="Filter" value="Filter">
            <SearchIcon/> &nbsp;&nbsp;Advance Search
          </MenuItem>
          <MenuItem key="Export" value="Export">
            <FileDownloadIcon /> &nbsp;&nbsp; Export
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
