import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Tooltip
} from "@mui/material";
import React, {
  useState, useEffect, useMemo
} from "react";
import {
  CACHE_FILTER_FLOW, getAdvanceFilter, readWriteAccess
} from "utils";
import {
  FlowAdvanceFilter, PreviewModalAction
} from "../AlohaFlow.Interfaces";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";


interface CustomFlowGridToolBarProps {
  openAddModal: (flag: boolean, isSubmitted?: boolean) => void;
  openPreviewModal: (flag: boolean, action: PreviewModalAction) =>void;
  openAdvanceSearchModal: (flag: boolean, advanceFilter?: FlowAdvanceFilter) => void;
  exportDataFile: ()=> void;
  applyFilter?: () => void;
  isAdvanceSearchOpen?: boolean;
  matchedGroups?: string[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomFlowGridToolBar = ({
  openAddModal, openPreviewModal, openAdvanceSearchModal, exportDataFile, applyFilter, matchedGroups,isAdvanceSearchOpen
}:CustomFlowGridToolBarProps) =>{
  const [flowFilter, setFlowFilter] = useState<FlowAdvanceFilter>();
  const enableRouting = useMemo(() => readWriteAccess(matchedGroups,"aloha-flow"), []);
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
      case "bulkDeleteFlow":
        openPreviewModal(true, "delete");
        break;
      case "bulkAddFlow":
        openPreviewModal(true, "add");
        break;
      case "bulkEditFlow":
        openPreviewModal(true, "edit");
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
      <Grid item key = "Export FlowUI" xs={1} >
        <Tooltip title="Export Flow Records" placement="right-start"  sx={{
          left: "calc(76%)"
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
            disabled = {!enableRouting}
            onChange={handleChange}
            variant="filled"
            size="small"
            displayEmpty
          >
            <MenuItem key="addFlow" value="addFlow">
              <AddOutlinedIcon />&nbsp;&nbsp; Add Flow
            </MenuItem>
            <MenuItem key="bulkDeleteFlow" value="bulkDeleteFlow">
              <DeleteSweepOutlinedIcon />&nbsp;&nbsp; Multi Delete Flow
            </MenuItem>
            <MenuItem key="bulkAddFlow" value="bulkAddFlow">
              <PlaylistAddIcon />&nbsp;&nbsp; Multi Add Flow
            </MenuItem>
            <MenuItem key="bulkEditFlow" value="bulkEditFlow">
              <EditNoteOutlinedIcon />&nbsp;&nbsp; Multi Edit Flow
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