/* eslint-disable react/prop-types */
import React from "react";
import {
  ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  HeadingStyled, ModalSearchStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import SelectContainer from "../../../../core/SharedComponents/SelectContainer";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";
import { PhoneNumberFormManager } from "../Form/PhoneNumberForm.Manager";
import {
  BRAND, CALL_FLOW_ROUTE, CALL_FLOW_TEMPLATE, CHANNEL
} from "../Form/DynamicPhoneNumberForm.Fields";
import { Filter } from "../../common/DataGrid/DataGrid.State";

interface FilterModalProps {
  dataGridManager: PhoneNumberDataGridManager;
  formManager: PhoneNumberFormManager;
}

export const FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER";

export const PhoneNumberFilterModal = ({
  dataGridManager,
  formManager
}: FilterModalProps):JSX.Element => {

  const openModal = (isFilterModalOpen: boolean, filter?: Filter) => {
    if (filter) {
      localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(dataGridManager.dataGrid?.filter));
      dataGridManager.dataGrid.setFilter(filter);
    }

    dataGridManager.dataGrid.setIsFilterModalOpen(isFilterModalOpen);
  };

  const saveFilter = (filter: Filter) => {
    localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(filter));
    dataGridManager.filterRecords();
    openModal(false, filter);
  };

  const handleChange = (event: any) => {
    dataGridManager.dataGrid.setFilter({ [event.target.name as keyof Filter]: event.target.value } as Filter);
  };

  const resetSavedFilter = () => {
    localStorage.removeItem(FILTER_CACHE_KEY);
    dataGridManager.filterRecords();
    openModal(false, null);
  };

  return (
    <div>
      <ModalSearchStyled isOpen={dataGridManager.dataGrid.isFilterModalOpen} onClose={() => {
        dataGridManager.openFilterModal(false);
        return true;
      }}>
        <ModalHeader id="my-search-header">
          <HeadingStyled type="h4-light"> Advance Flow Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={formManager.fieldOptions.get(BRAND)}
                name="brand"
                label="Choose Brand"
                value={dataGridManager.dataGrid.filter?.brand}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={formManager.fieldOptions.get(CHANNEL)}
                name="channel"
                label="Choose Channel"
                value={dataGridManager.dataGrid.filter?.channel}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <TextField
                variant="outlined"
                label="#Dialed"
                name="pkey"
                type="text"
                value={dataGridManager.dataGrid.filter?.pkey}
                onChange={handleChange}
                sx={{ width: "Calc(96%)" }}
              />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={formManager.fieldOptions.get(CALL_FLOW_TEMPLATE)}
                name="callFlowTemplate"
                label="Choose Call Flow Template"
                value={dataGridManager.dataGrid.filter.callFlowTemplate}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={formManager.fieldOptions.get(CALL_FLOW_ROUTE)}
                name="callFlowRoute"
                label="Choose Call Flow Route"
                value={dataGridManager.dataGrid.filter?.callFlowRoute}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
          </Grid>
        </ModalBody>
        <ModalFooter >
          <Button
            type="submit"
            value="Save Filter"
            variant="contained"
            color="primary"
            sx={{ marginRight: 1 }}
            onClick={() => saveFilter(dataGridManager.dataGrid.filter)}
          >
            Save Filter
          </Button>
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            onClick={() => resetSavedFilter()}
          >
            Reset Filter
          </Button>
        </ModalFooter>
      </ModalSearchStyled>
    </div>
  );
};
