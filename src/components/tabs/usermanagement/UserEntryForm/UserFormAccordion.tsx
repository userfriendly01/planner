import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  BasicFormInfo,
  CallRecordingForm,
  SkillsFormInfo
} from "components";
import { FormControlsContainer } from "./UserEntryForm.Styles";
import { UserFormAccordionProps } from "./UserEntryForm.Interfaces";

const UserFormAccordion = (props: UserFormAccordionProps) => {
  const {
    forwardToToggle,
    managers,
    profiles,
    setForwardToToggle,
    skills,
    worker,
    workers
  } = props;

  return (
    <FormControlsContainer>
      <Accordion expanded={true}>
        <AccordionSummary>Basic Info</AccordionSummary>
        <AccordionDetails>
          <BasicFormInfo
            skills={skills}
            worker={worker}
            workers={workers}
            profiles={profiles}
            managers={managers}
            forwardToToggle={forwardToToggle}
            setForwardToToggle={setForwardToToggle}/>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>Default Skills</AccordionSummary>
        <AccordionDetails>
          <CallRecordingForm twilioWorker={worker} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>Default Skills</AccordionSummary>
        <AccordionDetails>
          <SkillsFormInfo />
        </AccordionDetails>
      </Accordion>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;