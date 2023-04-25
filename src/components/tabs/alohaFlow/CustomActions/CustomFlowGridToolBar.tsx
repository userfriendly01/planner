import {
  Chip,Grid,FormControl, InputLabel, MenuItem, Select, TextField, InputAdornment
} from "@mui/material";
import React, {
  useState, useEffect
} from "react";
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
  applyFilter?: () => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CustomFlowGridToolBar = ({
  openAddModal, openAdvanceSearchModal, exportDataFile, applyFilter
}:CustomFlowGridToolBarProps) =>{
  const [flowFilter, setFlowFilter] = useState<FlowAdvanceFilter>();

  useEffect(()=>{
    const localFilter = getAdvanceFilter(CACHE_FILTER_FLOW);
    setFlowFilter(localFilter);
  },[flowFilter]);

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

  const handleOnDelete = (key: string) =>{
    const filterItem: FlowAdvanceFilter = { ...flowFilter };
    delete filterItem[key as keyof FlowAdvanceFilter];
    localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(filterItem));
    applyFilter();
    setFlowFilter(filterItem);
  };

  return (
    <Grid container columnSpacing={2}>
      <Grid item key="flow-search-box" xs={11}>
        <TextField
          sx={{ marginLeft: 1 }}
          placeholder="Click here to apply filter"
          InputProps={{
            startAdornment:
            (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
            &&
            flowFilter && Object.keys(flowFilter).map((key: string, index:number)=>(
              <Chip
                key={key}
                color="primary"
                tabIndex={index}
                label={`${key.toLowerCase()} : ${flowFilter[key as keyof FlowAdvanceFilter]}`}
                onDelete={(event: any)=>{ handleOnDelete(key); }}
                sx={{ margin: 1 }}
              />
            ))
          }}

          fullWidth
          id="flow-SearchBox-input"
          label="Search"
          margin="normal"
          name="flow-SearchBox-input"
          variant="standard"
          onClick={()=>openAdvanceSearchModal(true)}
        />
      </Grid>
      <Grid item key="flow-action-box" xs={1}>
        <FormControl sx={{
          marginTop: "16px",
          marginBottom: "8px"
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
            <MenuItem key="Export" value="Export">
              <FileDownloadIcon /> &nbsp;&nbsp; Export
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
