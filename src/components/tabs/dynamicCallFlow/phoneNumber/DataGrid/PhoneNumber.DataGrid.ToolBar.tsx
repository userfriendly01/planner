import {
  Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip
} from "@mui/material";
import React, {
  ReactElement,
  useContext, useEffect, useMemo
} from "react";
import {
  AddOutlined, DeleteSweepOutlined, EditNoteOutlined, PlaylistAdd, SaveAlt
} from "@mui/icons-material";
import {
  DataGridFilterRef, Filter
} from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import { DynamicCallFlowPhoneNumberContext } from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Container";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  DYNAMIC_CALL_FLOW_ROLE, userDoesNotHaveReadWriteAccess
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Authentication";
import { PhoneNumberXlsxExporter } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Export/PhoneNumber.Xlsx.Exporter";
import { PhoneNumberModalTypeEnum } from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Interfaces";
import { FilterLabel } from "components/tabs/dynamicCallFlow/phoneNumber/DataGrid/PhoneNumber.DataGrid.Filter.Modal";
import { DataGridControllerRef } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";

interface PhoneNumberDataGridToolBarProps {
  isFilterModalOpen: boolean;
  dataGridFilter: DataGridFilterRef<PhoneNumberRecordType>;
  dataGridController: DataGridControllerRef<PhoneNumberRecordType>;
  loading: boolean;
  handleModalOpen: (event: any) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const PhoneNumberDataGridToolBar = ({
  isFilterModalOpen, dataGridFilter, dataGridController, handleModalOpen, loading
}: PhoneNumberDataGridToolBarProps): ReactElement => {
  const {
    permissions,
    modalController
  } = useContext(DynamicCallFlowPhoneNumberContext);

  const userDoesNotHavePermission = useMemo(() => userDoesNotHaveReadWriteAccess(permissions, DYNAMIC_CALL_FLOW_ROLE), [permissions]);
  const [localFilter, setLocalFilter] = React.useState<Filter>({} as Filter);

  useEffect(()=> {
    setLocalFilter(dataGridFilter.current.getFilter());
  },[isFilterModalOpen]);

  const removeFilterElement = (key: string) => {
    setLocalFilter(dataGridFilter.current.removeFilterElement(key));
    dataGridFilter.current.applyFilter();
  };

  const exportDataFile = async () => {
    await PhoneNumberXlsxExporter.instance().exportXlsxFiles(dataGridController.current.dataGridRecords, dataGridFilter.current.filterToString());
  };

  return (
    <Grid container>
      {(!loading) ? (
        <Grid item key="phone-number-filter-grid" xs={9}>
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
                    label={`${FilterLabel.get(key) || key} : ${localFilter[key]}`}
                    onDelete={()=> { removeFilterElement(key); }}
                    sx={{ margin: 1 }}
                  />
                ))
            }}
            fullWidth
            id="phone-number-filter-text-field"
            label="Search"
            margin="normal"
            name="dynamic-call-flow-phone-numberSearchBox-input"
            variant="standard"
            onClick={() => modalController.current.openModal(PhoneNumberModalTypeEnum.Filter)}
          />
        </Grid>) : (<div></div>)}
      {(!loading) ? (
        <Grid item key = "Export Dynamic Call Flow Phone Number Records Grid" xs={1} >
          <Tooltip title="Export Dynamic Call Flow Phone Number Records Tooltip" placement="right-start"  sx={{
            left: "calc(76%)"
          }}>
            <IconButton
              aria-label="export-records-button"
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
        </Grid>) : (<div></div>)}
      {(!loading) ? (
        <Grid item key="dynamic-call-flow-phone-numberaction-box" xs={2}>
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
              disabled = {userDoesNotHavePermission}
              onChange={handleModalOpen}
              variant="filled"
              size="small"
              displayEmpty
            >
              <MenuItem key={PhoneNumberModalTypeEnum.AddLegacyPhoneNumber} value={PhoneNumberModalTypeEnum.AddLegacyPhoneNumber}>
                <AddOutlined />&nbsp;&nbsp; Add Legacy Call Flow
              </MenuItem>
              <MenuItem key={PhoneNumberModalTypeEnum.AddDynamicPhoneNumber} value={PhoneNumberModalTypeEnum.AddDynamicPhoneNumber}>
                <AddOutlined />&nbsp;&nbsp; Add Dynamic Call Flow
              </MenuItem>
              <MenuItem key={PhoneNumberModalTypeEnum.BulkDelete} value={PhoneNumberModalTypeEnum.BulkDelete}>
                <DeleteSweepOutlined />&nbsp;&nbsp; Multi Delete Flow
              </MenuItem>
              <MenuItem key={PhoneNumberModalTypeEnum.BulkAdd} value={PhoneNumberModalTypeEnum.BulkAdd}>
                <PlaylistAdd />&nbsp;&nbsp; Multi Add Flow
              </MenuItem>
              <MenuItem key={PhoneNumberModalTypeEnum.BulkEdit} value={PhoneNumberModalTypeEnum.BulkEdit}>
                <EditNoteOutlined />&nbsp;&nbsp; Multi Edit Flow
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>) : (<div></div>)}
    </Grid>
  );
};

export {
  PhoneNumberDataGridToolBar
};