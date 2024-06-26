/* eslint-disable react/prop-types */
import React, {
  useContext,
  useEffect, useState
} from "react";
import {
  ModalBody, ModalFooter, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  HeadingStyled, ModalSearchStyled
} from "../../common/DynamicCallFlow.Styles";
import SelectContainer from "../../../../core/SharedComponents/SelectContainer";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  DataGridFilterModalProps, Filter
} from "../../common/DataGrid/Abstract.DataGrid.Filter";
import { CALL_FLOW_NAME } from "../Form/ActionFields";
import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import { DynamicCallFlowActionContext } from "../DynamicCallFlow.Action.Container";

export const FilterLabel: Map<string, string> = new Map<string, string>([
  ["callFlowName", "Call Flow Name"]
]);

//TODO:  This can be moved to a common location as most is the same as PhoneNumberDataGridFilterModal.  Just need to make the SelectContainers dynamic
export const ActionDataGridFilterModal = ({
  isOpen, dataGridFilter
}: DataGridFilterModalProps<ActionRecordType>):JSX.Element => {
  const { modalController } = useContext(DynamicCallFlowActionContext);

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
          <HeadingStyled type="h4-light"> Call Flow Configuration Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={dataGridFilter.current.fieldOptions[CALL_FLOW_NAME] || []}
                name="callFlowName"
                label="Choose Call Flow Name"
                value={filter[CALL_FLOW_NAME] || ""}
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
