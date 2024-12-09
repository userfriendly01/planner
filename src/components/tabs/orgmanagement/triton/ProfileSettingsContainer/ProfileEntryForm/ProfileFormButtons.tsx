import React from "react";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminDispatch,
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
  AccessGroupPayload, ModalOverlayStatuses, ProfilePayload
} from "globals/interfaces";
import {
  isProfileFormValid, constructProfilePayload
} from "utils/profileUtils";
import { logger } from "utils/logger";
import { wait } from "utils";
import {
  createAccessGroup,
  createProfile,
  editProfile,
  loadSoftphoneConfigRelationships
} from "services/profile";
import { formatErrorMessage } from "utils/_formatUtils";
import { getPaginatedResults } from "utils/graphUtils";
import { LIST_SOFTPHONE_CONFIG } from "globals/graphql/profile";

export const ProfileFormButtons = (props: ProfileFormButtonsProps) => {
  const {
    handleClose,
    loading,
    updateLoading
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const { nNumber } = state.userContext;
  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  const handleOnSave = async () => {
    const isCreate = form.formMode === formModes.INSERT;
    updateLoading({
      ...loading,
      overlayMessage: `${isCreate ? "Creating new" : "Updating"} profile..`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveProfile: true
    });

    const payload: ProfilePayload = constructProfilePayload(form);

    try {
      if(form.accessGroup?.isNew){
        const accessGroupPayload: AccessGroupPayload = {
          access_group_name: form.accessGroup.access_group_name,
          twilio_dashboard_url: form.accessGroup.twilio_dashboard_url
        };
        const accessGroup = await createAccessGroup(accessGroupPayload);
        payload.access_group_id = accessGroup.id;
      }

      if(isCreate){
        await createProfile(payload);
      } else {
        await editProfile(form.profileId, payload);
      }
      logger.info(`Successfully ${isCreate ? "created" : "updated"} profile ${form.profileName}`, {
        nNumber,
        payload
      });

      updateLoading({
        ...loading,
        overlayMessage: `Successfully ${isCreate ? "created" : "updated"} profile ${form.profileName}. ${isCreate ? "Please notify the data office of this change." : ""}`,
        saveStatus: ModalOverlayStatuses.SUCCESS,
        saveProfile: true
      });
      await getPaginatedResults(LIST_SOFTPHONE_CONFIG, dispatch);
      wait(() => {
        loadSoftphoneConfigRelationships(state.profileContext, dispatch);
        updateLoading({
          ...loading,
          saveProfile: false
        });
        handleClose();
        setForm({
          type: profileEntryFormActions.RESET_FORM
        });
      }, timeouts.MODAL_OVERLAY);
    } catch(error){
      logger.error(`Failed to  ${isCreate ? "create" : "update"} profile ${form.profileName}`, {
        error,
        nNumber,
        payload
      });

      updateLoading({
        ...loading,
        overlayMessage: `Error ${isCreate ? "creating" : "updating"} profile ${form.profileName}: ${formatErrorMessage(error)}`,
        saveStatus: ModalOverlayStatuses.FAIL,
        saveProfile: true
      });
      wait(() => {
        updateLoading({
          ...loading,
          saveProfile: false
        });
      }, timeouts.MODAL_OVERLAY);
    }
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
        onClick={handleOnSave}
      >
        {form.formMode === formModes.INSERT ? "Create Profile" : "Update Profile"}
      </FormButton>
    </ButtonWrapper>
  );
};