import {
  FormControlLabel, Switch
} from "@mui/material";
import { Dropdown } from "components/core/CustomDropdown/Dropdown";
import { CustomInput } from "components/core/CustomInput/CustomInput";
import { PhoneNumberInput } from "components/core/PhoneNumberInput/PhoneNumberInput";
import { CenteredDiv } from "components/tabs/usermanagement/BulkChanges/BulkChanges.Styles";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import {
  skillActions,
  initialSkillFormState
} from "context/reducers/skillReducer";
import {
  FlexRow, FlexColumn
} from "globals/interfaces";
import React from "react";
import { SkillState } from "../Skills.Interfaces";

export const CallflowSkillForm = () => {

  const skillState: SkillState = useSkillState();
  const skFormDispatch = useSkillDispatch();

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const skills = skillState.skills;

  const getDropdownOptions = (list: any[], labelKey: string, valueKey: string) => {
    if (labelKey === "openTime") {
      return list.map(option => ({
        value: option[valueKey],
        label: `${option[labelKey]} - ${option.closeTime}`
      }));
    }
    return list.map(option => ({
      value: option[valueKey],
      label: option[labelKey]
    }));
  };

  const taskQueueOptions = getDropdownOptions(skillState.taskQueues, "friendlyName", "sid");
  const profileOptions = getDropdownOptions(profiles, "profile_nme", "profile_id");
  const timeOfDayOptions = getDropdownOptions(skillState.timeOfDays, "openTime", "timeOfDayId");
  const applicationOptions = getDropdownOptions(skillState.applications, "applicationName", "applicationId");

  const invalidSkillFriendlyName = skills.find((skill: any) => skill.ctmSkillDisplayName === skillState.skillForm.skillFriendlyName) ? true : false;
  const invalidSkillNum = skills.find((skill: any) => skill.name === skillState.skillForm.skillNum) ? true : false;
  const invalidVhCallTarget = skillState.skillForm.vhCallTarget.e164.trim() !== "" && !skillState.skillForm.vhCallTarget.valid;
  const invalidVhThreshold = skillState.skillForm.vhThreshold.trim() !== "" && isNaN(parseInt(skillState.skillForm.vhThreshold));

  const inputStyles = {
    width: "350px",
    margin: "5px"
  };

  return (
    <>
      <FlexRow>
        <CustomInput
          value={skillState.skillForm.skillFriendlyName}
          styles={inputStyles}
          error={invalidSkillFriendlyName}
          maxLength="80"
          label="Skill Friendly Name"
          name="Skill Friendly Name"
          updateValue={value => {
            skFormDispatch({
              type: skillActions.SET_SKILL_FRIENDLY_NAME,
              payload: value.trim()
            });
          }}
        />
        <CustomInput
          value={skillState.skillForm.skillNum}
          styles={inputStyles}
          error={invalidSkillNum}
          maxLength="80"
          label="Skill"
          name="Skill"
          updateValue={value => {
            skFormDispatch({
              type: skillActions.SET_SKILL_NUM,
              payload: value.trim()
            });
          }}
        />
      </FlexRow>
      <FlexRow>
        <Dropdown
          options={profileOptions}
          value={profileOptions.filter((p: any) => skillState.skillForm.profileIds.includes(p.value))}
          multiple={true}
          label="Profiles"
          updateValue={(e:any, values: any) => {
            skFormDispatch({
              type: skillActions.SET_PROFILE_IDS,
              payload: [...values.map((val: any) => val.value)]
            });
          }}
        />
        <Dropdown
          options={taskQueueOptions}
          value={taskQueueOptions.find((op:any) => op.value === skillState.skillForm.taskQueueSid) || null}
          label="Task Queue"
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_TASK_QUEUE,
              payload: newValue.value
            });
          }}
        />
        <Dropdown
          options={applicationOptions}
          value={applicationOptions.find((ap:any) => ap.value === skillState.skillForm.applicationId) || null}
          label="Application"
          updateValue={(e: any, newValue: any) => {
            skFormDispatch({
              type: skillActions.SET_APPLICATION_ID,
              payload: newValue.value
            });
          }}
        />
      </FlexRow>
      <hr />
      <CenteredDiv>Skill Time of Day</CenteredDiv>
      <FlexRow>
        <FlexColumn>
          <Dropdown //Faith fix how these populate
            options={timeOfDayOptions}
            value={null}
            label="Sunday"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillActions.SET_TIME_OF_DAYS,
                payload: null
              });
            }}
          />
          <Dropdown
            options={timeOfDayOptions}
            value={null}
            label="Saturday"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillActions.SET_TIME_OF_DAYS,
                payload: {
                  saturday: newValue.value
                }
              });
            }}
          />
        </FlexColumn>
        <FlexColumn>
          <Dropdown
            options={timeOfDayOptions}
            value={null}
            label="Monday"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillActions.SET_TIME_OF_DAYS,
                payload: {
                  monday: newValue.value
                }
              });
            }}
          />
          <Dropdown
            options={timeOfDayOptions}
            value={null}
            label="Tuesday"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillActions.SET_TIME_OF_DAYS,
                payload: {
                  tuesday: newValue.value
                }
              });
            }}
          />
          <Dropdown
            options={timeOfDayOptions}
            value={null}
            label="Wednesday"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillActions.SET_TIME_OF_DAYS,
                payload: {
                  wednesday: newValue.value
                }
              });
            }}
          />
          <Dropdown
            options={timeOfDayOptions}
            value={null}
            label="Thursday"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillActions.SET_TIME_OF_DAYS,
                payload: {
                  thursday: newValue.value
                }
              });
            }}
          />
          <Dropdown
            options={timeOfDayOptions}
            value={null}
            label="Friday"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillActions.SET_TIME_OF_DAYS,
                payload: {
                  friday: newValue.value
                }
              });
            }}
          />
        </FlexColumn>
      </FlexRow>
      <hr />
      <FormControlLabel
        label={"Virtual Hold"}
        labelPlacement="end"
        control={<Switch
          inputProps={{ "aria-label": "toggle-enable-virtual-hold" }}
          checked={skillState.skillForm.enableVirtualHold}
          onChange={(e: any, isChecked: any) => {
            if (isChecked) {
              skFormDispatch({
                type: skillActions.SET_ENABLE_VIRTUAL_HOLD,
                payload: true
              });
            } else {
              skFormDispatch({
                type: skillActions.SET_ENABLE_VIRTUAL_HOLD,
                payload: false
              });
              skFormDispatch({
                type: skillActions.SET_VH_CALL_TARGET,
                payload: initialSkillFormState.vhCallTarget
              });
              skFormDispatch({
                type: skillActions.SET_VH_THRESHOLD,
                payload: initialSkillFormState.vhThreshold
              });
              // skFormDispatch({
              //   type: skillActions.SET_VH_TIME_OF_DAYS,
              //   payload: initialSkillFormState.timeOfDays.vh
              // });
            }
          }}
        />} />
      {skillState.skillForm.enableVirtualHold && <>
        <CenteredDiv>Note: Adding these fields will NOT enable virtual hold by themselves.  More needs to be done in addition to providing these values</CenteredDiv>
        <FlexRow>
          <PhoneNumberInput
            id="Virtual Hold Call Target"
            label="Virtual Hold Call Target"
            style={inputStyles}
            number={skillState.skillForm.vhCallTarget.value}
            showError={skillState.skillForm.vhCallTarget.blurred && !skillState.skillForm.vhCallTarget.valid}
            onBlur={() => skFormDispatch({
              type: skillActions.SET_VH_CALL_TARGET,
              payload: {
                ...skillState.skillForm.vhCallTarget,
                blurred: true
              }
            })}
            updateValue={(maskedValue: string, unmaskedValue: string, isValid: boolean, e164Number: string) => {
              skFormDispatch({
                type: skillActions.SET_VH_CALL_TARGET,
                payload: {
                  ...skillState.skillForm.vhCallTarget,
                  value: unmaskedValue,
                  valid: isValid,
                  e164: e164Number
                }
              });
            }}
          />
          <CustomInput
            value={skillState.skillForm.vhThreshold}
            error={invalidVhThreshold}
            styles={inputStyles}
            maxLength="11"
            label="Virtual Hold Threshold"
            name="vhThreshold"
            updateValue={value => {
              skFormDispatch({
                type: skillActions.SET_VH_THRESHOLD,
                payload: value.trim()
              });
            }}
          />
        </FlexRow>
        <CenteredDiv>Virtual Hold Time of Day</CenteredDiv>
        <FlexRow>
          <FlexColumn>
            <Dropdown
              options={timeOfDayOptions}
              value={null}
              label="Virtual Hold Time: Sunday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_VH_TIME_OF_DAYS,
                  payload: {
                    sunday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={null}
              label="Virtual Hold Time: Saturday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_VH_TIME_OF_DAYS,
                  payload: {
                    saturday: newValue.value
                  }
                });
              }}
            />
          </FlexColumn>
          <FlexColumn>
            <Dropdown
              options={timeOfDayOptions}
              value={null}
              label="Virtual Hold Time: Monday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_VH_TIME_OF_DAYS,
                  payload: {
                    monday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={null}
              label="Virtual Hold Time: Tuesday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_VH_TIME_OF_DAYS,
                  payload: {
                    tuesday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={null}
              label="Virtual Hold Time: Wednesday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_VH_TIME_OF_DAYS,
                  payload: {
                    wednesday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={null}
              label="Virtual Hold Time: Thursday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_VH_TIME_OF_DAYS,
                  payload: {
                    thursday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={null}
              label="Virtual Hold Time: Friday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_VH_TIME_OF_DAYS,
                  payload: {
                    friday: newValue.value
                  }
                });
              }}
            />
          </FlexColumn>
        </FlexRow>
      </>
      }
    </>
  );
};