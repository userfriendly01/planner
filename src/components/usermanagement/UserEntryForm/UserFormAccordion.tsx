import * as React from "react";
import {
  Accordion,
  AccordionTab
} from "@lmig/lmds-react-accordion";
import {
  BasicFormInfo,
  SkillsFormInfo
} from "components";
import { FormControlsContainer } from "./UserEntryForm.Styles";
import { UserFormAccordianProps } from "./UserEntryForm.Interfaces";

const UserFormAccordion = (props: UserFormAccordianProps) => {
  const {
    skills,
    worker,
    workers,
    profiles,
    managers,
    forwardToToggle,
    setForwardToToggle
  } = props;

  return (
    <FormControlsContainer>
      <Accordion as="h4">
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
        <AccordionTab labelVisual="Skills">
          <SkillsFormInfo />
        </AccordionTab>
        <AccordionTab labelVisual="Call Recording">
          TBD
        </AccordionTab>
      </Accordion>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;