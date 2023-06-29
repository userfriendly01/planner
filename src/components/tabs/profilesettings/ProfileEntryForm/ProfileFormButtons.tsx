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
  ProfilePayload,
  timeouts
} from "globals";
import {
  isProfileFormValid,
  createProfilePayload,
  updateProfilePayload,
  formatCallTagsName,
  wait
} from "utils";
import {
  createProfile,
  editProfile
} from "services";

const createProfileOverlayTimeout = 5000; //5000 ms for 5 second

const ProfileFormButtons = (props: ProfileFormButtonsProps) => {
  const {
    handleClose,
    loading,
    updateLoading
  } = props;

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  const doCreateProfile = () => {
    updateLoading({
      ...loading,
      overlayMessage: "Creating new profile...",
      saveStatus: ModalOverlayStatuses.SAVING,
      saveProfile: true
    });

    const payload: ProfilePayload = createProfilePayload(form);

    createProfile(payload).then(() => {
      updateLoading({
        ...loading,
        overlayMessage: `Successfully created profile ${form.profileName.value}. Please notify the data office of this change.`,
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
      }, createProfileOverlayTimeout);
    }).catch(() => {
      updateLoading({
        ...loading,
        overlayMessage: `Error creating ${form.profileName.value}`,
        saveStatus: ModalOverlayStatuses.FAIL,
        saveProfile: true
      });
      wait(() => {
        updateLoading({
          ...loading,
          saveProfile: false
        });
      }, timeouts.MODAL_OVERLAY);
    });
  };

  const doUpdateProfile = () => {
    updateLoading({
      ...loading,
      overlayMessage: `Updating ${form.profileName.value}...`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveProfile: true
    });

    const payload: Partial<ProfilePayload> = updateProfilePayload(form);

    editProfile(payload).then(() => {
      updateLoading({
        ...loading,
        overlayMessage: `Successfully updated ${form.profileName.value}`,
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
    }).catch(() => {
      updateLoading({
        ...loading,
        overlayMessage: `Error updating ${form.profileName.value}`,
        saveStatus: ModalOverlayStatuses.FAIL,
        saveProfile: true
      });
      wait(() => {
        updateLoading({
          ...loading,
          saveProfile: false
        });
      }, timeouts.MODAL_OVERLAY);
    });
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
        disabled={!isProfileFormValid(form)}
        onClick={form.formMode === formModes.INSERT ? doCreateProfile : doUpdateProfile}
      >
        {form.formMode === formModes.INSERT ? "Create Profile" : "Update Profile"}
      </FormButton>
    </ButtonWrapper>
  );
};

export default ProfileFormButtons;