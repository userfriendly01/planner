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

const CACHE_FILTER_FLOW = "SEARCH_FILTER_FLOW";

interface AdvanceSearchModalProps{
  isOpen:boolean,
  onClose:(flag:boolean)=>boolean,
  handleChange:(event:any)=>void,
  masterData:any,
  selection: any,
  openModal:(flag:boolean, search:any)=>void,
  applyFilter:()=>void
}
const AdvanceSearchModal = ({isOpen, onClose, handleChange, masterData = [], selection, openModal, applyFilter}:AdvanceSearchModalProps) => {
  const saveFilter = (search: any) => {
    localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(search));
    applyFilter();
    openModal(false, search);
  };

  const resetSavedFilter = () => {
    localStorage.removeItem(CACHE_FILTER_FLOW);
    applyFilter();
    openModal(false, null);
  };

  if (masterData.length === 0) {
    return null;
  }

  return (
    <div>
      <ModalSearchStyled isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalHeader id="my-search-header">
          <HeadingStyled type="h4-light"> Advance Search Selection </HeadingStyled>
        </ModalHeader>
        <ModalBody>
          <Grid container rowSpacing={3}>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.brand}
                name= "brand"
                label= "Choose Brand"
                value= {selection?.brand}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                required = {false}/>
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.channel}
                name= "channel"
                label= "Choose Channel"
                value= {selection?.channel}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                required = {false}/>
            </Grid>
            <Grid item xs={8}>
              <TextField
                variant="outlined"
                label= "#Dialed"
                name="pkey"
                type="text"
                value={selection?.pkey}
                onChange={handleChange}
                sx={{ width: "Calc(100%)" }}
              />
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.callFlowTemplate}
                name= "callFlowTemplate"
                label= "Choose Call Flow Template"
                value= {selection.callFlowTemplate}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                required = {false}/>
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.callFlowRoute}
                name= "callFlowRoute"
                label= "Choose Call Flow Route"
                value= {selection.callFlowRoute}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                required = {false}/>
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
export default AdvanceSearchModal;
