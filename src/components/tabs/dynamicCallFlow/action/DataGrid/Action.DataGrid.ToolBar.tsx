import {
  Button, Chip,
  FormControl, Grid, IconButton, TextField, Tooltip
} from "@mui/material";
import React, {
  useContext, useEffect, useMemo, useState
} from "react";
import {
  SaveAlt
} from "@mui/icons-material";
import { DynamicCallFlowActionContext } from "../DynamicCallFlow.Action.Container";
import { Filter } from "../../common/DataGrid/Abstract.DataGrid.Filter";
import { ActionModalTypeEnum } from "dynamicCallFlow/DataGrid/Action.DataGrid.Component";
import { userHasReadWriteAccess } from "components/tabs/dynamicCallFlow/common/authentication";
import {
  DataGridControllerRef,
  DataGridFilterRef
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { ActionRecordType } from "dynamicCallFlow/GraphQL/Action.Interfaces";
import { ActionXlsxExporter } from "dynamicCallFlow/Xlsx/Action.Xlsx.Exporter";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface ActionDataGridToolBarProps {
  isFilterModalOpen: boolean;
  dataGridFilter: DataGridFilterRef<ActionRecordType>;
  dataGridController: DataGridControllerRef<ActionRecordType>;
  handlePreviewModalOpen: (event: any) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ActionDataGridToolBar = ({
  handlePreviewModalOpen, isFilterModalOpen, dataGridFilter, dataGridController
}: ActionDataGridToolBarProps) => {
  const {
    permissions,
    modalController
  } = useContext(DynamicCallFlowActionContext);

  const userHasPermission = useMemo(() => userHasReadWriteAccess(permissions,"aloha-flow"), []);
  const [localFilter, setLocalFilter] = useState<Filter>({} as Filter);

  useEffect(()=> {
    setLocalFilter(dataGridFilter.current.getFilter());
  },[isFilterModalOpen]);

  const removeFilterElement = (key: string) => {
    setLocalFilter(dataGridFilter.current.removeFilterElement(key));
    dataGridFilter.current.applyFilter();
  };

  const exportDataFile = async () => {
    const actionXlsxExporter = new ActionXlsxExporter();
    const workbooks: Map<string, XLSX.WorkBook> = actionXlsxExporter.generateWorkBooks(dataGridController.current.dataGridRecords);

    await actionXlsxExporter.exportXlsxFiles(workbooks);
  };

  return (
    <Grid container>
      <Grid item key="phone-number-search-box" xs={9}>
        <TextField
          sx={{ marginLeft: 1 }}
          placeholder="Click here to apply filter"
          InputProps={{
            startAdornment:
              localFilter && Object.keys(localFilter).map((key: string, index: number) => (
                <Chip
                  key={key}
                  color="primary"
                  tabIndex={index}
                  label={`${key.toLowerCase()} : ${localFilter[key]}`}
                  onDelete={(event: any)=> { removeFilterElement(key); }}
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
          onClick={() => modalController.current.openModal(ActionModalTypeEnum.Filter)}
        />
      </Grid>
      <Grid item key="Load Call Flow Configuration" xs={2}>
        <FormControl sx={{
          marginTop: "5px",
          marginBottom: "8px",
          marginLeft: "35px"
        }}>
          <Button
            variant="contained"
            value="Save"
            color="primary"
            sx={{ marginLeft: 2 }}
            aria-label="loadCallFlowConfigurationButton"
            disabled={false} // TODO: change this to us !userHasPermission
            onClick={handlePreviewModalOpen}>
            Import Call Flow Configuration
          </Button>
          {/*<InputLabel>Actions</InputLabel>*/}
          {/*<Select*/}
          {/*  inputProps={{*/}
          {/*    sx: {*/}
          {/*      width: 120*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  label="Actions"*/}
          {/*  value=""*/}
          {/*  disabled = {false}*/}
          {/*  onChange={handleChange}*/}
          {/*  variant="filled"*/}
          {/*  size="small"*/}
          {/*  displayEmpty*/}
          {/*>*/}
          {/*  <MenuItem key={ActionModalTypeEnum.BatchCreate} value={ActionModalTypeEnum.BatchCreate}>*/}
          {/*    <PlaylistAdd />&nbsp;&nbsp; Multi Add*/}
          {/*  </MenuItem>*/}
          {/*</Select>*/}
        </FormControl>
      </Grid>
      <Grid item key = "Export Call Flow Configuration" xs={1} >
        <Tooltip title="Export Call Flow Configuration" placement="right-start"  sx={{
          left: "20px"
        }}>
          <IconButton
            onClick={exportDataFile}
            color = "primary"
            size = "large"
            sx ={{
              // position: "relative",
              marginTop: "40px",
              marginLeft: "5px",
              ":hover": {
                backgroundColor: "grey",
                color: "white"
              }
            }}
          > <SaveAlt />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item key="flow-search-box" xs={9}>
      </Grid>
    </Grid>
  );
};