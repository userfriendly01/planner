import React from "react";
import styled from "styled-components";
import {
  PaperContainer,
  StyledButton,
  Dropdown,
  CustomInput,
  ModalOverlay
} from "components";
import TimePickerComponent from "components/core/SharedComponents/TimepickerComponent";
import {
  useAdminState,
  skillFormState,
  skillFormDispatch,
  skillFormActions
} from "context";
import SkillTimeOfDayFields from "./SkillTimeOfDayFields";

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
`;

const AddSkillModal = (props: any) => {  // TODO: Makes a props interface
  const {
    closeModal, saveResult, taskQueues
  } = props;

  const sFormState = skillFormState();
  const sFormDispatch = skillFormDispatch();
  console.log("sskillFormState", sFormState);
  //   const defaultDays = [
  //     {
  //       label: "Mon",
  //       value: 1
  //     },
  //     {
  //       label: "Tues",
  //       value: 2
  //     },
  //     {
  //       label: "Wed",
  //       value: 3
  //     },
  //     {
  //       label: "Thurs",
  //       value: 4
  //     },
  //     {
  //       label: "Fri",
  //       value: 5
  //     },
  //     {
  //       label: "Sat",
  //       value: 6
  //     },
  //     {
  //       label: "Sun",
  //       value: 7
  //     }
  //   ];

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const skills = state.skillContext.skills;
  //   const [ availableDays, setAvailableDays ] = React.useState(defaultDays);


  const getDropdownOptions = (list: any[], labelKey: string, valueKey: string) => {
    return list.map(option => ({
      value: option[valueKey],
      label: option[labelKey]
    }));
  };

  const taskQueueOptions = getDropdownOptions(taskQueues, "friendlyName", "sid");
  const profileOptions = getDropdownOptions(profiles, "profile_nme", "profile_id");

  const checkIfError = (key: string, value: string) => {
    let alreadyExists: boolean | any = false;
    if (key === "skillName") {
      alreadyExists = skills.find(skill => skill.ctmSkillDisplayName === value);
    } else if (key === "skillNum") {
      alreadyExists = skills.find(skill => skill.name === value);
    }
    if (alreadyExists) {
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
        <CustomInput
          value={sFormState.skillFriendlyName}
          //   error={checkIfError("skillName", skillForm.skillName)}
          maxLength="80"
          label="Skill Friendly Name"
          name="Skill Friendly Name"
          updateValue={value => {
            // setSkillForm({
            //   ...skillForm,
            //   skillName: value
            // });
            sFormDispatch({
              type: skillFormActions.SET_SKILL_FRIENDLY_NAME,
              payload: value
            });
          }}
        />
        <CustomInput
          value={sFormState.skillNum}
          //   error={checkIfError("skillNum", skillForm.skillNum)}
          maxLength="80"
          label="Skill Number"
          name="Skill Number"
          updateValue={value => {
            // setSkillForm({
            //   ...skillForm,
            //   skillNum: value
            // });
            sFormDispatch({
              type: skillFormActions.SET_SKILL_NUM,
              payload: value
            });
          }}
        />
        <Dropdown
          options={profileOptions}
          value={profileOptions.filter((p: any) => sFormState.profiles.includes(p.value))}
          multiple={true}
          label="Profiles"
          updateValue={(e:any, values: any) => {
            console.log(values);
            sFormDispatch({
              type: skillFormActions.SET_PROFILES,
              payload: [...values.map((val: any) => val.value)]
            });
            // setSkillForm({
            //   ...skillForm,
            //   profiles: [...value]
            // });
          }}
        />
        <Dropdown
          options={taskQueueOptions}
          //   value={taskQueueOptions.find((tq: any) => tq.value === sFormState.taskQueue)}
          label="Task Queue"
          updateValue={(e: any, newValue: any) => {
            sFormDispatch({
              type: skillFormActions.SET_TASK_QUEUE,
              payload: newValue.value
            });
            // setSkillForm({
            //   ...skillForm,
            //   taskQueueSid: newValue.value,
            //   selectedTaskQueue: newValue
            // });
          }}
        />
        <SkillTimeOfDayFields
        // availableDays={availableDays} 
        />
        {/* Hmmm is this component good enough?? */}
        {/* <TimePickerComponent
          label="startTime"
          name="startTime"
          value={skillForm.startTime}
          onChange={(e: any) => {
            console.log("timechange", e);

            setSkillForm({
              ...skillForm,
              startTime: e
            });
          }}
        />
        <TimePickerComponent
          label="endTime"
          name="endTime"
          value={skillForm.endTime}
          onChange={(e: any) => {
            console.log("timechange", e);

            setSkillForm({
              ...skillForm,
              endTime: e
            });
          }}
        /> */}
        {/* timeOfDays (array) -  checkboxes for day of week, dropdowns for times? or is there a special time input?*/}
        <Dropdown
        //   options={getDropdownOptions(taskQueues, "friendlyName", "sid")}
          options={[{
            value: "thing",
            label: "fake application"
          }]}
          //   value={skillForm.selectedApplication}
          label="Application"
          updateValue={(e: any, newValue: any) => {
            // setSkillForm({
            //   ...skillForm,
            //   applicationId: newValue.value,
            //   selectedApplication: newValue
            // });
            sFormDispatch({
              type: skillFormActions.SET_SKILL_NUM,
              payload: newValue.value
            });
          }}
        />
        <CustomInput
          value={sFormState.vhCallTarget}
          //   error={checkIfError("skillNum", skillForm.skillNum)}
          maxLength="11"
          label="Virtual Hold Call Target"
          name="vh_call_target"
          updateValue={value => {
            // setSkillForm({
            //   ...skillForm,
            //   vh_call_target: value
            // });
            sFormDispatch({
              type: skillFormActions.SET_VH_CALL_TARGET,
              payload: value
            });
          }}
        />
        <CustomInput
          value={sFormState.vhThreshold}
          //   error={checkIfError("skillNum", skillForm.skillNum)}
          maxLength="11"
          label="Virtual Hold Threshold"
          name="vh_threshold"
          updateValue={value => {
            sFormDispatch({
              type: skillFormActions.SET_VH_THRESHOLD,
              payload: value
            });
            // setSkillForm({
            //   ...skillForm,
            //   vh_threshold: value
            // });
          }}
        />
        <StyledButton onClick={closeModal} >Cancel</StyledButton>
        <StyledButton
          onClick={closeModal}
          disabled={
            Object.values(skillForm).filter((value: string | any[]) => !value || (value && value.toString().trim() === "")).length > 0 ||
              checkIfError("skillName", skillForm.skillName) ||
              checkIfError("skillNum", skillForm.skillNum)
          }
        >Add</StyledButton>
      </PaperContainer>
    </ModalContainer>
  );
};

export default AddSkillModal;