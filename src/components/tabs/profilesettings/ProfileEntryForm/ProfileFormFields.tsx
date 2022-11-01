import React from "react";
import {
  ToggleFormField
} from "./ProfileEntryForm.Interfaces";
import { formModes } from "globals";
import {
  FormControlsContainer,
  FormControlsPane,
  ToggleContainer,
  Label,
  RightColumn
} from "./ProfileEntryForm.Styles";
import {
  FormControlLabel,
  Switch
} from "@mui/material";
import {
  profileEntryFormDispatch,
  profileEntryFormState
} from "context";
import { profileEntryFormActions } from "context/reducers/profileEntryFormReducer";
import {
  ProfileNameTextField,
  ProfileActivitiesSelectField,
  OverflowSkillTextField
} from "components";

const ProfileFormFields = () => {

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  const leftToggleControls: ToggleFormField[] = [
    {
      fieldKey: "inboundRecorded",
      label: "Inbound Recorded"
    },
    {
      fieldKey: "paymentProcessing",
      label: "Payment Processing"
    },
    {
      fieldKey: "acwOption",
      label: "ACW Option"
    },
    {
      fieldKey: "acwDataEntry",
      label: "ACW Data Entry"
    },
    {
      fieldKey: "agentAssistedPay",
      label: "Agent Assisted Pay"
    },
    {
      fieldKey: "voiceMailTranscription",
      label: "Voice Mail Transcription"
    }
  ];

  const rightToggleControls: ToggleFormField[] = [
    {
      fieldKey: "autoAnswered",
      label: "Auto Answered"
    },
    {
      fieldKey: "outboundRecorded",
      label: "Outbound Recorded"
    },
    {
      fieldKey: "manualRecorded",
      label: "Manual Recorded"
    },
    {
      fieldKey: "manualRecordedInbound",
      label: "Manual Recorded Inbound"
    },
    {
      fieldKey: "policyNumberEdit",
      label: "Policy Number Edit"
    }
  ];

  return (
    <FormControlsContainer>
      <FormControlsPane>
        {
          form.formMode === formModes.INSERT ? "" :  <Label>Profile ID: { form.profileId }</Label>
        }
        <ProfileNameTextField label="Profile Name *" />
        {
          leftToggleControls.map((control, index) => (
            <ToggleContainer key={index}>
              <FormControlLabel
                label={control.label}
                labelPlacement="end"
                control={<Switch
                  inputProps={{ "aria-label": "toggle-zero-out" }}
                  checked={form[control.fieldKey]}
                  onChange={() => setForm({
                    type: profileEntryFormActions.TOGGLE,
                    fieldKey: control.fieldKey
                  })} />} />
            </ToggleContainer>
          ))
        }
        <OverflowSkillTextField label="Overflow Skill" />
        <ProfileActivitiesSelectField
          activitiesList={form.activitiesList}
          setActivitiesList={activitiesList => {
            setForm({
              type: profileEntryFormActions.UPDATE_ACTIVITIES_LIST,
              payload: activitiesList
            });
          }}
        />
      </FormControlsPane>
      <RightColumn>
        <div style={form.formMode === formModes.INSERT ? { height: "95px" } : { height: "125px" }}></div>
        {
          rightToggleControls.map((control, index) => (
            <ToggleContainer key={index}>
              <FormControlLabel
                label={control.label}
                labelPlacement="end"
                control={<Switch
                  inputProps={{ "aria-label": "toggle-zero-out" }}
                  checked={form[control.fieldKey]}
                  onChange={() => setForm({
                    type: profileEntryFormActions.TOGGLE,
                    fieldKey: control.fieldKey
                  })} />} />
            </ToggleContainer>
          ))
        }
      </RightColumn>
    </FormControlsContainer>
  );
};
export default ProfileFormFields;
