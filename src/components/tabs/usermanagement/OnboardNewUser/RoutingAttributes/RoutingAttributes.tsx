import React, { useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectContainer from "components/core/SharedComponents/SelectContainer";
const RoutingAttributes = ():JSX.Element =>{
  const [routingTeam,setRoutingTeam] = useState(null);
  const routingTeamList = ["sample1", "sample2"];
  const handleChange=(event:any)=>{
    setRoutingTeam(event.target.value);
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
          value={routingTeam}
          onChange={handleChange}
          dropDownOptions={routingTeamList}
          required = {false}
          isBlankFirstValue={true}
        />
      </AccordionDetails>
      <AccordionDetails>
           Upcoming Routing Attributes
      </AccordionDetails>
    </Accordion>
  ); };

export default RoutingAttributes;