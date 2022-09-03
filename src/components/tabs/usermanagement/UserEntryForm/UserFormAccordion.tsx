import * as React from "react";
import { AccordionTab } from "@lmig/lmds-react-accordion";
import { Accordion } from "@mui/material";
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
      <Accordion>
        <AccordionTab active labelVisual="Basic Info">
          <BasicFormInfo
            skills={skills}
            worker={worker}
            workers={workers}
            profiles={profiles}
            managers={managers}
            forwardToToggle={forwardToToggle}
            setForwardToToggle={setForwardToToggle}/>
        </AccordionTab>
        <AccordionTab labelVisual="Call Recording">
          <CallRecordingForm twilioWorker={worker} />
        </AccordionTab>
        <AccordionTab labelVisual="Default Skills">
          <SkillsFormInfo />
        </AccordionTab>
      </Accordion>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;