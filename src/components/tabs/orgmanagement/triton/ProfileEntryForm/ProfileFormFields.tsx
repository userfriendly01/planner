import React from "react";
import {
  ToggleFormField
} from "./ProfileEntryForm.Interfaces";
import { formModes } from "globals/index";
import { OperatingUnit } from "globals/interfaces";
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
} from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { ProfileCallTagsSelectField } from "orgmanagement/ProfileCallTagsSelectField";
import { ProfileAccessGroupField } from "orgmanagement/ProfileAccessGroupField";
import { ProfileNameTextField } from "orgmanagement/ProfileNameTextField";
import { ProfileActivitiesSelectField } from "orgmanagement/ProfileActivitiesSelectField";
import { ProfileQueuesSelectField } from "orgmanagement/ProfileQueuesSelectField";
import { ProfileOperatingUnitField } from "orgmanagement/ProfileOperatingUnitField";
import { OverflowSkillTextField } from "orgmanagement/OverflowSkillTextField";
import { PhoneNumberInput } from "components/PhoneNumberInput";

export const ProfileFormFields = () => {

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
      fieldKey: "callReason",
      label: "Call Reason"
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
    },
    {
      fieldKey: "eftAuthorization",
      label: "EFT Authorization"
    },
    {
      fieldKey: "claimNumberEdit",
      label: "Claim Number Edit"
    }
  ];

  return (
    <FormControlsContainer>
      <FormControlsPane>
        {
          form.formMode === formModes.INSERT ? "" : <Label>Profile ID: {form.profileId} <br /> Operating Unit: {form.operatingUnit.ou_name}</Label>
        }
        <ProfileNameTextField label="Profile Name *" />

        {
          form.formMode === formModes.INSERT ? <ProfileOperatingUnitField setOperatingUnit={(ou: OperatingUnit) => {
            setForm({
              type: profileEntryFormActions.SET_OPERATING_UINIT,
              payload: ou
            });
          }} /> : ""
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
              <Tooltip key={index} title={"Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level"}>
                <ToggleContainer key={index}>
                  <FormControlLabel
                    label={control.label}
                    labelPlacement="end"
                    control={<Switch
                      inputProps={{ "aria-label": "toggle-zero-out" }}
                      checked={form.profileId && typeof form.profileId === "string" ? (parseInt(form.profileId) >= 39 ? true : false) : (form.profileId >= 39 ? true : false)}
                      disabled={true} />} />
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
        <ToggleContainer key="accessGroup">
          <FormControlLabel
            label="Access Group"
            labelPlacement="end"
            control={<Switch
              inputProps={{ "aria-label": "toggle-zero-out" }}
              checked={form["accessGroup"].value}
              onChange={() => setForm({
                type: profileEntryFormActions.UPDATE_ACCESS_GROUP,
                fieldKey: "accessGroup"
              })} />} />
        </ToggleContainer>
        <ProfileAccessGroupField enableDropDown={form["accessGroup"].value} accessGroupId={form["accessGroupId"]} setAccessGroupId={(accessGroupId: number) => {
          setForm({
            type: profileEntryFormActions.UPDATE_ACCESS_GROUP_ID,
            payload: accessGroupId
          });
        }} />
        <PhoneNumberInput
          allowSevenDigitVdn={false}
          id="forward-to-num"
          number={form["forwardToNum"].value}
          label="Forward To Number"
          showError={form["forwardToNum"].value && !form["forwardToNum"].valid}
          updateValue={(maskedValue: string, _unmaskedValue: string, isValid: boolean, e164Number: string) => {
            setForm({
              type: profileEntryFormActions.UPDATE_FORWARD_TO_NUM,
              payload: {
                maskedValue,
                unmaskedValue: _unmaskedValue,
                isValid,
                e164Number
              }
            });
          }}
        />
      </RightColumn>
    </FormControlsContainer>
  );
};