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
import {
  useFormState
} from "context";
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

  const form = useFormState();

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
        {form.formMode === "INSERT" ?
          <AccordionTab labelVisual="Call Recording">
            <CallRecordingForm />
          </AccordionTab> : null
        }
        <AccordionTab labelVisual="Default Skills">
          <SkillsFormInfo />
        </AccordionTab>

      </Accordion>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;