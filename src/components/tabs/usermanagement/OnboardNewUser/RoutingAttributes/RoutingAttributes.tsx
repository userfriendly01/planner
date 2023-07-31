import React, { useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectContainer from "components/core/SharedComponents/SelectContainer";
import {
  useFormDispatch,
  userFormActions,
  useFormState
} from "context";
import { Dropdown } from "components";
import { RoutingAttrDropDownOptions } from "./RoutingAttributesDropDown";
const RoutingAttributes = ():JSX.Element =>{

  const setForm = useFormDispatch();
  const form = useFormState();
  const handleChange=(event:any,value:any)=>{
    setForm({
      type: userFormActions.ADD_ROUTING_TEAM,
      payload:{
        routingTeamName: value?.value
      }
    });
  }
  return (
    <Accordion sx={{
      width: "395px",
      margin: "8px 0px 5px 0px"
    }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >Routing Attributes
      </AccordionSummary>
      <AccordionDetails>
      <Dropdown
          label={"Routing Team"}
          value={form.routing.team}
          options={RoutingAttrDropDownOptions}
          updateValue= {(event: any, value: any) =>handleChange(event,value)}
          styles={{
            width: "calc(95%)",
            margin: "0 0 0 0"
          }}
          disabled={false}
          required={false}
        />
      </AccordionDetails>
    </Accordion>
  ); };

export default RoutingAttributes;