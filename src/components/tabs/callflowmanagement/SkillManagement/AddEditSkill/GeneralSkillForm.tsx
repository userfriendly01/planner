import { SkillState } from "../Skills.Interfaces";
import {
  FormRow,
  TaskQueueDisplay,
  Label
} from "../Skills.Styles";
import { Dropdown } from "components/core/CustomDropdown/Dropdown";
import { CustomInput } from "components/core/CustomInput/CustomInput";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import { skillActions } from "context/reducers/skillReducer";
import {
  FlexColumn, DropdownOption
} from "globals/interfaces";
import React from "react";
import {
  isTaskQueueError
} from "utils/skillsUtils";

export const GeneralSkillForm = () => {

  const skillState: SkillState = useSkillState();
  const skFormDispatch = useSkillDispatch();

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const [ tempField, setTempField ] = React.useState({
    name: skillState.skillForm.name,
    newTaskQueue: skillState.skillForm.taskQueue.isNew ? skillState.skillForm.taskQueue.friendly_name : ""
  });
  const taskQueues = skillState.taskQueues;
  const taskQueueError: boolean = isTaskQueueError(skillState.skillForm, tempField.name);
  const taskQueueOptions = taskQueues.map(queue => {
    return {
      label: queue.friendly_name,
      value: queue.sid,
      ...queue
    };
  });
  const workerExpressionDisplay = skillState.skillForm.taskQueue.isNew ? `routing.skills HAS "${tempField.name}"` : skillState.skillForm.taskQueue.target_workers;
  const nameDisplay = skillState.skillForm.taskQueue.isNew ? tempField.newTaskQueue : skillState.skillForm.taskQueue.friendly_name;

  const [ filteredQueues, setFilteredQueues ] = React.useState(taskQueueOptions);

  const taskQueueDropdownOptions: DropdownOption[] = [
    {
      label: "Show All",
      value: "show-all"
    },
    {
      label: "Add TaskQueue",
      value: "add-taskqueue"
    },
    {
      label: "divider",
      value: "divider"
    },
    ...filteredQueues
  ];

  const ouOptions = skillState.operatingUnits.map(ou => ({
    value: ou.ou_sid,
    label: ou.ou_name
  }));

  const profileOptions = profiles.map(p => ({
    value: p.profile_id,
    label: p.profile_nme
  }));

  const inputStyles = {
    width: "330px",
    margin: "5px"
  };
  return (
    <>
      <FormRow>
        <CustomInput
          value={tempField.name}
          styles={inputStyles}
          maxLength="80"
          onBlur={() => {
            setFilteredQueues(taskQueueOptions.filter(tq => tq.target_workers.includes(tempField.name)));
            skFormDispatch({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "name",
                value: tempField.name
              }
            });
          }}
          label="Skill"
          name="Skill"
          updateValue={value => {
            setTempField({
              ...tempField,
              name: value
            });
          }}
        />
        <Dropdown
          options={profileOptions}
          styles={inputStyles}
          value={profileOptions.filter((p: any) => skillState.skillForm.profileIds.includes(p.value))}
          multiple={true}
          label="Profiles"
          updateValue={(e:any, values: any) => {
            skFormDispatch({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "profileIds",
                value: [...values.map((val: any) => val.value)]
              }
            });
          }}
        />
      </FormRow>
      <FormRow>
        <FlexColumn style={{ maxWidth: "300px" }}>
          <Dropdown
            options={taskQueueDropdownOptions}
            styles={inputStyles}
            value={skillState.skillForm.taskQueue.isNew && "Add TaskQueue" || taskQueueOptions.find((op:any) => op.value === skillState.skillForm.taskQueue.sid) || null}
            label="Task Queue"
            updateValue={(e: any, newValue: any) => {
              if (newValue === null || newValue.value === "show-all") {
                setFilteredQueues(taskQueueOptions);
                if(newValue === null){
                  skFormDispatch({
                    type: skillActions.CLEAR_FORM_FIELD,
                    payload: "taskQueue"
                  });
                }
              } else if (newValue.value === "add-taskqueue") {
                skFormDispatch({
                  type: skillActions.CLEAR_FORM_FIELD,
                  payload: "taskQueue"
                });
                skFormDispatch({
                  type: skillActions.SET_FORM_FIELD,
                  payload: {
                    key: "taskQueue",
                    value: {
                      ...skillState.skillForm.taskQueues,
                      isNew: true
                    }
                  }
                });
              } else if (newValue.value !== "divider") {
                skFormDispatch({
                  type: skillActions.SET_FORM_FIELD,
                  payload: {
                    key: "taskQueue",
                    value: {
                      ...newValue,
                      isNew: false
                    }
                  }
                });
              }
            }}
          />
          { taskQueueError &&
            <Label>The selected Task Queues target expression does not match the skill entered</Label>
          }
          { skillState.skillForm.taskQueue.isNew &&
          <div>
            <CustomInput
              value={tempField.newTaskQueue}
              styles={inputStyles}
              onBlur={() => {
                skFormDispatch({
                  type: skillActions.SET_FORM_FIELD,
                  payload: {
                    key: "taskQueue",
                    value: {
                      ...skillState.skillForm.taskQueue,
                      friendly_name: tempField.newTaskQueue.trim()
                    }
                  }
                });
              }}
              label="New Task Queue Friendly Name"
              name="Skill"
              updateValue={value => {
                setTempField({
                  ...tempField,
                  newTaskQueue: value
                });
              }}
            />
            <Dropdown
              options={ouOptions}
              styles={inputStyles}
              value={ouOptions.find((op:any) => op.value === skillState.skillForm.taskQueue.operating_unit_sid) || null}
              label="Operating Unit"
              updateValue={(e: any, newValue: any) => {
                skFormDispatch({
                  type: skillActions.SET_FORM_FIELD,
                  payload: {
                    key: "taskQueue",
                    value: {
                      ...skillState.skillForm.taskQueue,
                      operating_unit_sid: newValue.value
                    }
                  }
                });
              }}
            />
          </div>         }
        </FlexColumn>
        <TaskQueueDisplay elevation={3} error={taskQueueError.toString()}>
          <Label><h2>Task Queue Details</h2></Label>
          <Label>{skillState.skillForm.taskQueue.sid}</Label>
          <Label>{nameDisplay}</Label>
          <Label>{workerExpressionDisplay}</Label>
        </TaskQueueDisplay>
      </FormRow>
    </>
  );
};