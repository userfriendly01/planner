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

  const tabNames = {
    BASIC_INFO: "Basic Info",
    CALL_RECORDING: "Call Recording",
    DEFAULT_SKILLS: "Default Skills"
  };

  const [activeTab, setActiveTab] = React.useState(tabNames.BASIC_INFO);

  return (
    <FormControlsContainer>
      <AccordionWrapper>
        <StyledAccordion expanded={activeTab === tabNames.BASIC_INFO}>
          <AccordionSummary
            // onClick={() => setActiveTab(tabNames.BASIC_INFO)}
          >{tabNames.BASIC_INFO}</AccordionSummary>
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
        <StyledAccordion expanded={activeTab === tabNames.CALL_RECORDING}>
          <AccordionSummary
            // onClick={() => setActiveTab(tabNames.CALL_RECORDING)}
          >{tabNames.CALL_RECORDING}</AccordionSummary>
          <AccordionDetails>
            <CallRecordingForm twilioWorker={worker} />
          </AccordionDetails>
        </StyledAccordion>
        <StyledAccordion expanded={activeTab === tabNames.DEFAULT_SKILLS}>
          <AccordionSummary
            // onClick={() => setActiveTab(tabNames.DEFAULT_SKILLS)}
          >{tabNames.DEFAULT_SKILLS}</AccordionSummary>
          <AccordionDetails>
            <SkillsFormInfo />
          </AccordionDetails>
        </StyledAccordion>
      </AccordionWrapper>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;