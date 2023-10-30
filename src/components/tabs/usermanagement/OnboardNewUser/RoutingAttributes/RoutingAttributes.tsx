import React, { useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails, Autocomplete, Chip, TextField
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  useFormDispatch,
  userFormActions,
  useFormState
} from "context";
import { Dropdown } from "components";
import {
  RoutingTeamAttrDropDownOptions,
  CallerStateAttrDropDownOptions
} from "./RoutingAttributesDropDown";
import AutoCompleteContainer from "../../../../core/SharedComponents/AutoCompleteContainer";

const RoutingAttributes = (): JSX.Element => {
  const setForm = useFormDispatch();
  const form = useFormState();
  const accordianExpansion= ()=>{
    if(form.triton.routing.team || form.triton.routing?.callerStates?.length>0 || form.triton.routing?.sales_assoc_workers?.length>0){
      return true;
    }
    return false;
  };
  const [expanded, setExpanded] = useState(accordianExpansion);
  const getlabelValuePair=(key:string)=>{
    let RoutingAttrList:string[] = [];
    if(key === "callerStates"){
      RoutingAttrList = form.triton.routing?.callerStates || [];
    }
    return RoutingAttrList.map((routingAttr:string) => {
      return {
        label: routingAttr,
        value: routingAttr
      };
    });
  };
  const handleChange = (event: any, value: any, keyName:string) => {
    switch(keyName){
      case "routingTeam":
        setForm({
          type: userFormActions.ADD_ROUTING_TEAM,
          payload: {
            routingTeamName: value ? value.value : null
          }
        });
        break;
      case "callerStates": {
        const callerStatesArray:string[] =[];
        for(let i=0; i<value?.length; i++){
          callerStatesArray.push(value[i].value);
        }
        setForm({
          type: userFormActions.SET_CALLER_STATES,
          payload: {
            callerStateRouting: callerStatesArray
          }
        });
        break;
      }
      default:
        break;
    }

  };
  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        width: "395px",
        margin: "8px 0px 5px 0px"
      }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
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
          value={getlabelValuePair("callerStates")}
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
      <AccordionDetails>
        <AutoCompleteContainer />
      </AccordionDetails>
    </Accordion>
  );
};

export default RoutingAttributes;