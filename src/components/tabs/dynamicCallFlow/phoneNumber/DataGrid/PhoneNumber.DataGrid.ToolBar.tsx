import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, IconButton, Tooltip
} from "@mui/material";
import React, {
  useContext,
  useEffect, useMemo, useState
} from "react";
import {
  PlaylistAdd,
  SaveAlt,
  DeleteSweepOutlined,
  AddOutlined,
  EditNoteOutlined
} from "@mui/icons-material";
import {
  Filter
} from "../../common/DataGrid/Abstract.DataGrid.Filter";
import { DynamicCallFlowPhoneNumberContext } from "../DynamicCallFlow.PhoneNumber.Container";
import { PhoneNumberModalTypeEnum } from "../DynamicCallFlow.PhoneNumber.Container.Modal.Controller";
import { DataGridFilterRef } from "../../common/DynamicCallFlow.Interfaces";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { readWriteAccess } from "utils/alohaConfigUtils";
import {
  userDoesNotHaveReadWriteAccess,
  userHasReadWriteAccess
} from "components/tabs/dynamicCallFlow/common/authentication";

interface PhoneNumberDataGridToolBarProps {
  isFilterModalOpen: boolean;
  dataGridFilter: DataGridFilterRef<PhoneNumberRecordType>;
  handlePreviewModalOpen: (event: any) => void;
  exportDataFile: ()=> void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const PhoneNumberDataGridToolBar = ({
  isFilterModalOpen, dataGridFilter, handlePreviewModalOpen, exportDataFile
}: PhoneNumberDataGridToolBarProps) => {
  const {
    permissions,
    modalController
  } = useContext(DynamicCallFlowPhoneNumberContext);

  const userHasPermission = useMemo(() => userHasReadWriteAccess(permissions,"aloha-flow"), []);
  const [localFilter, setLocalFilter] = useState<Filter>({} as Filter);

  useEffect(()=> {
    setLocalFilter(dataGridFilter.current.getFilter());
  },[isFilterModalOpen]);

  const removeFilterElement = (key: string) => {
    setLocalFilter(dataGridFilter.current.removeFilterElement(key));
    dataGridFilter.current.applyFilter();
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
          onClick={() => modalController.current.openModal(PhoneNumberModalTypeEnum.Filter)}
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
            disabled = {false} // TODO: change this to us !userHasPermission
            onChange={handlePreviewModalOpen}
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
      </Grid>
    </Grid>
  );
};

export {
  PhoneNumberDataGridToolBar
};