import React from "react";
import styled from "styled-components";
import {
  StyledButton,
  Dropdown,
  CustomInput,
  ModalOverlay,
  PhoneNumberInput
} from "components";
import {
  useAdminState,
  useAdminDispatch,
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
  FlexRow, FlexColumn,
  formModes, ModalOverlayStatuses
} from "globals";
import {
  FormControlLabel,
  Switch,
  Paper
} from "@mui/material";
import {
  createSkill
} from "services";
import { getSkills } from "authentication";

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

const ScrollingPaper = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
  overflow-y: auto;
  max-height: 800px;
`;

const CenteredDiv = styled.div`
  align-self: center;
  margin-bottom: 5px;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 8px;
  align-items: flex-end;
`;

const inputStyles = {
  width: "350px",
  margin: "5px"
};

// TODO: add TOOLTIPS

const SkillEntryFormModal = (props: any) => {  // TODO: Makes a props interface
  const {
    closeModal, taskQueues, applications, timeOfDays, saveResult, setSaveResult
  } = props;

  const skFormState: SkillFormState = skillFormState();
  const skFormDispatch = skillFormDispatch();
  console.log("sskillFormState", skFormState);

  const adminDispatch = useAdminDispatch();


  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const skills = state.skillContext.skills;
  const nNumber = state.userContext.pingIdentity.sub;


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
  const applicationOptions = getDropdownOptions(applications, "applicationName", "applicationId");

  const invalidSkillFriendlyName = skills.find(skill => skill.ctmSkillDisplayName === skFormState.skillFriendlyName) ? true : false;
  const invalidSkillNum = skills.find(skill => skill.name === skFormState.skillNum) ? true : false;
  const invalidVhCallTarget = skFormState.vhCallTarget.e164.trim() !== "" && !skFormState.vhCallTarget.valid;
  const invalidVhThreshold = skFormState.vhThreshold.trim() !== "" && isNaN(parseInt(skFormState.vhThreshold));

  const areRequiredFieldsEmpty = () => {
    let hasEmptyValues = true;
    let emptyTimeOfDay = true;
    let emptyVhTimeOfDay;
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

    emptyTimeOfDay = Object.values(timeOfDay.skill).filter((value: any) => !value || (value && value.toString().trim() === "")).length > 0;

    if (enableVirtualHold) {
      hasEmptyValues = hasEmptyValues || vhThreshold === "" || vhCallTarget.e164 === "";
      emptyVhTimeOfDay = Object.values(timeOfDay.vh).filter((value: any) => !value || (value && value.toString().trim() === "")).length > 0;
    }

    if (hasEmptyValues || emptyTimeOfDay || emptyVhTimeOfDay) {
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
      updatedBy: nNumber,
      timeOfDayIds: [
        {
          dayId: 1,
          timeOfDayId: skFormState.timeOfDay.skill.sunday,
          vhTimeOfDayId: skFormState.timeOfDay.vh.sunday
        },
        {
          dayId: 2,
          timeOfDayId: skFormState.timeOfDay.skill.monday,
          vhTimeOfDayId: skFormState.timeOfDay.vh.monday
        },
        {
          dayId: 3,
          timeOfDayId: skFormState.timeOfDay.skill.tuesday,
          vhTimeOfDayId: skFormState.timeOfDay.vh.tuesday
        },
        {
          dayId: 4,
          timeOfDayId: skFormState.timeOfDay.skill.wednesday,
          vhTimeOfDayId: skFormState.timeOfDay.vh.wednesday
        },
        {
          dayId: 5,
          timeOfDayId: skFormState.timeOfDay.skill.thursday,
          vhTimeOfDayId: skFormState.timeOfDay.vh.thursday
        },
        {
          dayId: 6,
          timeOfDayId: skFormState.timeOfDay.skill.friday,
          vhTimeOfDayId: skFormState.timeOfDay.vh.friday
        },
        {
          dayId: 7,
          timeOfDayId: skFormState.timeOfDay.skill.saturday,
          vhTimeOfDayId: skFormState.timeOfDay.vh.saturday
        }
      ]
    };

    try {

      const response = await createSkill(body);
      console.log("%%%%% response", response);
      if (response.status === 200) {
        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });
        skFormDispatch({
          type: skillFormActions.RESET_FORM
        });
        await getSkills(adminDispatch);
        closeModal();
      } else {
        // a partial success will return 206
        // meaning either the creation in contactmanager OR the callflow db was sucessful
        setSaveResult({
          message: response.data.result.message,
          status: ModalOverlayStatuses.PARTIAL_FAIL
        });
        skFormDispatch({
          type: skillFormActions.RESET_FORM
        });
        await getSkills(adminDispatch);

      }
    } catch (err) {
      console.error("ERROR WHEN ADDING SKILL", err);
      setSaveResult({
        message: `Request Failed: ${err}`,
        status: ModalOverlayStatuses.FAIL
      });
    }
  };

  return (
    <ModalContainer>
      <ScrollingPaper>
        { saveResult.status !== null &&
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={closeModal}
          />
        }
        <CenteredDiv style={{ fontSize: "25px" }}>Add Skill</CenteredDiv>
        <FlexRow>
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
            label="Skill"
            name="Skill"
            updateValue={value => {
              skFormDispatch({
                type: skillFormActions.SET_SKILL_NUM,
                payload: value.trim()
              });
            }}
          />
        </FlexRow>
        <FlexRow>
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
        </FlexRow>
        <hr />
        <CenteredDiv>Skill Time of Day</CenteredDiv>
        <FlexRow>
          <FlexColumn>
            <Dropdown
              options={timeOfDayOptions}
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.skill.sunday) || null}
              label="Sunday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay.skill,
                    sunday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.skill.saturday) || null}
              label="Saturday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay.skill,
                    saturday: newValue.value
                  }
                });
              }}
            />
          </FlexColumn>
          <FlexColumn>
            <Dropdown
              options={timeOfDayOptions}
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.skill.monday) || null}
              label="Monday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay.skill,
                    monday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.skill.tuesday) || null}
              label="Tuesday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay.skill,
                    tuesday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.skill.wednesday) || null}
              label="Wednesday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay.skill,
                    wednesday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.skill.thursday) || null}
              label="Thursday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay.skill,
                    thursday: newValue.value
                  }
                });
              }}
            />
            <Dropdown
              options={timeOfDayOptions}
              value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.skill.friday) || null}
              label="Friday"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillFormActions.SET_TIME_OF_DAYS,
                  payload: {
                    ...skFormState.timeOfDay.skill,
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
                skFormDispatch({
                  type: skillFormActions.SET_VH_TIME_OF_DAYS,
                  payload: initialSkillFormState.timeOfDay.vh
                });
              }
            }}
          />} />
        {skFormState.enableVirtualHold && <>
          {/* todo: make this message better */}
          <CenteredDiv>Note: Adding these fields will not enable virtual hold.  More needs to be done in addition to providing these values</CenteredDiv>
          <FlexRow>
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
          </FlexRow>
          <CenteredDiv>Virtual Hold Time of Day</CenteredDiv>
          <FlexRow>
            <FlexColumn>
              <Dropdown
                options={timeOfDayOptions}
                value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.vh.sunday) || null}
                label="Virtual Hold Time: Sunday"
                updateValue={(e: any, newValue: any) => {
                  skFormDispatch({
                    type: skillFormActions.SET_VH_TIME_OF_DAYS,
                    payload: {
                      ...skFormState.timeOfDay.vh,
                      sunday: newValue.value
                    }
                  });
                }}
              />
              <Dropdown
                options={timeOfDayOptions}
                value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.vh.saturday) || null}
                label="Virtual Hold Time: Saturday"
                updateValue={(e: any, newValue: any) => {
                  skFormDispatch({
                    type: skillFormActions.SET_VH_TIME_OF_DAYS,
                    payload: {
                      ...skFormState.timeOfDay.vh,
                      saturday: newValue.value
                    }
                  });
                }}
              />
            </FlexColumn>
            <FlexColumn>
              <Dropdown
                options={timeOfDayOptions}
                value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.vh.monday) || null}
                label="Virtual Hold Time: Monday"
                updateValue={(e: any, newValue: any) => {
                  skFormDispatch({
                    type: skillFormActions.SET_VH_TIME_OF_DAYS,
                    payload: {
                      ...skFormState.timeOfDay.vh,
                      monday: newValue.value
                    }
                  });
                }}
              />
              <Dropdown
                options={timeOfDayOptions}
                value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.vh.tuesday) || null}
                label="Virtual Hold Time: Tuesday"
                updateValue={(e: any, newValue: any) => {
                  skFormDispatch({
                    type: skillFormActions.SET_VH_TIME_OF_DAYS,
                    payload: {
                      ...skFormState.timeOfDay.vh,
                      tuesday: newValue.value
                    }
                  });
                }}
              />
              <Dropdown
                options={timeOfDayOptions}
                value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.vh.wednesday) || null}
                label="Virtual Hold Time: Wednesday"
                updateValue={(e: any, newValue: any) => {
                  skFormDispatch({
                    type: skillFormActions.SET_VH_TIME_OF_DAYS,
                    payload: {
                      ...skFormState.timeOfDay.vh,
                      wednesday: newValue.value
                    }
                  });
                }}
              />
              <Dropdown
                options={timeOfDayOptions}
                value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.vh.thursday) || null}
                label="Virtual Hold Time: Thursday"
                updateValue={(e: any, newValue: any) => {
                  skFormDispatch({
                    type: skillFormActions.SET_VH_TIME_OF_DAYS,
                    payload: {
                      ...skFormState.timeOfDay.vh,
                      thursday: newValue.value
                    }
                  });
                }}
              />
              <Dropdown
                options={timeOfDayOptions}
                value={timeOfDayOptions.find((tod:any) => tod.value === skFormState.timeOfDay.vh.friday) || null}
                label="Virtual Hold Time: Friday"
                updateValue={(e: any, newValue: any) => {
                  skFormDispatch({
                    type: skillFormActions.SET_VH_TIME_OF_DAYS,
                    payload: {
                      ...skFormState.timeOfDay.vh,
                      friday: newValue.value
                    }
                  });
                }}
              />
            </FlexColumn>
          </FlexRow>
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
      </ScrollingPaper>
    </ModalContainer>
  );
};

export default SkillEntryFormModal;