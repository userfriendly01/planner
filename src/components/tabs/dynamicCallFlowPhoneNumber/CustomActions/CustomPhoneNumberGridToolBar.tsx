import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Tooltip
} from "@mui/material";
import React, {
  useEffect, useMemo
} from "react";
import { readWriteAccess } from "utils";
import {
  DynamicCallFlowPhoneNumberAdvanceFilter, PreviewModalAction
} from "../DynamicCallFlowPhoneNumber.Interfaces";
import {
  PlaylistAdd,
  SaveAlt,
  DeleteSweepOutlined,
  AddOutlined,
  EditNoteOutlined
} from "@mui/icons-material";
import { Filter } from "../../../../common/DataGrid/DataGridState.Interfaces";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";


interface CustomFlowGridToolBarProps {
  phoneNumberDataGridManager: PhoneNumberDataGridManager,
  exportDataFile: ()=> void;
  matchedGroups?: any[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomPhoneNumberGridToolBar = ({
  phoneNumberDataGridManager, exportDataFile, matchedGroups
}: CustomFlowGridToolBarProps) => {

  const enableFlow = useMemo(() => readWriteAccess(matchedGroups,"aloha-flow"), []);

  useEffect(()=>{
    phoneNumberDataGridManager.dataGrid.setFilter(phoneNumberDataGridManager.getFilter());
  },[phoneNumberDataGridManager.dataGrid.isFilterModalOpen]);

  const handleChange=(event:any):void=> {
    const { value } = event.target;
    switch (value) {
      case "addFlow":
        phoneNumberDataGridManager.openAddModal(true);
        break;
      case "bulkDeleteFlow":
        phoneNumberDataGridManager.openPreviewModal(true, "delete");
        break;
      case "bulkAddFlow":
        phoneNumberDataGridManager.openPreviewModal(true, "add");
        break;
      case "bulkEditFlow":
        phoneNumberDataGridManager.openPreviewModal(true, "edit");
        break;
      default:
        break;
    }
  };

  const handleOnDelete = (key: string) =>{
    const filter: Filter = { ...phoneNumberDataGridManager.dataGrid.filter };
    delete filter[key as keyof Filter];
    phoneNumberDataGridManager.dataGrid.setFilter(filter);
    phoneNumberDataGridManager.filterRecords();
  };

  return (
    <Grid container>
      <Grid item key="flow-search-box" xs={9}>
        <TextField
          sx={{ marginLeft: 1 }}
          placeholder="Click here to apply filter"
          InputProps={{
            startAdornment:
            phoneNumberDataGridManager.dataGrid.filter && Object.keys(phoneNumberDataGridManager.dataGrid.filter).map((key: string, index:number)=>(
              <Chip
                key={key}
                color="primary"
                tabIndex={index}
                label={`${key.toLowerCase()} : ${phoneNumberDataGridManager.dataGrid.filter[key as keyof DynamicCallFlowPhoneNumberAdvanceFilter]}`}
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
          onClick={()=>phoneNumberDataGridManager.openFilterModal(true)}
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
            <MenuItem key="addFlow" value="addFlow">
              <AddOutlined />&nbsp;&nbsp; Add Flow
            </MenuItem>
            <MenuItem key="bulkDeleteFlow" value="bulkDeleteFlow">
              <DeleteSweepOutlined />&nbsp;&nbsp; Multi Delete Flow
            </MenuItem>
            <MenuItem key="bulkAddFlow" value="bulkAddFlow">
              <PlaylistAdd />&nbsp;&nbsp; Multi Add Flow
            </MenuItem>
            <MenuItem key="bulkEditFlow" value="bulkEditFlow">
              <EditNoteOutlined />&nbsp;&nbsp; Multi Edit Flow
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export {
  CustomPhoneNumberGridToolBar
};