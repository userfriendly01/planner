import React, {
  useState, useEffect
} from "react";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SearchIcon from "@mui/icons-material/Search";
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
      case "Export":
        exportDataFile();
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
    <Grid container columnSpacing={2}>
      <Grid item key="routing-search-box" xs={11}>
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
      <Grid item key="routing-action-box" xs={1}>
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
          >
            <MenuItem key="addRouting" value="addRouting">
              <PlaylistAddIcon/> &nbsp;&nbsp;Add Routing
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
