/* eslint-disable react/prop-types */
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  RoutingFilter, RoutingMasterData
} from "../../AlohaRouting.Interfaces";
import {
  ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react";
import {
  RoutingHeadingStyled, RoutingModalSearchStyled
} from "../../AlohaRouting.Styles";
import SelectContainer from "../../../../core/SharedComponents/SelectContainer";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { CACHE_FILTER_ROUTING } from "utils";
import TextField from "@mui/material/TextField";

interface AdvanceSearchModalProps{
  isOpen:boolean;
  handleChange:(event:any)=>void;
  masterData:RoutingMasterData;
  selection: RoutingFilter;
  openModal:(flag:boolean)=>void;
  applyFilter:()=>void;
}
const RoutingAdvanceSearchModal = (props:AdvanceSearchModalProps):JSX.Element => {
  const {
    isOpen, handleChange, masterData, selection, openModal, applyFilter
  } = props;

  const saveFilter = (search:RoutingFilter) => {
    localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(search));
    applyFilter();
  };

  const resetSavedFilter = () => {
    localStorage.removeItem(CACHE_FILTER_ROUTING);
    applyFilter();
  };

  return (
    <div>
      <RoutingModalSearchStyled isOpen={isOpen} onClose={() => openModal(false)}>
        <ModalHeader id="my-search-header">
          <RoutingHeadingStyled type="h4-light"> Advance Routing Search Selection </RoutingHeadingStyled>
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
                isBlankFirstValue = {true}
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
                isBlankFirstValue = {true}
                required = {false}/>
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.callerType}
                name= "callerType"
                label= "Choose Caller Type"
                value= {selection?.callerType}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                isBlankFirstValue = {true}
                required = {false}/>
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.callerState}
                name= "callerState"
                label= "Choose Caller State"
                value= {selection?.callerState}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                isBlankFirstValue = {true}
                required = {false}/>
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.transferDestination}
                name= "transferDestination"
                label= "Choose Transfer Destination"
                value= {selection?.transferDestination}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                isBlankFirstValue = {true}
                required = {false}/>
            </Grid>
            <Grid item xs={10}>
              <SelectContainer
                dropDownOptions = {masterData?.twilioSkill}
                name= "twilioSkill"
                label= "Choose Twilio Skill"
                value= {selection?.twilioSkill}
                onChange= {handleChange}
                disabled= {false}
                error = {false}
                isBlankFirstValue = {true}
                required = {false}/>
            </Grid>
            <Grid item xs={10}>
              <Autocomplete
                id="callIntent-autocomplete"
                options={masterData?.callIntent}
                getOptionLabel={option => option || ""}
                value={selection.callIntent || ""}
                onChange={(event, value) => {
                  const tempEvent = {
                    target: {
                      "name": "callIntent",
                      "value": value
                    }
                  };
                  handleChange(tempEvent);
                }}
                renderInput={params => <TextField {...params} label="callIntent" />}
              />
            </Grid>
          </Grid>
        </ModalBody>
        <ModalFooter>
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
      </RoutingModalSearchStyled>
    </div>
  );
};
export default RoutingAdvanceSearchModal;
