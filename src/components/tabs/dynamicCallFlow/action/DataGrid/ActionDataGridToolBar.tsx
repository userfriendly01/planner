import {
  FormControl, InputLabel, MenuItem, Select, Grid,
  IconButton,
  Tooltip
} from "@mui/material";
import React, {
  useMemo
} from "react";
import {
  readWriteAccess
} from "utils";
import {
  PlaylistAdd,
  SaveAlt
} from "@mui/icons-material";
import { PreviewModalActionType } from "../../common/DataGrid/DataGridState.Interfaces";

interface CustomFlowGridToolBarProps {
  exportDataFile: ()=> void;
  matchedGroups?: any[];
  openPreviewModal: (flag: boolean, action: PreviewModalActionType) =>void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ActionDataGridToolBar = ({
  exportDataFile,
  matchedGroups,
  openPreviewModal
}:CustomFlowGridToolBarProps) =>{
  const enableFlow = useMemo(() => readWriteAccess(matchedGroups,"aloha-flow"), []);

  const handleChange=(event:any):void=> {
    const { value } = event.target;
    switch (value) {
      case "bulkAddFlow":
        openPreviewModal(true, "add");
        break;
      default:
        break;
    }
  };

  return (
    <Grid container>
      <Grid item key="flow-search-box" xs={9}>
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
          > <SaveAlt />
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
            disabled = {enableFlow}
            onChange={handleChange}
            variant="filled"
            size="small"
            displayEmpty
          >
            <MenuItem key="bulkAddFlow" value="bulkAddFlow">
              <PlaylistAdd />&nbsp;&nbsp; Multi Add Flow
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};