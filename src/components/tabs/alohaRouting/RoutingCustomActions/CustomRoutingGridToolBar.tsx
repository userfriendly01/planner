import React, {
  useState, useEffect
} from "react";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Tooltip
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {
  PreviewModalAction,
  RoutingFilter
} from "../AlohaRouting.Interfaces";
import {
  CACHE_FILTER_ROUTING, getAdvanceFilter
} from "utils";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface CustomRoutingGridToolBarProps {
  openAddModal: (flag: boolean) => void;
  openEditModal: (flag: boolean) => void;
  openPreviewModal: (flag: boolean, action: PreviewModalAction) => void;
  openAdvanceSearchModal:(flag: boolean) => void;
  exportDataFile: ()=> void;
  applyFilter?: () => void;
  isAdvanceSearchOpen?: boolean;
}

export const CustomRoutingGridToolBar = ({
  openAddModal, openPreviewModal, openAdvanceSearchModal, exportDataFile, applyFilter, isAdvanceSearchOpen
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
      case "bulkDeleteRouting":
        openPreviewModal(true, "delete");
        break;
      case "bulkAddRouting":
        openPreviewModal(true, "add");
        break;
      case "bulkEditRouting":
        openPreviewModal(true, "edit");
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
        <Tooltip title="Export Routing Records" placement="right-start" sx={{
          left: "calc(76%)",
          marginLeft: "24"
        }}>
          <IconButton
            onClick={exportDataFile}
            color = "primary"
            size = "small"
            sx ={{
              position: "relative",
              marginTop: "36px",
              marginLeft: "36px",
              ":hover": {
                backgroundColor: "grey",
                color: "white"
              }
            }}
          > <SaveAltIcon />
          </IconButton>
        </Tooltip>      </Grid>
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
              <AddOutlinedIcon/> &nbsp;&nbsp;Add Routing
            </MenuItem>
            <MenuItem key="bulkDeleteRouting" value="bulkDeleteRouting">
              <DeleteSweepOutlinedIcon />&nbsp;&nbsp; Multi Delete
            </MenuItem>
            <MenuItem key="bulkAddRouting" value="bulkAddRouting">
              <PlaylistAddIcon />&nbsp;&nbsp; Multi Add
            </MenuItem>
            <MenuItem key="bulkEditRouting" value="bulkEditRouting">
              <EditNoteOutlinedIcon />&nbsp;&nbsp; Multi Edit
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
