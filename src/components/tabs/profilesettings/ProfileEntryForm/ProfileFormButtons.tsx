import React from "react";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  profileEntryFormActions
} from "context";
import { ProfileFormButtonsProps } from "./ProfileEntryForm.Interfaces";
import {
  ButtonWrapper,
  FormButton
} from "./ProfileEntryForm.Styles";
import {
  formModes,
  ModalOverlayStatuses,
  timeouts
} from "globals";
import {
  isProfileFormValid,
  wait
} from "utils";

const ProfileFormButtons = (props: ProfileFormButtonsProps) => {
  const {
    handleClose,
    loading,
    updateLoading,
    profile
  } = props;

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  const isProfileFormButtonEnabled = isProfileFormValid(form);

  const doCreateProfile = () => {
    console.log("TODO - create profile");
    updateLoading({
      ...loading,
      overlayMessage: "Adding new profile...",
      saveStatus: ModalOverlayStatuses.SAVING,
      saveProfile: true
    });
    const payload = {
      ...form,
      activitiesList: form.activitiesList.map(activity => activity.activity_id),
      profileName: form.profileName.value,
      overflowSkill: form.overflowSkill.value
    };
    delete payload["formMode"];
    console.log(payload);

    /// TODO - call actual method to create profile
    wait(() => {

      updateLoading({
        ...loading,
        overlayMessage: "Successfully added new profile",
        saveStatus: ModalOverlayStatuses.SUCCESS,
        saveProfile: true
      });
      wait(() => {
        updateLoading({
          ...loading,
          saveProfile: false
        });
        handleClose();
        setForm({
          type: profileEntryFormActions.RESET_FORM
        });
      }, timeouts.MODAL_OVERLAY);

    }, 3000);
  };

  const doUpdateProfile = () => {
    console.log("TODO - update profile");
  };

  return (
    <ButtonWrapper>
      <FormButton onClick={() => {
        handleClose();
        setForm({
          type: profileEntryFormActions.RESET_FORM
        });
      }}>
        Close
      </FormButton>
      <FormButton
        disabled={!isProfileFormButtonEnabled}
        onClick={form.formMode === formModes.INSERT ? doCreateProfile : doUpdateProfile}
      >
        {form.formMode === formModes.INSERT ? "Add Profile" : "Save Profile"}
      </FormButton>
    </ButtonWrapper>
  );
};

export default ProfileFormButtons;