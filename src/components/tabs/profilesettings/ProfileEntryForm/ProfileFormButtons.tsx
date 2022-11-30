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
  wait
} from "utils";
import {
  createProfile,
  editProfile
} from "services";

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
      overlayMessage: "Adding new profile...",
      saveStatus: ModalOverlayStatuses.SAVING,
      saveProfile: true
    });

    const payload: ProfilePayload = {
      profile_id: form.profileId,
      profile_nme: form.profileName.value,
      activity_id: form.activitiesList.map(activity => activity.activity_id),
      recorded_i: form.inboundRecorded.value,
      auto_answd_i: form.autoAnswered.value,
      pmt_prcsg_i: form.paymentProcessing.value,
      otbnd_recorded_i: form.outboundRecorded.value,
      callTag: form.callTag.value,
      acw_option_i: form.acwOption.value,
      manual_recorded_i: form.manualRecorded.value,
      acw_data_entry_i: form.acwDataEntry.value,
      manual_record_inbound_i: form.manualRecordedInbound.value,
      agent_assisted_pay_i: form.agentAssistedPay.value,
      overflow_skill: form.overflowSkill.value || null,
      policy_number_edit_i: form.policyNumberEdit.value,
      voice_mail_transcription_i: form.voiceMailTranscription.value
    };

    createProfile(payload).then(response => {
      updateLoading({
        ...loading,
        overlayMessage: `Successfully added new profile with ID ${response.data?.profile_id}`,
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
    }).catch(e => {
      updateLoading({
        ...loading,
        overlayMessage: "Error creating new profile",
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
      overlayMessage: `Editing profile ${form.profileId}...`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveProfile: true
    });

    const payload: Partial<ProfilePayload> = {
      profile_id: form.profileId,
    };

    form.profileName.updated ? payload.profile_nme = form.profileName.value : null
    form.overflowSkill.updated ? payload.overflow_skill = form.overflowSkill.value || null : null
    form.activitiesUpdated ? payload.activity_id = form.activitiesList.map(activity => activity.activity_id) : null
    form.inboundRecorded.updated ? payload.recorded_i = form.inboundRecorded.value : null
    form.autoAnswered.updated ? payload.auto_answd_i = form.autoAnswered.value : null
    form.paymentProcessing.updated ? payload.pmt_prcsg_i = form.paymentProcessing.value : null
    form.outboundRecorded.updated ? payload.otbnd_recorded_i = form.outboundRecorded.value : null
    form.callTag.updated ? payload.callTag = form.callTag.value : null
    form.acwOption.updated ? payload.acw_option_i = form.acwOption.value : null
    form.manualRecorded.updated ? payload.manual_recorded_i = form.manualRecorded.value : null
    form.acwDataEntry.updated ? payload.acw_data_entry_i = form.acwDataEntry.value : null
    form.manualRecordedInbound.updated ? payload.manual_record_inbound_i = form.manualRecordedInbound.value : null
    form.agentAssistedPay.updated ? payload.agent_assisted_pay_i = form.agentAssistedPay.value : null
    form.policyNumberEdit.updated ? payload.policy_number_edit_i = form.policyNumberEdit.value : null
    form.voiceMailTranscription.updated ? payload.voice_mail_transcription_i = form.voiceMailTranscription.value : null

    editProfile(payload).then(() => {
      console.log("rz payload=", payload);
      updateLoading({
        ...loading,
        overlayMessage: `Successfully updated profile with ID ${form.profileId}`,
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
    }).catch(e => {
      updateLoading({
        ...loading,
        overlayMessage: `Error updating profile with ID ${form.profileId}`,
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
        {form.formMode === formModes.INSERT ? "Add Profile" : "Save Profile"}
      </FormButton>
    </ButtonWrapper>
  );
};

export default ProfileFormButtons;