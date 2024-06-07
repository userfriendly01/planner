import React, { useState } from "react";
import { formModes } from "globals/index";
import {
  ProfileEntryFormProps,
  LoadingState
} from "./ProfileEntryForm.Interfaces";
import {
  ModalContainer,
  Header1
} from "./ProfileEntryForm.Styles";
import { ModalOverlay } from "components/ModalOverlay";
import { ProfileFormButtons } from "orgmanagement/ProfileFormButtons";
import { ProfileFormFields } from "orgmanagement/ProfileFormFields";
import { profileEntryFormState } from "context/appContext";

export const ProfileEntryForm = (props: ProfileEntryFormProps) => {
  const { handleClose } = props;

  const form = profileEntryFormState();

  const [loading, updateLoading] = useState<LoadingState>({
    lookupProfile: false,
    overlayMessage: "",
    saveStatus: null,
    saveProfile: false
  });

  return (
    <ModalContainer>
      {loading.saveProfile ?
        <ModalOverlay
          status={loading.saveStatus}
          message={loading.overlayMessage}
          handleClose={() => {
            updateLoading({
              ...loading,
              saveProfile: false
            });
          }}
        /> : null}
      <Header1>{form.formMode === formModes.INSERT ? "Create Profile" : "Update Profile"}</Header1>
      <ProfileFormFields />
      <ProfileFormButtons
        handleClose={handleClose}
        loading={loading}
        updateLoading={updateLoading}
      />
    </ModalContainer>
  );
};