import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Paper, Tooltip
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

interface CustomFlowGridToolBarProps {
  openAddModal: (flag: boolean, isSubmitted?: boolean) => void,
  openAdvanceSearchModal: (flag: boolean, advanceFilter?: FlowAdvanceFilter) => void
  exportDataFile: ()=> void;
  applyFilter?: () => void;
  isAdvanceSearchOpen?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomFlowGridToolBar = ({
  openAddModal, openAdvanceSearchModal, exportDataFile, applyFilter, isAdvanceSearchOpen
}:CustomFlowGridToolBarProps) =>{
  const [flowFilter, setFlowFilter] = useState<FlowAdvanceFilter>();

  useEffect(()=>{
    const localFilter = getAdvanceFilter(CACHE_FILTER_FLOW);
    setFlowFilter(localFilter);
  },[isAdvanceSearchOpen]);

  const handleChange=(event:any):void=> {
    const { value } = event.target;
    switch (value) {
      case "addFlow":
        openAddModal(true);
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
    <Grid container>
      <Grid item key="flow-search-box" xs={9}>
        <TextField
          sx={{ marginLeft: 1 }}
          placeholder="Click here to apply filter"
          InputProps={{
            startAdornment:
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
      <Grid item key = "Export FlowUI" xs={1}>
        <Grid><div><br/><br/></div></Grid>
        <Tooltip title="Export Flow Records" sx={{left:"calc(76%)",marginLeft:"24"}}>
        <Paper variant="outlined" >
        <IconButton 
          onClick={exportDataFile}
          color = "primary" 
          size = "small"
          sx ={{position:"fixed"}}
        > <FileDownloadIcon /> 
      </IconButton>
      </Paper>
      </Tooltip>
      </Grid>
      <Grid item key="flow-action-box" xs={2}>
        <FormControl sx={{
          marginTop: "16px",
          marginBottom: "8px",
          marginLeft: "calc(40%)"
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
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export {
  CustomFlowGridToolBar
};