import React from "react";
import {
  FormControlsContainer,
  FormControlsPane
} from "./UserEntryFormStyles";
import { DefaultSkillSelector } from "components";
import { userFormActions } from "context";
import { SkillsFormProps } from "globals";

const SkillsFormInfo = (props: SkillsFormProps) => {

  const {
    form,
    setForm
  } = props;

  return(
    <FormControlsContainer>
      <FormControlsPane>
        <DefaultSkillSelector
          defaultSkills={form.defaultSkills}
          setDefaultSkills={defaultSkills => {
            setForm({
              type: userFormActions.UPDATE_DEFAULT_SKILLS,
              payload: defaultSkills
            });
          }}
        />
      </FormControlsPane>
    </FormControlsContainer>
  );
};

export default SkillsFormInfo;