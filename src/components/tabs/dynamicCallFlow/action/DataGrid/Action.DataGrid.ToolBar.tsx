import {
  FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip
} from "@mui/material";
import React, {
  useContext, useMemo, useState
} from "react";
import {
  PlaylistAdd, SaveAlt
} from "@mui/icons-material";
import { DynamicCallFlowActionContext } from "../DynamicCallFlow.Action.Container";
import { Filter } from "../../common/DataGrid/Abstract.DataGrid.Filter";
import { readWriteAccess } from "utils/alohaConfigUtils";
import { ActionModalTypeEnum } from "dynamicCallFlow/DataGrid/Action.DataGrid.Component";

interface ActionDataGridToolBarProps {
  isFilterModalOpen: boolean;
  exportDataFile: ()=> void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ActionDataGridToolBar = ({
  isFilterModalOpen, exportDataFile
}: ActionDataGridToolBarProps) => {
  const {
    permissions,
    modalController
  } = useContext(DynamicCallFlowActionContext);
  const enableFlow = useMemo(() => readWriteAccess(permissions,"aloha-flow"), []);
  const [localFilter, setLocalFilter] = useState<Filter>({} as Filter);

  // useEffect(()=> {
  //   setLocalFilter(dataGridFilter.getFilter());
  // },[isFilterModalOpen]);

  const handleChange=(event:any):void=> {
    modalController.current.openModal(event.target.value);
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
            disabled = {false}
            onChange={handleChange}
            variant="filled"
            size="small"
            displayEmpty
          >
            <MenuItem key={ActionModalTypeEnum.BulkAdd} value={ActionModalTypeEnum.BulkAdd}>
              <PlaylistAdd />&nbsp;&nbsp; Multi Add
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};