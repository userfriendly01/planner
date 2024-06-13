import React from "react";
import {
  useAdminState
} from "context/appContext";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export const WfmErrorBanner = () => {

  const state = useAdminState();

  return (
    <>
      { state.calabrioContext.wfmErrors.length > 0 ?
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
          >
            Some teams failed to load into the table. Expand to see details...
          </AccordionSummary>
          <AccordionDetails>
            We are working with Calabrio for a a better solution to gather this data without failures. The following errors occured:
            { state.calabrioContext.wfmErrors.map((e: any) => (
              <div>
                {e.message}
              </div>
            ))
            }
          </AccordionDetails>
        </Accordion>
        : null
      }
    </>
  );
};