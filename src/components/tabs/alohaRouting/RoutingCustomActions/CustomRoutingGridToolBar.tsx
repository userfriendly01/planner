import React, {
  useState, useEffect
} from "react";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Tooltip, Paper
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { RoutingFilter } from "../AlohaRouting.Interfaces";
import {
  CACHE_FILTER_ROUTING, getAdvanceFilter
} from "utils";

interface CustomRoutingGridToolBarProps {
  openAddModal: (flag: boolean) => void;
  openAdvanceSearchModal:(flag: boolean)=>void;
  exportDataFile: ()=> void;
  applyFilter?: () => void;
  isAdvanceSearchOpen?: boolean;
}

export const CustomRoutingGridToolBar = ({
  openAddModal, openAdvanceSearchModal, exportDataFile, applyFilter, isAdvanceSearchOpen
}: CustomRoutingGridToolBarProps):JSX.Element => {

  const [routingFilter, setRoutingFilter] = useState<RoutingFilter>();

  useEffect(()=>{
    const localFilter = getAdvanceFilter(CACHE_FILTER_ROUTING);
    setRoutingFilter(localFilter);
  },[isAdvanceSearchOpen]);

  const handleChange = (event: any):void => {
    const { value } = event.target;
    switch (value) {
      case "addRouting":
        openAddModal(true);
        break;
      default:
        break;
    }
  };

  const handleOnDelete = (key: string) =>{
    const filterItem: RoutingFilter = { ...routingFilter };
    delete filterItem[key as keyof RoutingFilter];
    localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(filterItem));
    applyFilter();
    setRoutingFilter(filterItem);
  };

  return (
    <Grid container>
      <Grid item key="routing-search-box" xs={9}>
        <TextField
          sx={{ marginLeft: 1 }}
          placeholder="Click here to apply filter"
          InputProps={{
            startAdornment:
            routingFilter && Object.keys(routingFilter).map((key: string, index:number)=>(
              <Chip
                key={key}
                color="primary"
                tabIndex={index}
                label={`${key.toLowerCase()} : ${routingFilter[key as keyof RoutingFilter]}`}
                onDelete={(event: any)=>{ handleOnDelete(key); }}
                sx={{ margin: 1 }}
              />
            ))
          }}

          fullWidth
          id="routing-SearchBox-input"
          label="Search"
          margin="normal"
          name="routing-SearchBox-input"
          variant="standard"
          onClick={()=>openAdvanceSearchModal(true)}
        />
      </Grid>
      <Grid item key = "Export RoutingUI" xs={1}>
        <Grid><div><br/><br/></div></Grid>
        <Tooltip title="Export Routing Records" sx={{left:"calc(76%)",marginLeft:"24"}}>
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
      <Grid item key="routing-action-box" xs={2}>
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
          >
            <MenuItem key="addRouting" value="addRouting">
              <PlaylistAddIcon/> &nbsp;&nbsp;Add Routing
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
