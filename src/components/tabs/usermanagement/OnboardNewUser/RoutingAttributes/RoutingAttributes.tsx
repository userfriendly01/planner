import React, { useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  useFormDispatch,
  userFormActions,
  useFormState
} from "context";
import { Dropdown } from "components";
import { RoutingTeamAttrDropDownOptions,CallerStateAttrDropDownOptions } from "./RoutingAttributesDropDown";

const RoutingAttributes = (): JSX.Element => {
  const setForm = useFormDispatch();
  const form = useFormState();
  const accordianExpansion = form.triton.routing.team ? true : false;
  const [expanded, setExpanded] = useState(accordianExpansion);
  const handleChange = (event: any, value: any, keyName:String) => {
    switch(keyName){
      case "routingTeam":
        setForm({
          type: userFormActions.ADD_ROUTING_TEAM,
          payload: {
            routingTeamName: value ? value.value : null
          }
        });
        break;
      case "callerStates":
        setForm({
          type: userFormActions.ADD_CALLER_STATE,
          payload: {
            callerStateRouting: value ? value: null
          }
        });
        break;
    }
    
  }
  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        width: "395px",
        margin: "8px 0px 5px 0px",
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
          value={form.triton.routing.team}
          options={RoutingTeamAttrDropDownOptions}
          updateValue={(event: any, value: any) => handleChange(event, value, "routingTeam")}
          styles={{
            width: "calc(95%)",
            margin: "0 0 0 0"
          }}
          disabled={false}
          required={false}
        />
      </AccordionDetails>
      <AccordionDetails>
        <Dropdown
          label="Caller State"
          value={form.triton.callerStateAttr.callerStates}
          options={CallerStateAttrDropDownOptions}
          updateValue={(event: any, value: any) => handleChange(event, value, "callerStates")}
          styles={{
            width: "calc(95%)",
            margin: "0 0 0 0"
          }}
          disabled={false}
          required={false}
          multiple = {true}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default RoutingAttributes;