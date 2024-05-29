import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Tooltip
} from "@mui/material";
import React, {
  useEffect, useMemo
} from "react";
import { readWriteAccess } from "utils";
import {
  PlaylistAdd,
  SaveAlt,
  DeleteSweepOutlined,
  AddOutlined,
  EditNoteOutlined
} from "@mui/icons-material";
import { PhoneNumberDataGridManager } from "./PhoneNumberDataGrid.Manager";
import { Filter } from "../../common/DataGrid/DataGrid.State";


interface CustomFlowGridToolBarProps {
  dataGridManager: PhoneNumberDataGridManager,
  exportDataFile: ()=> void;
  matchedGroups?: any[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const PhoneNumberDataGridToolBar = ({
  dataGridManager, exportDataFile, matchedGroups
}: CustomFlowGridToolBarProps) => {

  const enableFlow = useMemo(() => readWriteAccess(matchedGroups,"aloha-flow"), []);

  useEffect(()=>{
    dataGridManager.dataGrid.setFilter(dataGridManager.getFilter());
  },[dataGridManager.dataGrid.isFilterModalOpen]);

  const handleChange=(event:any):void=> {
    const { value } = event.target;
    switch (value) {
      case "addFlow":
        dataGridManager.openAddModal(true);
        break;
      case "bulkDeleteFlow":
        dataGridManager.openPreviewModal(true, "delete");
        break;
      case "bulkAddFlow":
        dataGridManager.openPreviewModal(true, "add");
        break;
      case "bulkEditFlow":
        dataGridManager.openPreviewModal(true, "edit");
        break;
      default:
        break;
    }
  };

  const handleOnDelete = (key: string) =>{
    const filter: Filter = { ...dataGridManager.dataGrid.filter };
    delete filter[key as keyof Filter];
    dataGridManager.dataGrid.setFilter(filter);
    dataGridManager.filterRecords();
  };

  return (
    <Grid container>
      <Grid item key="flow-search-box" xs={9}>
        <TextField
          sx={{ marginLeft: 1 }}
          placeholder="Click here to apply filter"
          InputProps={{
            startAdornment:
            dataGridManager.dataGrid.filter && Object.keys(dataGridManager.dataGrid.filter).map((key: string, index:number)=>(
              <Chip
                key={key}
                color="primary"
                tabIndex={index}
                label={`${key.toLowerCase()} : ${dataGridManager.dataGrid.filter[key as keyof Filter]}`}
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
          onClick={()=>dataGridManager.openFilterModal(true)}
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
              <AddOutlined />&nbsp;&nbsp; Add Legacy Call Flow
            </MenuItem>
            <MenuItem key="addFlow" value="addFlow">
              <AddOutlined />&nbsp;&nbsp; Add Dynamic Call Flow
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
  PhoneNumberDataGridToolBar
};