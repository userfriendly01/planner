import { FormControlsPane } from "../../";
import { DefaultSkillSelector } from "components";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import React from "react";

const SkillsFormInfo = () => {

  const form = useFormState();
  const setForm = useFormDispatch();

  return(
    <FormControlsPane>
      <DefaultSkillSelector
        defaultSkills={form.defaultSkills}
        setDefaultSkills={(defaultSkills: any) => {
          setForm({
            type: userFormActions.UPDATE_DEFAULT_SKILLS,
            payload: defaultSkills
          });
        }}
      />
    </FormControlsPane>
  );
};

export default SkillsFormInfo;