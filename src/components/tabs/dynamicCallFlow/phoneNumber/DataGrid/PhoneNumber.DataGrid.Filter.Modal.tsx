/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { ModalBody, ModalFooter, ModalHeader } from "@lmig/lmds-react-modal";
import { HeadingStyled, ModalSearchStyled } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Styles";
import SelectContainer from "components/SelectContainer";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CHANNEL
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import { DataGridFilterModalProps, Filter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import { PKEY } from "components/tabs/dynamicCallFlow/phoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import { DynamicCallFlowPhoneNumberContext } from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Container";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

export const FilterLabel: Map<string, string> = new Map<string, string>([
  ["brand", "Brand"],
  ["channel", "Channel"],
  ["pkey", "#Dialed"],
  ["callFlowTemplate", "Call Flow Template"],
  ["callFlowRoute", "Call Flow Route"]
]);

export const PhoneNumberDataGridFilterModal = ({
  isOpen, dataGridFilter
}: DataGridFilterModalProps<PhoneNumberRecordType>):JSX.Element => {
  const { modalController } = useContext(DynamicCallFlowPhoneNumberContext);

  const [filter, setFilter] = useState<Filter>({} as Filter);

  useEffect(() => {
    setFilter(dataGridFilter.current.getFilter());
  }, [isOpen]);

  const applyFilter = () => {
    dataGridFilter.current.applyFilter();
    modalController.current.closeModal();
  };

  const handleChange = (event: any) => {
    setFilter(dataGridFilter.current.addFilterElement(event.target.name, event.target.value));
  };

  const resetFilterAndClose = () => {
    setFilter(dataGridFilter.current.resetFilter());
    modalController.current.closeModal();
  };

  return (
    <div>
      <ModalSearchStyled isOpen={isOpen} onClose={() => modalController.current.closeModal()}>
        <ModalHeader id="my-search-header">
          <HeadingStyled type="h4-light"> Phone Number Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={dataGridFilter?.current.fieldOptions[BRAND] || []}
                name="brand"
                label="Choose Brand"
                value={filter[BRAND] || ""}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={dataGridFilter?.current.fieldOptions[CHANNEL]}
                name="channel"
                label="Choose Channel"
                value={filter[CHANNEL] || ""}
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
                value={filter[PKEY] || ""}
                onChange={handleChange}
                sx={{ width: "Calc(96%)" }}
              />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={dataGridFilter?.current.fieldOptions[CALL_FLOW_TEMPLATE]}
                name="callFlowTemplate"
                label="Choose Call Flow Template"
                value={filter[CALL_FLOW_TEMPLATE]}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={dataGridFilter?.current.fieldOptions[CALL_FLOW_ROUTE]}
                name="callFlowRoute"
                label="Choose Call Flow Route"
                value={filter[CALL_FLOW_ROUTE] || ""}
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
            onClick={applyFilter}
          >
            Save Filter
          </Button>
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            onClick={resetFilterAndClose}
          >
            Reset Filter
          </Button>
        </ModalFooter>
      </ModalSearchStyled>
    </div>
  );
};
