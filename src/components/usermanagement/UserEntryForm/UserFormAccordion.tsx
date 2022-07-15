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
import { UserFormAccordianProps } from "./UserEntryForm.Interfaces";
import { formModes } from "globals";

const UserFormAccordion = (props: UserFormAccordianProps) => {
  const {
    form,
    skills,
    worker,
    workers,
    profiles,
    managers,
    forwardToToggle,
    setForwardToToggle
  } = props;

  const [ active, setActive ] = React.useState(true);

  return (
    <FormControlsContainer>
      <Accordion as="h4" singleTab>
        <AccordionTab active={active} labelVisual="Basic Info">
          <BasicFormInfo
            skills={skills}
            worker={worker}
            workers={workers}
            profiles={profiles}
            managers={managers}
            forwardToToggle={forwardToToggle}
            setForwardToToggle={setForwardToToggle}/>
        </AccordionTab>
        {form.formMode === formModes.INSERT ?
          <AccordionTab active={!active}labelVisual="Call Recording">
            <CallRecordingForm />
          </AccordionTab> : null
        }
        <AccordionTab active={!active}labelVisual="Default Skills">
          <SkillsFormInfo />
        </AccordionTab>
      </Accordion>
    </FormControlsContainer>
  );
};

export default UserFormAccordion;