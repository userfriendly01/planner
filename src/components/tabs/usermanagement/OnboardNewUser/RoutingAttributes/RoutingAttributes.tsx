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
const RoutingAttributes = ():JSX.Element =>{

  const setForm = useFormDispatch();
  const form = useFormState();
  const dropDownOptions :string[]= ["Sample1","Sample2"];
  const handleChange=(event:any)=>{
    setForm({
      type: userFormActions.ROUTING_TEAM,
      payload:{
        routingTeamName: event.target.value
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
      <SelectContainer
          name= {"Routing Team"}
          label={"Routing Team"}
          value= {form?.routing?.team}
          onChange={handleChange}
          dropDownOptions={dropDownOptions}
          required = {false}
          isBlankFirstValue={false}
        />
      </AccordionDetails>
      <AccordionDetails>
           Upcoming Routing Attributes
      </AccordionDetails>
    </Accordion>
  ); };

export default RoutingAttributes;