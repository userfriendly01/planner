import { CustomInput } from "components/core";
import {
  profileEntryFormState,
  profileEntryFormDispatch
} from "context";
import { profileEntryFormActions } from "context/reducers/profileEntryFormReducer";
import React from "react";
import { isProfileNameValid } from "utils";
import { TextFieldProps } from "./ProfileEntryForm.Interfaces";

const ProfileNameTextField = (props: TextFieldProps ) => {
  const {
    label
  } = props;

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  return (
    <CustomInput
      error={ form.profileName.updated && !form.profileName.valid }
      label= {label}
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

export default ProfileNameTextField;