import * as React from "react";
import {
  Accordion,
  AccordionTab
} from "@lmig/lmds-react-accordion";
import {
  BasicFormInfo,
  SkillsFormInfo
} from "components";
import {
  FormControlsContainer,
  FormControlsPane
} from "./UserEntryFormStyles";

interface AccordionProps {
  skills: any,
  worker: any,
  workers: any,
  profiles: any,
  managers: any,
  forwardToToggle: boolean,
  setForwardToToggle: any
}

const UserFormAccordion = (props: AccordionProps) => {
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
      <Accordion as="h4" singleTab={true}>
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