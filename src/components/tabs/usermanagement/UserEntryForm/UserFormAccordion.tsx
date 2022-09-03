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

  const AccordionWrapper = styled.div`
    display: flex;
    flex-direction: column;
  `;

  return (
    <FormControlsContainer>
      <AccordionWrapper>
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
          <AccordionSummary>Call Recording</AccordionSummary>
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
      </AccordionWrapper>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;