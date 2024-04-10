import {
  FormControl, InputLabel, MenuItem, Select, Grid
} from "@mui/material";
import React, {
  useMemo
} from "react";
import {
  readWriteAccess
} from "utils";
import {
  PreviewModalAction
} from "../DynamicFlow.Interfaces";
import {
  PlaylistAdd
} from "@mui/icons-material";

interface CustomFlowGridToolBarProps {
  matchedGroups?: any[];
  openPreviewModal: (flag: boolean, action: PreviewModalAction) =>void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomFlowGridToolBar = ({
  matchedGroups,
  openPreviewModal
}:CustomFlowGridToolBarProps) =>{
  const enableFlow = useMemo(() => readWriteAccess(matchedGroups, "FlowReadWrite"), []);

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

export {
  CustomFlowGridToolBar
};