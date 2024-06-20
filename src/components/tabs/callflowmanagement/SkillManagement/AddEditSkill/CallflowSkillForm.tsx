import { Dropdown } from "components/core/CustomDropdown/Dropdown";
import { CustomInput } from "components/core/CustomInput/CustomInput";
import { PhoneNumberInput } from "components/core/PhoneNumberInput/PhoneNumberInput";
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

export const CallflowSkillForm = () => {

  const skillState: SkillState = useSkillState();
  const skFormDispatch = useSkillDispatch();
  const [ tempField, setTempField ] = React.useState<{
    vhCallerId: any,
    vhThreshold: string,
    vhCallTarget: string
  }>({
    vhCallerId: {
      valid: false,
      blurred: false,
      ...skillState.skillForm.vhCallerId
    },
    vhThreshold: skillState.skillForm.vhThreshold,
    vhCallTarget: skillState.skillForm.vhCallTarget
  });

  console.warn("TEMP FIELDS", tempField);

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
          number={tempField.vhCallerId.value}
          showError={tempField.vhCallerId.blurred && !tempField.vhCallerId.valid}
          onBlur={() => {
            if(tempField.vhCallerId.valid){
              skFormDispatch({
                type: skillActions.SET_FORM_FIELD,
                payload: {
                  key: "vhCallerId",
                  value: {
                    value: tempField.vhCallerId.value,
                    e164: tempField.vhCallerId.e164
                  }
                }
              });
            } else {
              setTempField({
                ...tempField,
                vhCallerId: {
                  ...tempField.vhCallerId,
                  blurred: tempField.vhCallerId.value.trim() === "" ? false : true
                }
              });
              skFormDispatch({
                type: skillActions.SET_FORM_FIELD,
                payload: {
                  key: "vhCallerId",
                  value: {
                    value: "",
                    e164: ""
                  }
                }
              });
            }
          }}
          updateValue={(maskedValue: string, unmaskedValue: string, isValid: boolean, e164Number: string) => {
            setTempField({
              ...tempField,
              vhCallerId: {
                ...tempField.vhCallerId,
                value: unmaskedValue,
                valid: isValid,
                e164: e164Number
              }
            });
          }}
        />
        <CustomInput
          value={tempField.vhThreshold}
          error={invalidVhThreshold}
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
              vhThreshold: value.trim()
            });
          }}
        />
        <CustomInput
          value={tempField.vhCallTarget}
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
              vhCallTarget: value.trim()
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