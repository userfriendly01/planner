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
    console.log("TODO - create profile", form);
    updateLoading({
      ...loading,
      overlayMessage: "Adding new profile...",
      saveStatus: ModalOverlayStatuses.SAVING,
      saveProfile: true
    });
    const payload = {
      profile_id: form.profileId,
      profile_nme: form.profileName.value,
      activity_id: form.activitiesList.map(activity => activity.activity_id),
      recorded_i: form.inboundRecorded,
      auto_answd_i: form.autoAnswered,
      pmt_prcsg_i: form.paymentProcessing,
      otbnd_recorded_i: form.outboundRecorded,
      acw_option_i: form.acwOption,
      manual_recorded_i: form.manualRecorded,
      acw_data_entry_i: form.acwDataEntry,
      manual_record_inbound_i: form.manualRecordedInbound,
      agent_assisted_pay_i: form.agentAssistedPay,
      overflow_skill: form.overflowSkill.value || null,
      policy_number_edit_i: form.policyNumberEdit,
      voice_mail_transcription_i: form.voiceMailTranscription
    };
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