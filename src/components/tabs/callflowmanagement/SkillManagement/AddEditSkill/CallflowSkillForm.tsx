import { Dropdown } from "components/core/CustomDropdown/Dropdown";
import { CustomInput } from "components/core/CustomInput/CustomInput";
import { FormRow } from "callflowmanagement/Skills.Styles";
import {
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import { skillActions } from "context/reducers/skillReducer";
import { FlexColumn } from "globals/interfaces";
import React from "react";
import {
  Application, Day, SkillState,
  TimeOfDay,
  TimeOfDayRequestObject
} from "../Skills.Interfaces";

export const CallflowSkillForm = (props: { missingFields: string[]}) => {
  const { missingFields } = props;

  const skillState: SkillState = useSkillState();
  const skFormDispatch = useSkillDispatch();
  const [ tempField, setTempField ] = React.useState({
    vhThreshold: skillState.skillForm.vhThreshold,
    vhCallTarget: skillState.skillForm.vhCallTarget
  });

  const getTimeOfDayOptions = (timeOfDays: TimeOfDay[]) => {
    return timeOfDays.map(tod => {
      const label = tod.openTime === "00:00:00" && tod.closeTime === "00:00:00" ? "Closed" : `${tod.openTime} - ${tod.closeTime}`;
      return {
        value: tod.timeOfDayId,
        label: label
      };
    });
  };

  const getApplicationOptions = (applications: Application[]) => {
    return applications.map(a => ({
      value: a.applicationId,
      label: a.applicationName
    }));
  };

  const timeOfDayOptions = getTimeOfDayOptions(skillState.timeOfDays);
  const applicationOptions = getApplicationOptions(skillState.applications);

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
          key={`timeOfDay.${day.id}`}
          options={timeOfDayOptions}
          value={timeOfDayOptions.find(tod => tod.value === value.timeOfDayId)}
          label={"Time Of Day *"}
          styles={{ width: "36%" }}
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_TIME_OF_DAYS,
              payload: {
                dayOfWeekId: day.id,
                timeOfDayId: newValue?.value || null
              }
            });
          }}
        />
        <Dropdown
          key={`vhTimeOfDay.${day.id}`}
          options={timeOfDayOptions}
          error={missingFields.some((f: string) => f === `vhTimeOfDay.${day.id}`) &&
          (!skillState.skillForm.timeOfDays.find(tod => tod.dayOfWeekId === day.id)?.vhTimeOfDayId)}
          value={timeOfDayOptions.find(tod => tod.value === value.vhTimeOfDayId)}
          styles={{ width: "36%" }}
          label={"Virtual Hold Time Of Day (Optional)"}
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_TIME_OF_DAYS,
              payload: {
                dayOfWeekId: day.id,
                vhTimeOfDayId: newValue?.value || null
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
          key={"application"}
          options={applicationOptions}
          styles={inputStyles}
          value={applicationOptions.find((ap:any) => ap.value === skillState.skillForm.applicationId) || null}
          label="Application *"
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "applicationId",
                value: newValue?.value
              }
            });
          }}
        />
        <CustomInput
          value={tempField.vhThreshold}
          error={missingFields.some((f: string) => f === "vhThreshold") && !tempField.vhThreshold}
          styles={inputStyles}
          onBlur={() => skFormDispatch({
            type: skillActions.SET_FORM_FIELD,
            payload: {
              key: "vhThreshold",
              value: tempField.vhThreshold
            }
          })
          }
          maxLength="3"
          label="VH Threshold (Optional)"
          name="vhThreshold"
          updateValue={value => {
            setTempField({
              ...tempField,
              vhThreshold: value?.trim()
            });
          }}
        />
        <CustomInput
          key={"vhCallTarget"}
          value={tempField.vhCallTarget}
          error={missingFields.some((f: string) => f === "vhCallTarget") && !tempField.vhCallTarget}
          styles={inputStyles}
          maxLength="9"
          onBlur={() => skFormDispatch({
            type: skillActions.SET_FORM_FIELD,
            payload: {
              key: "vhCallTarget",
              value: tempField.vhCallTarget.trim()
            }
          })}
          label="VH Call Target (Optional)"
          name="vhCallTarget"
          updateValue={value => {
            setTempField({
              ...tempField,
              vhCallTarget: value?.trim()
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