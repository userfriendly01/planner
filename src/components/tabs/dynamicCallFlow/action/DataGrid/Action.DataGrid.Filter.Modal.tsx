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
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  DataGridFilterModalProps, Filter
} from "../../common/DataGrid/Abstract.DataGrid.Filter";
import {
  ACTION_ID, ACTION_TYPE
} from "../Form/ActionFields";
import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import { DynamicCallFlowActionContext } from "../DynamicCallFlow.Action.Container";

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
  };

  const handleChange = (event: any) => {
    setFilter(dataGridFilter.current.addFilterElement(event.target.name, event.target.value));
  };

  const resetFilterAndClose = () => {
    setFilter(dataGridFilter.current.resetFilter());
  };

  const handleOnClose = () => {
    modalController.current.closeModal();
  };

  return (
    <div>
      <ModalSearchStyled isOpen={isOpen} onClose={handleOnClose}>
        <ModalHeader id="my-search-header">
          <HeadingStyled type="h4-light"> Advance Flow Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={dataGridFilter.current.fieldOptions[ACTION_TYPE] || []}
                name="brand"
                label="Choose Brand"
                value={filter[ACTION_TYPE] || ""}
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
                name="actionId"
                type="text"
                value={filter[ACTION_ID] || ""}
                onChange={handleChange}
                sx={{ width: "Calc(96%)" }}
              />
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
