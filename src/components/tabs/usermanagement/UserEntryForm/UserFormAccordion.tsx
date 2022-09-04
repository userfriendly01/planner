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
import {
  FormControlsContainer,
  StyledAccordion
} from "./UserEntryForm.Styles";
import { UserFormAccordionProps } from "./UserEntryForm.Interfaces";
import styled from "styled-components";

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
        <StyledAccordion expanded={true}>
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
        </StyledAccordion>
        <StyledAccordion>
          <AccordionSummary>Call Recording</AccordionSummary>
          <AccordionDetails>
            <CallRecordingForm twilioWorker={worker} />
          </AccordionDetails>
        </StyledAccordion>
        <StyledAccordion>
          <AccordionSummary>Default Skills</AccordionSummary>
          <AccordionDetails>
            <SkillsFormInfo />
          </AccordionDetails>
        </StyledAccordion>
      </AccordionWrapper>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;