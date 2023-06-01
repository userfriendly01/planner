import React from "react";
import {
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const RoutingAttributes = ():JSX.Element =>{
  return (
    <Accordion sx={{
      width: "384px",
      margin: "8px 0px 5px 0px"
    }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >Routing Attributes
      </AccordionSummary>
      <AccordionDetails>
           Upcoming Routing Attributes
      </AccordionDetails>
    </Accordion>
  ); };

export default RoutingAttributes;