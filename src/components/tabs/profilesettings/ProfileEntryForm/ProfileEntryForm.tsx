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
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminState
} from "context";
import { profileEntryFormActions } from "context/reducers/profileEntryFormReducer";

const ProfileEntryForm = (props: ProfileEntryFormProps) => {
  const {
    handleClose,
    profile
  } = props;

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();
  const profileId = useAdminState().profileContext.profiles.length || 1;

  React.useEffect(() => {
    setForm({
      type: profileEntryFormActions.SET_PROFILE_ID,
      payload: profileId
    });
  }, []);

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