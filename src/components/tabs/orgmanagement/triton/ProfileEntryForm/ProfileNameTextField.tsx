import { CustomInput } from "components/CustomInput";
import {
  profileEntryFormState,
  profileEntryFormDispatch
} from "context/appContext";
import { profileEntryFormActions } from "context/reducers/profileEntryFormReducer";
import React from "react";
import { isProfileNameValid } from "utils/profileUtils";
import { TextFieldProps } from "./ProfileEntryForm.Interfaces";

export const ProfileNameTextField = (props: TextFieldProps) => {
  const {
    label
  } = props;

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  return (
    <CustomInput
      error={form.profileName.updated && !form.profileName.valid}
      label={label}
      name={label}
      maxLength="80"
      updateValue={profileName => {
        setForm({
          type: profileEntryFormActions.SET_PROFILE_NAME,
          payload: {
            value: profileName,
            valid: isProfileNameValid(profileName),
            updated: true
          }
        });
      }}
      value={form.profileName.value}
    />
  );
};