import {
  FormControlLabel, Switch
} from "@mui/material";
import { Dropdown } from "components/core/CustomDropdown/Dropdown";
import { CustomInput } from "components/core/CustomInput/CustomInput";
import { PhoneNumberInput } from "components/core/PhoneNumberInput/PhoneNumberInput";
import { FormRow } from "callflowmanagement/Skills.Styles";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import {
  skillActions,
  initialSkillState
} from "context/reducers/skillReducer";
import {
  FlexRow, FlexColumn
} from "globals/interfaces";
import React from "react";
import {
  Application, Day, DayOfWeek, SkillState,
  TimeOfDay,
  TimeOfDayRequestObject
} from "../Skills.Interfaces";
import { dayOfWeek } from "utils/alohaRoutingUtils";

export const CallflowSkillForm = () => {

  const skillState: SkillState = useSkillState();
  const skFormDispatch = useSkillDispatch();

  const getTimeOfDayOptions = (timeOfDays: TimeOfDay[]) => {
    return timeOfDays.map(tod => ({
      value: tod.timeOfDayId,
      label: `${tod.openTime} - ${tod.closeTime}`
    }));
  };

  const getApplicationOptions = (applications: Application[]) => {
    return applications.map(a => ({
      value: a.applicationId,
      label: a.applicationName
    }));
  };

  const timeOfDayOptions = getTimeOfDayOptions(skillState.timeOfDays);
  const applicationOptions = getApplicationOptions(skillState.applications);

  const invalidVhThreshold = skillState.skillForm.vhThreshold.trim() !== "" && isNaN(parseInt(skillState.skillForm.vhThreshold));

  const inputStyles = {
    width: "230px",
    margin: "5px",
    flexGrow: "none"
  };

  const TimeOfDayDropdowns = (props: { day: Day }) => {
    const { day } = props;
    const value: Partial<TimeOfDayRequestObject> = skillState.skillForm.timeOfDays.find(tod => tod.dayOfWeekId === day.id) || {};

    return (
      <FormRow>
        <div style={{ width: "10%" }}>{day.label}</div>
        <Dropdown
          options={timeOfDayOptions}
          value={timeOfDayOptions.find(tod => tod.value === value.timeOfDayId)}
          label={"Time Of Day"}
          styles={{ width: "36%" }}
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_TIME_OF_DAYS,
              payload: {
                dayOfWeekId: day.id,
                timeOfDayId: newValue.value
              }
            });
          }}
        />
        <Dropdown
          options={timeOfDayOptions}
          value={timeOfDayOptions.find(tod => tod.value === value.vhTimeOfDayId)}
          styles={{ width: "36%" }}
          label={"Virtual Hold Time Of Day (Optional)"}
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_TIME_OF_DAYS,
              payload: {
                dayOfWeekId: day.id,
                vhTimeOfDayId: newValue.value
              }
            });
          }}
        />
      </FormRow>
    ); };
  return (
    <>
      <FormRow>
        <Dropdown
          options={applicationOptions}
          styles={inputStyles}
          value={applicationOptions.find((ap:any) => ap.value === skillState.skillForm.applicationId) || null}
          label="Application"
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "applicationId",
                value: newValue.value
              }
            });
          }}
        />
        <PhoneNumberInput
          id="VH Caller Id"
          label="VH Caller Id (Optional)"
          style={inputStyles}
          number={skillState.skillForm.vhCallerId.value}
          showError={skillState.skillForm.vhCallerId.blurred && !skillState.skillForm.vhCallerId.valid}
          onBlur={() => skFormDispatch({
            type: skillActions.SET_FORM_FIELD,
            payload: {
              key: "vhCallerId",
              value: {
                ...skillState.skillForm.vhCallerId,
                blurred: true
              }
            }
          })}
          updateValue={(maskedValue: string, unmaskedValue: string, isValid: boolean, e164Number: string) => {
            skFormDispatch({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "vhCallerId",
                value: {
                  ...skillState.skillForm.vhCallerId,
                  value: unmaskedValue,
                  valid: isValid,
                  e164: e164Number
                }
              }
            });
          }}
        />
        <CustomInput
          value={skillState.skillForm.vhThreshold}
          error={invalidVhThreshold}
          styles={inputStyles}
          maxLength="3"
          label="VH Threshold (Optional)"
          name="vhThreshold"
          updateValue={value => {
            skFormDispatch({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "vhThreshold",
                value: value.trim()
              }
            });
          }}
        />
        <CustomInput
          value={skillState.skillForm.vhCallTarget}
          styles={inputStyles}
          maxLength="9"
          label="VH Call Target (Optional)"
          name="vhCallTarget"
          updateValue={value => {
            skFormDispatch({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "vhCallTarget",
                value: value.trim()
              }
            });
          }}
        />
      </FormRow>
      <FlexColumn style={{ overflow: "scroll" }}>
        {Object.values(skillState.daysOfWeek).map(dow => ((
          <TimeOfDayDropdowns key={dow.id} day={dow} />
        )))
        }
      </FlexColumn>
    </>
  );
};