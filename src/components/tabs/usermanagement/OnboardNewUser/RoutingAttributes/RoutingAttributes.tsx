import React, { useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  useFormDispatch, useFormState
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import { Dropdown } from "components/Dropdown";
import {
  RoutingTeamAttrDropDownOptions,
  CallerStateAttrDropDownOptions
} from "usermanagement/RoutingAttributesDropDown";
import AutoCompleteContainer from "components/AutoCompleteContainer";

export const RoutingAttributes = (): JSX.Element => {
  const setForm = useFormDispatch();
  const form = useFormState();
  const accordianExpansion= ()=>{
    if(form.triton.routing.team || form.triton.routing?.caller_states?.length>0 || form.triton.routing?.sales_assoc_workers?.length>0 || form.triton.routing?.backup_workers?.length>0){
      return true;
    }
    return false;
  };
  const [expanded, setExpanded] = useState(accordianExpansion);
  const getlabelValuePair=(key:string)=>{
    let RoutingAttrList:string[] = [];
    if(key === "caller_states"){
      RoutingAttrList = form.triton.routing?.caller_states || [];
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
      case "caller_states": {
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
          value={getlabelValuePair("caller_states")}
          options={CallerStateAttrDropDownOptions}
          updateValue={(event: any, value: any) => handleChange(event, value, "caller_states")}
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
        <AutoCompleteContainer type={userFormActions.SET_SALES_ASSOCIATE_WORKER} field='sales_assoc_workers' label='Sales Associate Worker' routingAttribute='salesAssociateWorkerRouting'/>
      </AccordionDetails>
      <AccordionDetails>
        <AutoCompleteContainer type={userFormActions.SET_BACK_UP_WORKER} field='backup_workers' label='Backup Workers' routingAttribute='backupWorkerRouting'   />
      </AccordionDetails>
    </Accordion>
  );
};