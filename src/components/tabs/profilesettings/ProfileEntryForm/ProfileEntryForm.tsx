import React, { useState } from "react";
import { formModes } from "globals";
import {
  ProfileEntryFormProps,
  LoadingState
} from "./ProfileEntryForm.Interfaces";
import {
  ModalContainer,
  Header1
} from "./ProfileEntryForm.Styles";
import {
  ModalOverlay,
  ProfileFormButtons,
  ProfileFormFields
} from "components";
import { profileEntryFormState } from "context";

const ProfileEntryForm = (props: ProfileEntryFormProps) => {
  const {
    handleClose,
    profile
  } = props;

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
      <Header1>{form.formMode === formModes.INSERT ? "Add a Profile" : "Edit Profile"}</Header1>
      <ProfileFormFields
        profile={profile}
      />
      <ProfileFormButtons
        handleClose={handleClose}
        loading={loading}
        updateLoading={updateLoading}
        profile={profile}
      />
    </ModalContainer>
  );
};

export default ProfileEntryForm;