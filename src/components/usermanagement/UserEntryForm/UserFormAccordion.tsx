import * as React from "react";
import {
  Accordion,
  AccordionTab
} from "@lmig/lmds-react-accordion";
import {
  BasicFormInfo,
  CallRecordingForm,
  SkillsFormInfo
} from "components";
import { FormControlsContainer } from "./UserEntryForm.Styles";
import { UserFormAccordionProps } from "./UserEntryForm.Interfaces";

const UserFormAccordion = (props: UserFormAccordionProps) => {
  const {
    form,
    forwardToToggle,
    managers,
    profiles,
    setForm,
    setForwardToToggle,
    skills,
    worker,
    workers
  } = props;

  return (
    <FormControlsContainer>
      <Accordion as="h4" singleTab>
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
          <CallRecordingForm
            form={form}
            setForm={setForm}
          />
        </AccordionTab>
        <AccordionTab labelVisual="Default Skills">
          <SkillsFormInfo />
        </AccordionTab>
      </Accordion>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;