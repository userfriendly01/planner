import React, {
  useState, useEffect, useMemo
} from "react";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Tooltip
} from "@mui/material";
import {
  PreviewModalAction,
  RoutingFilter
} from "../AlohaRouting.Interfaces";
import {
  CACHE_FILTER_ROUTING, getAdvanceFilter, readWriteAccess
} from "utils";
import {
  PlaylistAdd,
  SaveAlt,
  DeleteSweepOutlined,
  AddOutlined,
  EditNoteOutlined
} from "@mui/icons-material";
import { useAdminState } from "context";

interface CustomRoutingGridToolBarProps {
  openAddModal: (flag: boolean) => void;
  openEditModal: (flag: boolean) => void;
  openPreviewModal: (flag: boolean, action: PreviewModalAction) => void;
  openAdvanceSearchModal:(flag: boolean) => void;
  exportDataFile: ()=> void;
  applyFilter?: () => void;
  isAdvanceSearchOpen?: boolean;
  matchedGroups?:any[];
}

export const CustomRoutingGridToolBar = ({
  openAddModal, openPreviewModal, openAdvanceSearchModal, exportDataFile, applyFilter, isAdvanceSearchOpen, matchedGroups
}: CustomRoutingGridToolBarProps):JSX.Element => {

  const [routingFilter, setRoutingFilter] = useState<RoutingFilter>();
  const env: string = useAdminState().userContext.pingIdentity.environment;
  const enableRouting = useMemo(() => readWriteAccess(matchedGroups,"aloha-route",env), []);

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
          > <SaveAlt />
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
            disabled={enableRouting}
          >
            <MenuItem key="addRouting" value="addRouting">
              <AddOutlined /> &nbsp;&nbsp;Add Routing
            </MenuItem>
            <MenuItem key="bulkDeleteRouting" value="bulkDeleteRouting">
              <DeleteSweepOutlined />&nbsp;&nbsp; Multi Delete
            </MenuItem>
            <MenuItem key="bulkAddRouting" value="bulkAddRouting">
              <PlaylistAdd />&nbsp;&nbsp; Multi Add
            </MenuItem>
            <MenuItem key="bulkEditRouting" value="bulkEditRouting">
              <EditNoteOutlined />&nbsp;&nbsp; Multi Edit
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
