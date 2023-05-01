import React from "react";
import styled from "styled-components";
import {
  PaperContainer,
  StyledButton,
  Dropdown,
  CustomInput,
  ModalOverlay,
  PhoneNumberInput
} from "components";
import {
  useAdminState,
  skillFormState,
  skillFormDispatch,
  skillFormActions,
  initialSkillFormState
} from "context";
import {
  SkillFormState
} from "./SkillEntryForm.Interfaces";
import { formModes } from "globals";
import {
  FormControlLabel,
  Switch
} from "@mui/material";

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ColumnContainer = styled.div`
  display:flex;
  flex-direction: column;
`;

const ButtonWrapper = styled(RowContainer)`
  justify-content: space-around;
  padding: 8px;
  align-items: flex-end;
`;

const inputStyles = {
  width: "350px",
  margin: "5px"
};

// TODO: add TOOLTIPS
// TODO: validations

const SkillEntryFormModal = (props: any) => {  // TODO: Makes a props interface
  const {
    closeModal, saveResult, taskQueues, applications, timeOfDays
  } = props;

  const skFormState: SkillFormState = skillFormState();
  const skFormDispatch = skillFormDispatch();
  console.log("sskillFormState", skFormState);


  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const skills = state.skillContext.skills;


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

  const taskQueueOptions = getDropdownOptions(taskQueues, "friendlyName", "sid");
  const profileOptions = getDropdownOptions(profiles, "profile_nme", "profile_id");
  const timeOfDayOptions = getDropdownOptions(timeOfDays, "openTime", "timeOfDayId");

  const checkIfError = (key: string, value: string) => {
    let alreadyExists: boolean | any = false;
    const isInvalidValue = false;
    if (key === "skillFriendlyName") {
      alreadyExists = skills.find(skill => skill.ctmSkillDisplayName === value);
    } else if (key === "skillNum") {
      alreadyExists = skills.find(skill => skill.name === value);
    } else if (key === "vhCallTarget") {
      // check es16
    } else if (key === "vhThreshold") {

    }
    if (alreadyExists || isInvalidValue) {
      return true;
    }
  };

  return (
    <ModalContainer>
      <PaperContainer>
        { saveResult.status !== null &&
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={closeModal}
          />
        }
        Add Skill
        <RowContainer>
          <CustomInput
            value={skFormState.skillFriendlyName}
            styles={inputStyles}
            error={checkIfError("skillFriendlyName", skFormState.skillFriendlyName)}
            maxLength="80"
            label="Skill Friendly Name"
            name="Skill Friendly Name"
            updateValue={value => {
              skFormDispatch({
                type: skillFormActions.SET_SKILL_FRIENDLY_NAME,
                payload: value
              });
            }}
          />
          <CustomInput
            value={skFormState.skillNum}
            styles={inputStyles}
            error={checkIfError("skillNum", skFormState.skillNum)}
            maxLength="80"
            label="Skill Number"
            name="Skill Number"
            updateValue={value => {
              skFormDispatch({
                type: skillFormActions.SET_SKILL_NUM,
                payload: value
              });
            }}
          />
        </RowContainer>
        <RowContainer>
          <Dropdown
            options={profileOptions}
            value={profileOptions.filter((p: any) => skFormState.profiles.includes(p.value))}
            multiple={true}
            label="Profiles"
            updateValue={(e:any, values: any) => {
              console.log(values);
              skFormDispatch({
                type: skillFormActions.SET_PROFILES,
                payload: [...values.map((val: any) => val.value)]
              });
            }}
          />
          <Dropdown
            options={taskQueueOptions}
            //   value={taskQueueOptions.find((tq: any) => tq.value === skFormState.taskQueue)}
            label="Task Queue"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillFormActions.SET_TASK_QUEUE,
                payload: newValue.value
              });
            }}
          />
          <Dropdown
            options={getDropdownOptions(applications, "applicationName", "applicationId")}
            //   value={skillForm.selectedApplication}
            label="Application"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillFormActions.SET_APPLICATION_ID,
                payload: newValue.value
              });
            }}
          />
        </RowContainer>
        <hr />
        <div>Time of Day</div>
        <RowContainer>
          <ColumnContainer>
            <Dropdown
              options={timeOfDayOptions}
              //   value={skillForm.selectedApplication}
              label="Sunday Time of Day"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay,
                    sunday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              //   value={skillForm.selectedApplication}
              label="Saturday Time of day"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay,
                    saturday: newValue.value
                  }
                });
              }}
            />
          </ColumnContainer>
          <ColumnContainer>
            <Dropdown
              options={timeOfDayOptions}
              //   value={skillForm.selectedApplication}
              label="Monday Time of Day"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay,
                    monday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              //   value={skillForm.selectedApplication}
              label="Tuesday Time of Day"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay,
                    tuesday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              //   value={skillForm.selectedApplication}
              label="Wednesday Time of Day"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay,
                    wednesday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              //   value={skillForm.selectedApplication}
              label="Thursday Time of Day"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay,
                    thursday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              //   value={skillForm.selectedApplication}
              label="Friday Time of Day"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay,
                    friday: newValue.value
                  }
                });
              }}
            />
          </ColumnContainer>
        </RowContainer>
        <hr />

        <FormControlLabel
          label={"Virtual Hold"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}	
            //   checked={form[control.fieldKey].value}	
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                skFormDispatch({
                  type: skillFormActions.SET_ENABLE_VIRTUAL_HOLD,
                  payload: true
                });
              } else {
                skFormDispatch({
                  type: skillFormActions.SET_ENABLE_VIRTUAL_HOLD,
                  payload: false
                });
                skFormDispatch({
                  type: skillFormActions.SET_VH_CALL_TARGET,
                  payload: initialSkillFormState.vhCallTarget
                });
                skFormDispatch({
                  type: skillFormActions.SET_VH_THRESHOLD,
                  payload: initialSkillFormState.vhThreshold
                });
              }
            }}
          />} />
        {skFormState.enableVirtualHold && <>
          <div>Note: Adding these fields will not enable virtual hold.  More needs to be done in addition to providing these values here...</div>
          <RowContainer>
            <PhoneNumberInput
              id="Virtual Hold Call Target"
              label="Virtual Hold Call Target"
              style={inputStyles}
              number={skFormState.vhCallTarget.value}
              showError={skFormState.vhCallTarget.blurred && !skFormState.vhCallTarget.valid}
              onBlur={() => skFormDispatch({
                type: skillFormActions.SET_VH_CALL_TARGET,
                payload: {
                  ...skFormState.vhCallTarget,
                  blurred: true
                }
              })}
              updateValue={(maskedValue: string, unmaskedValue: string, isValid: boolean, e164Number: string) => {
                console.log(`maskedValue: ${maskedValue} - "unmaskedValue: ${unmaskedValue} - isValid: ${isValid} - e164Number: ${e164Number}`);
                skFormDispatch({
                  type: skillFormActions.SET_VH_CALL_TARGET,
                  payload: {
                    ...skFormState.vhCallTarget,
                    value: unmaskedValue,
                    valid: isValid,
                    e164: e164Number
                  }
                });
              }}
            />
            <CustomInput
              value={skFormState.vhThreshold}
              error={checkIfError("vhThreshold", skFormState.vhThreshold)}
              styles={inputStyles}
              maxLength="11"
              label="Virtual Hold Threshold"
              name="vhThreshold"
              updateValue={value => {
                skFormDispatch({
                  type: skillFormActions.SET_VH_THRESHOLD,
                  payload: value
                });
              }}
            />
          </RowContainer>
        </>
        }
        <ButtonWrapper>
          <StyledButton onClick={closeModal} >Cancel</StyledButton>
          <StyledButton
            onClick={closeModal}
            disabled={
              Object.values(skFormState).filter((value: string | any[]) => !value || (value && value.toString().trim() === "")).length > 0 ||
                Object.values(skFormState.timeOfDay).filter((value: any) => !value || (value && value.toString().trim() === "")).length > 0
            //       checkIfError("skillName", skillForm.skillName) ||
            //       checkIfError("skillNum", skillForm.skillNum)
            }
          >{skFormState.formMode === formModes.INSERT ? "Add " : "Update "}Skill</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default SkillEntryFormModal;