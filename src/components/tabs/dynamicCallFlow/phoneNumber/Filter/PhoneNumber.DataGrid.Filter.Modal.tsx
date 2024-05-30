/* eslint-disable react/prop-types */
import React from "react";
import {
  ModalBody, ModalFooter, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  HeadingStyled, ModalSearchStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import SelectContainer from "../../../../core/SharedComponents/SelectContainer";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  BRAND, CALL_FLOW_ROUTE, CALL_FLOW_TEMPLATE, CHANNEL
} from "../Form/Dynamic.PhoneNumber.Form.Fields";
import { Filter } from "../../common/DataGrid/Abstract.DataGrid.Filter.Modal.Manager";
import { PhoneNumberDataGridFilterModalManager } from "./PhoneNumber.DataGrid.Filter.Modal.Manager";
import { FieldOptions } from "../../common/Form/AbstractFormFieldOptionsManager";

interface PhoneNumberDataGridFilterModalProps {
  dataGridDataFilterModalManager: PhoneNumberDataGridFilterModalManager;
  fieldOptions: FieldOptions;
}

export const FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER";

export const PhoneNumberDataGridFilterModal = ({
  dataGridDataFilterModalManager, fieldOptions
}: PhoneNumberDataGridFilterModalProps):JSX.Element => {

  const saveFilter = (filter: Filter) => {
    localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(filter));
    dataGridDataFilterModalManager.filterRecords();
    dataGridDataFilterModalManager.closeModal();
  };

  const handleChange = (event: any) => {
    dataGridDataFilterModalManager.state.filter = {
      filter: {
        ...dataGridDataFilterModalManager.state.filter,
        [event.target.name as keyof Filter]: event.target.value
      }
    } as Filter;
  };

  const resetSavedFilter = () => {
    localStorage.removeItem(FILTER_CACHE_KEY);
    dataGridDataFilterModalManager.saveFilter({});
    dataGridDataFilterModalManager.closeModal();
  };

  return (
    <div>
      <ModalSearchStyled isOpen={dataGridDataFilterModalManager.isModalOpen} onClose={() => {
        dataGridDataFilterModalManager.closeModal();
        return true;
      }}>
        <ModalHeader id="my-search-header">
          <HeadingStyled type="h4-light"> Advance Flow Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={fieldOptions[BRAND]}
                name="brand"
                label="Choose Brand"
                value={dataGridDataFilterModalManager.state.filter?.brand}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={fieldOptions[CHANNEL]}
                name="channel"
                label="Choose Channel"
                value={dataGridDataFilterModalManager.state.filter?.channel}
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
                value={dataGridDataFilterModalManager.state.filter?.pkey}
                onChange={handleChange}
                sx={{ width: "Calc(96%)" }}
              />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={fieldOptions[CALL_FLOW_TEMPLATE]}
                name="callFlowTemplate"
                label="Choose Call Flow Template"
                value={dataGridDataFilterModalManager.state.filter.callFlowTemplate}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={fieldOptions[CALL_FLOW_ROUTE]}
                name="callFlowRoute"
                label="Choose Call Flow Route"
                value={dataGridDataFilterModalManager.state.filter?.callFlowRoute}
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
            onClick={() => saveFilter(dataGridDataFilterModalManager.state.filter)}
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
