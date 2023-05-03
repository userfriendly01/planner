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
  AddEditSkill,
  SkillFormState
} from "../Skills.Interfaces";
import {
  formModes, ModalOverlayStatuses
} from "globals";
import {
  FormControlLabel,
  Switch
} from "@mui/material";
import {
  createSkill
} from "services";

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


const defaultSaveResult: any = {
  status: null,
  message: null
};

// TODO: add TOOLTIPS

const SkillEntryFormModal = (props: any) => {  // TODO: Makes a props interface
  const {
    closeModal, taskQueues, applications, timeOfDays
  } = props;

  const skFormState: SkillFormState = skillFormState();
  const skFormDispatch = skillFormDispatch();
  console.log("sskillFormState", skFormState);


  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const skills = state.skillContext.skills;

  const [ saveResult, setSaveResult ] = React.useState(defaultSaveResult);

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
  const applicationOptions = getDropdownOptions(applications, "applicationName", "applicationId")

  const invalidSkillFriendlyName = skills.find(skill => skill.ctmSkillDisplayName === skFormState.skillFriendlyName) ? true : false;
  const invalidSkillNum = skills.find(skill => skill.name === skFormState.skillNum) ? true : false;
  const invalidVhCallTarget = skFormState.vhCallTarget.e164.trim() !== "" && !skFormState.vhCallTarget.valid;
  const invalidVhThreshold = skFormState.vhThreshold.trim() !== "" && isNaN(parseInt(skFormState.vhThreshold));

  const areRequiredFieldsEmpty = () => {
    let hasEmptyValues = true;
    let emptyTimeOfDay = true;
    const {
      skillFriendlyName,
      skillNum,
      applicationId,
      taskQueueSid,
      profileIds,
      enableVirtualHold,
      vhCallTarget,
      vhThreshold,
      timeOfDay
    } = skFormState;

    hasEmptyValues = skillFriendlyName === "" || skillNum === "" || applicationId === null ||
      taskQueueSid === "" || !taskQueueSid || profileIds.length < 1;

    emptyTimeOfDay = Object.values(timeOfDay).filter((value: any) => !value || (value && value.toString().trim() === "")).length > 0;

    if (enableVirtualHold) {
      hasEmptyValues = hasEmptyValues || vhThreshold === "" || vhCallTarget.e164 === "";
    }

    if (hasEmptyValues || emptyTimeOfDay) {
      return true;
    } else {
      return false;
    }
  };

  const addSkill = async () => {
    // TODO?  check that user is admin?

    //   validate the skill info
    if (areRequiredFieldsEmpty() || invalidSkillFriendlyName || invalidSkillNum || invalidVhCallTarget || invalidVhThreshold) {
      return;
    }

    const body: AddEditSkill = {
      skillFriendlyName: skFormState.skillFriendlyName,
      skillNum: skFormState.skillNum,
      profileIds: skFormState.profileIds,
      applicationId: skFormState.applicationId,
      taskQueueSid: skFormState.taskQueueSid,
      vhCallTarget: skFormState.enableVirtualHold ? skFormState.vhCallTarget.e164 : null,
      vhThreshold: skFormState.enableVirtualHold ? parseInt(skFormState.vhThreshold) : null,
      timeOfDayIds: [
        {
          dayId: 1,
          timeOfDayId: skFormState.timeOfDay.sunday
        },
        {
          dayId: 2,
          timeOfDayId: skFormState.timeOfDay.monday
        },
        {
          dayId: 3,
          timeOfDayId: skFormState.timeOfDay.tuesday
        },
        {
          dayId: 4,
          timeOfDayId: skFormState.timeOfDay.wednesday
        },
        {
          dayId: 5,
          timeOfDayId: skFormState.timeOfDay.thursday
        },
        {
          dayId: 6,
          timeOfDayId: skFormState.timeOfDay.friday
        },
        {
          dayId: 7,
          timeOfDayId: skFormState.timeOfDay.saturday
        }
      ]
    };

    console.log("^^^^ This is the body we will send to softphone service", body);

    try {

      const result = await createSkill(body);
      console.log("%%%%% result", result);
      closeModal();
      setSaveResult({
        message: "Request Successfully Processed",
        status: ModalOverlayStatuses.SUCCESS
      });
      skFormDispatch({
        type: skillFormActions.RESET_FORM
      });
    } catch (err) {
      console.log("ERROR WHEN ADDING SKILL", err);
      setSaveResult({
        message: "Request Failed",
        status: ModalOverlayStatuses.FAIL
      });
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
            error={invalidSkillFriendlyName}
            maxLength="80"
            label="Skill Friendly Name"
            name="Skill Friendly Name"
            updateValue={value => {
              skFormDispatch({
                type: skillFormActions.SET_SKILL_FRIENDLY_NAME,
                payload: value.trim()
              });
            }}
          />
          <CustomInput
            value={skFormState.skillNum}
            styles={inputStyles}
            error={invalidSkillNum}
            maxLength="80"
            label="Skill Number"
            name="Skill Number"
            updateValue={value => {
              skFormDispatch({
                type: skillFormActions.SET_SKILL_NUM,
                payload: value.trim()
              });
            }}
          />
        </RowContainer>
        <RowContainer>
          <Dropdown
            options={profileOptions}
            value={profileOptions.filter((p: any) => skFormState.profileIds.includes(p.value))}
            multiple={true}
            label="Profiles"
            updateValue={(e:any, values: any) => {
              console.log(values);
              skFormDispatch({
                type: skillFormActions.SET_PROFILE_IDS,
                payload: [...values.map((val: any) => val.value)]
              });
            }}
          />
          <Dropdown
            options={taskQueueOptions}
            value={taskQueueOptions.find((op:any) => op.value === skFormState.taskQueueSid) || null}
            label="Task Queue"
            updateValue={(e: any, newValue: any) => {
              skFormDispatch({
                type: skillFormActions.SET_TASK_QUEUE,
                payload: newValue.value
              });
            }}
          />
          <Dropdown
            options={applicationOptions}
            value={applicationOptions.find((ap:any) => ap.value === skFormState.applicationId) || null}
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
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.sunday) || null}
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
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.saturday) || null}
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
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.monday) || null}
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
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.tuesday) || null}
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
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.wednesday) || null}
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
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.thursday) || null}
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
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.friday) || null}
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
            inputProps={{ "aria-label": "toggle-enable-virtual-hold" }}
            checked={skFormState.enableVirtualHold}
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
          {/* todo: make this message better */}
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
              error={invalidVhThreshold}
              styles={inputStyles}
              maxLength="11"
              label="Virtual Hold Threshold"
              name="vhThreshold"
              updateValue={value => {
                skFormDispatch({
                  type: skillFormActions.SET_VH_THRESHOLD,
                  payload: value.trim()
                });
              }}
            />
          </RowContainer>
        </>
        }
        <ButtonWrapper>
          <StyledButton onClick={() => {
            closeModal();
            skFormDispatch({
              type: skillFormActions.RESET_FORM
            });
          }} >Cancel</StyledButton>
          <StyledButton
            onClick={addSkill}
            disabled={
              areRequiredFieldsEmpty() ||
              invalidSkillFriendlyName ||
              invalidSkillNum  ||
              invalidVhCallTarget ||
              invalidVhThreshold
            }
          >{skFormState.formMode === formModes.INSERT ? "Add " : "Update "}Skill</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default SkillEntryFormModal;