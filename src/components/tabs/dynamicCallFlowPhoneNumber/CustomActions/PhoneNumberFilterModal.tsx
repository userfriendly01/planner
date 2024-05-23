/* eslint-disable react/prop-types */
import React from "react";
import {
  ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  HeadingStyled, ModalSearchStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import SelectContainer from "../../../core/SharedComponents/SelectContainer";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Filter } from "../../../../common/DataGrid/DataGridState.Interfaces";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";

interface FilterModalProps {
  phoneNumberDataGridManager: PhoneNumberDataGridManager,
}

export const FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER";

export const PhoneNumberFilterModal = ({
  phoneNumberDataGridManager
}: FilterModalProps):JSX.Element => {

  const openModal = (isFilterModalOpen: boolean, filter?: Filter) => {
    if (filter) {
      localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(phoneNumberDataGridManager.dataGrid?.filter));
      phoneNumberDataGridManager.dataGrid.setFilter(filter);
    }

    phoneNumberDataGridManager.dataGrid.setIsFilterModalOpen(isFilterModalOpen);
  };

  const saveFilter = (filter: Filter) => {
    localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(filter));
    phoneNumberDataGridManager.filterRecords();
    openModal(false, filter);
  };

  const handleChange = (event: any) => {
    phoneNumberDataGridManager.dataGrid.setFilter({ [event.target.name as keyof Filter]: event.target.value } as Filter);
  };

  const resetSavedFilter = () => {
    localStorage.removeItem(FILTER_CACHE_KEY);
    phoneNumberDataGridManager.filterRecords();
    openModal(false, null);
  };

  return (
    <div>
      <ModalSearchStyled isOpen={phoneNumberDataGridManager.dataGrid.isFilterModalOpen} onClose={() => {
        phoneNumberDataGridManager.openFilterModal(false);
        return true;
      }}>
        <ModalHeader id="my-search-header">
          <HeadingStyled type="h4-light"> Advance Flow Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={phoneNumberDataGridManager.dataGrid.masterData?.brand}
                name="brand"
                label="Choose Brand"
                value={phoneNumberDataGridManager.dataGrid.filter?.brand}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={phoneNumberDataGridManager.dataGrid.masterData?.channel}
                name="channel"
                label="Choose Channel"
                value={phoneNumberDataGridManager.dataGrid.filter?.channel}
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
                value={phoneNumberDataGridManager.dataGrid.filter?.pkey}
                onChange={handleChange}
                sx={{ width: "Calc(96%)" }}
              />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={phoneNumberDataGridManager.dataGrid.masterData?.callFlowTemplate}
                name="callFlowTemplate"
                label="Choose Call Flow Template"
                value={phoneNumberDataGridManager.dataGrid.filter.callFlowTemplate}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={phoneNumberDataGridManager.dataGrid.masterData?.callFlowRoute}
                name="callFlowRoute"
                label="Choose Call Flow Route"
                value={phoneNumberDataGridManager.dataGrid.filter?.callFlowRoute}
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
            onClick={() => saveFilter(phoneNumberDataGridManager.dataGrid.filter)}
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
