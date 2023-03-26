import React from "react";
import {
  ToggleFormField
} from "./ProfileEntryForm.Interfaces";
import {
  formModes,
  OperatingUnit
} from "globals";
import {
  FormControlsContainer,
  FormControlsPane,
  ToggleContainer,
  Label,
  RightColumn
} from "./ProfileEntryForm.Styles";
import {
  FormControlLabel,
  Switch,
  Tooltip
} from "@mui/material";
import {
  profileEntryFormDispatch,
  profileEntryFormState
} from "context";
import { profileEntryFormActions } from "context/reducers/profileEntryFormReducer";
import {
  ProfileNameTextField,
  ProfileActivitiesSelectField,
  ProfileCallTagsSelectField,
  ProfileQueuesSelectField,
  ProfileOperatingUnitField,
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
    },
    {
      fieldKey: "selfServiceInd",
      label: "Self Service Indicator"
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
    },
    {
      fieldKey: "clickToDial",
      label: "Click To Dial"
    }
  ];

  return (
    <FormControlsContainer>
      <FormControlsPane>
        {
          form.formMode === formModes.INSERT ? "" :  <Label>Profile ID: { form.profileId } <br/> Operating Unit: { form.operatingUnit.ou_name }</Label>
        }
        <ProfileNameTextField label="Profile Name *" />

        {
          form.formMode === formModes.INSERT ? <ProfileOperatingUnitField  setOperatingUnit={(ou: OperatingUnit) => {
            setForm({
              type: profileEntryFormActions.SET_OPERATING_UINIT,
              payload: ou
            });
          } }/> : ""
        }

        {
          leftToggleControls.map((control, index) => (
            control.fieldKey !== "selfServiceInd" ?
              <ToggleContainer key={index}>
                <FormControlLabel
                  label={control.label}
                  labelPlacement="end"
                  control={<Switch
                    inputProps={{ "aria-label": "toggle-zero-out" }}
                    checked={form[control.fieldKey].value}
                    onChange={() => setForm({
                      type: profileEntryFormActions.TOGGLE,
                      fieldKey: control.fieldKey
                    })} />} />
              </ToggleContainer> :
              // TODO: figure out weirdness with KEY !
              // eslint-disable-next-line react/jsx-key 
              <Tooltip title={"Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level"}>
                <ToggleContainer key={index}>
                  <FormControlLabel
                    label={control.label}
                    labelPlacement="end"
                    control={<Switch
                      inputProps={{ "aria-label": "toggle-zero-out" }}
                      checked={form.profileId && typeof form.profileId === "string" ? (parseInt(form.profileId) >= 39 ? true : false) : (form.profileId >= 39 ? true : false)} // TODO check if we need the type conversion
                      disabled />} />
                </ToggleContainer>
              </Tooltip>
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
        <ProfileQueuesSelectField
          transferQueues={form.transferQueues}
          setQueueList={transferQueues => {
            setForm({
              type: profileEntryFormActions.UPDATE_TRANSFER_QUEUES,
              payload: transferQueues
            });
          }}
        />
        {
          form["acwDataEntry"].value === false ? "" :
            <ProfileCallTagsSelectField
              callTagsList={form.callTagsList}
              callTagOptionsList={form.callTagOptions}
              setCallTagsList={callTagsList => {
                setForm({
                  type: profileEntryFormActions.UPDATE_CALL_TAGS_LIST,
                  payload: callTagsList
                });
              }}
            />
        }
      </FormControlsPane>
      <RightColumn>
        <div style={form.formMode === formModes.INSERT ? { height: "159px" } : { height: "149px" }}></div>
        {
          rightToggleControls.map((control, index) => (
            <ToggleContainer key={index}>
              <FormControlLabel
                label={control.label}
                labelPlacement="end"
                control={<Switch
                  inputProps={{ "aria-label": "toggle-zero-out" }}
                  checked={form[control.fieldKey].value}
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
