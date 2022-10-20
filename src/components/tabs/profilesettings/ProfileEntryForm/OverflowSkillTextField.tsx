import { CustomInput } from "components";
import {
  profileEntryFormState,
  profileEntryFormDispatch
} from "context";
import { profileEntryFormActions } from "context/reducers/profileEntryFormReducer";
import React from "react";
import { isOverflowSkillValid } from "utils";
import { TextFieldProps } from "./ProfileEntryForm.Interfaces";

const OverflowSkillTextField = (props: TextFieldProps) => {
  const {
    label
  } = props;

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  return (
    <CustomInput
      error={ form.overflowSkill.updated && !form.overflowSkill.valid }
      label= {label}
      name={label}
      maxLength="80"
      updateValue={overflowSkill => {
        setForm({
          type: profileEntryFormActions.SET_OVERFLOW_SKILL,
          payload: {
            value: overflowSkill,
            valid: isOverflowSkillValid(overflowSkill),
            updated: true
          }
        });
      }}
      value={form.overflowSkill.value}
    />
  );
};

export default OverflowSkillTextField;