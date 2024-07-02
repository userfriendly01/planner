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
import { userDoesNotHaveReadWriteAccess } from "components/tabs/dynamicCallFlow/common/authentication";
import {
  DataGridControllerRef,
  DataGridFilterRef
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { ActionRecordType } from "dynamicCallFlow/GraphQL/Action.Interfaces";
import { ActionXlsxExporter } from "dynamicCallFlow/Xlsx/Action.Xlsx.Exporter";
import { DYNAMIC_CALL_FLOW_PROFILE } from "dynamicCallFlow/DynamicCallFlow.PhoneNumber.Container";
import { FilterLabel } from "dynamicCallFlow/DataGrid/Action.DataGrid.Filter.Modal";

interface ActionDataGridToolBarProps {
  isFilterModalOpen: boolean;
  dataGridFilter: DataGridFilterRef<ActionRecordType>;
  dataGridController: DataGridControllerRef<ActionRecordType>;
  handlePreviewModalOpen: (event: any) => void;
}

export const ActionDataGridToolBar = ({
  handlePreviewModalOpen, isFilterModalOpen, dataGridFilter, dataGridController
}: ActionDataGridToolBarProps): JSX.Element => {
  const {
    permissions,
    modalController
  } = useContext(DynamicCallFlowActionContext);

  const userDoesNotHavePermission = useMemo(() => userDoesNotHaveReadWriteAccess(permissions, DYNAMIC_CALL_FLOW_PROFILE), []);
  const [localFilter, setLocalFilter] = useState<Filter>({} as Filter);

  useEffect(()=> {
    setLocalFilter(dataGridFilter.current.getFilter());
  },[isFilterModalOpen]);

  const removeFilterElement = (key: string) => {
    setLocalFilter(dataGridFilter.current.removeFilterElement(key));
    dataGridFilter.current.applyFilter();
  };

  const exportDataFile = async () => {
    await ActionXlsxExporter.instance().exportXlsxFiles(dataGridController.current.dataGridRecords, "CallFlowConfiguration");
  };

  return (
    <Grid container>
      <Grid item key="phone-number-search-box" xs={9}>
        <TextField
          sx={{ marginLeft: 1 }}
          placeholder="Click here to open filter"
          InputProps={{
            startAdornment:
              localFilter && Object.keys(localFilter).map((key: string, index: number) => (
                <Chip
                  key={key}
                  color="primary"
                  tabIndex={index}
                  label={`${FilterLabel.get(key)} : ${localFilter[key]}`}
                  onDelete={()=> { removeFilterElement(key); }}
                  sx={{ margin: 1 }}
                />
              ))
          }}
          fullWidth
          id="CallFlowConfiguration-SearchBox-input"
          label="Search"
          margin="normal"
          name="CallFlowConfiguration-SearchBox-input"
          variant="standard"
          onClick={() => modalController.current.openModal(ActionModalTypeEnum.Filter)}
        />
      </Grid>
      <Grid item key="Load Call Flow Configuration" xs={2}>
        <FormControl sx={{
          marginTop: "10px",
          marginBottom: "8px",
          marginLeft: "35px"
        }}>
          <Button
            variant="contained"
            value="Save"
            color="primary"
            sx={{
              marginLeft: 2,
              fontSize: "12px"
            }}
            aria-label="loadCallFlowConfigurationButton"
            disabled={userDoesNotHavePermission}
            onClick={handlePreviewModalOpen}>
            Import Call Flow Configuration
          </Button>
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
              marginTop: "30px",
              marginLeft: "10px",
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