import React from "react";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminState
} from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { ProfileFormButtonsProps } from "./ProfileEntryForm.Interfaces";
import {
  ButtonWrapper,
  FormButton
} from "./ProfileEntryForm.Styles";
import {
  formModes,timeouts
} from "globals";
import {
  ModalOverlayStatuses, ProfilePayload
} from "globals/interfaces";
import { isProfileFormValid } from "utils/profileUtils";
import { logger } from "utils/logger";
import {
  createProfilePayload, updateProfilePayload
} from "utils/profileUtils";
import { wait } from "utils";
import {
  createProfile,
  editProfile
} from "services/profile";

export const ProfileFormButtons = (props: ProfileFormButtonsProps) => {
  const {
    handleClose,
    loading,
    updateLoading
  } = props;

  const state = useAdminState();
  const { nNumber } = state.userContext;
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
      logger.info(`Successfully created profile ${form.profileName.value}`, {
        nNumber,
        profileId: payload?.profile_id
      });

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
      }, timeouts.MODAL_OVERLAY_ATTENTION);
    }).catch(error => {
      logger.error(`Failed to create profile ${form.profileName.value}`, {
        error,
        nNumber,
        profileId: payload?.profile_id
      });

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
      logger.info(`Successfully updated profile ${form.profileName.value}`, {
        nNumber,
        profileId: payload?.profile_id
      });

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
    }).catch(error => {
      logger.error(`Failed to create profile ${form.profileName.value}`, {
        error,
        nNumber,
        profileId: payload?.profile_id
      });

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