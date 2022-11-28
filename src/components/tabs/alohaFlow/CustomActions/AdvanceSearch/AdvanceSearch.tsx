/* eslint-disable react/prop-types */
import React from "react";
import {
  ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  HeadingStyled, ModalSearchStyled
} from "../../AlohaFlow.Styles";
import SelectContainer from "../../../../core/SharedComponents/SelectContainer";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { CACHE_FILTER_FLOW } from "utils";
import {
  FlowAdvanceFilter, FlowMasterData
} from "../../AlohaFlow.Interfaces";
interface AdvanceSearchModalProps {
  isOpen: boolean;
  onClose: (flag: boolean) => boolean;
  handleChange: (event: any) => void;
  masterData: FlowMasterData;
  selection: FlowAdvanceFilter;
  openModal: (flag: boolean, search: FlowAdvanceFilter) => void;
  applyFilter: () => void;
}

export const AdvanceSearchModal = ({
  isOpen, onClose, handleChange, masterData, selection, openModal, applyFilter
}:AdvanceSearchModalProps):JSX.Element => {

  const saveFilter = (search: FlowAdvanceFilter) => {
    localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(search));
    applyFilter();
    openModal(false, search);
  };

  const resetSavedFilter = () => {
    localStorage.removeItem(CACHE_FILTER_FLOW);
    applyFilter();
    openModal(false, null);
  };

  return (
    <div>
      <ModalSearchStyled isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalHeader id="my-search-header">
          <HeadingStyled type="h4-light"> Advance Flow Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={masterData?.brand}
                name="brand"
                label="Choose Brand"
                value={selection?.brand}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={masterData?.channel}
                name="channel"
                label="Choose Channel"
                value={selection?.channel}
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
                value={selection?.pkey}
                onChange={handleChange}
                sx={{ width: "Calc(96%)" }}
              />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={masterData?.callFlowTemplate}
                name="callFlowTemplate"
                label="Choose Call Flow Template"
                value={selection.callFlowTemplate}
                onChange={handleChange}
                disabled={false}
                error={false}
                isBlankFirstValue={true}
                required={false} />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions={masterData?.callFlowRoute}
                name="callFlowRoute"
                label="Choose Call Flow Route"
                value={selection.callFlowRoute}
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
            onClick={() => saveFilter(selection)}
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
