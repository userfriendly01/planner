import React from "react";
import { ProfileQueuesSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import { Dropdown } from "components";
import { useAdminState } from "context";
import { Skill } from "globals";
import {
  IconButtonWrapper,
  ProfileActivitiesControlWrapper,
  ProfileActivityRow,
  ProfileActivityRowItem,
  ProfileActivityRowSeperator,
  Label,
  ProfileActivitiesWrapper
} from "./ProfileEntryForm.Styles";
import {
  Add,
  Delete
} from "@mui/icons-material";

const ProfileQueuesSelectField = (props: ProfileQueuesSelectFieldProps) => {
  const {
    queueList,
    setQueueList
  } = props;

  const defaultNewQueue: Skill[] = [];
  const [newProfileQueue, setNewProfileQueue] = React.useState<Skill[]>(defaultNewQueue);
  const queues = useAdminState().skillContext.skills;

  const profileQueuesForDropDown = queues.filter(queue => {
    return !queueList.find(item => {
      return item.ctmSkillId === queue.ctmSkillId;
    });
  });

  const newProfileQueueChanged = (profileQueue: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedQueues = profileQueue.map(selectedQueue => queues.find(queue => selectedQueue.value === queue.ctmSkillId));
    setNewProfileQueue(selectedQueues);
  };

  const addProfileQueueClicked = () => {
    const updatedQueuesList = [ ...queueList, ...newProfileQueue ];
    setQueueList(updatedQueuesList);
    setNewProfileQueue(defaultNewQueue);
  };

  const removeProfileQueueClicked = (queueToBeRemoved: Skill) => {
    const updatedQueueList = queueList.filter(queues => queues.ctmSkillId !== queueToBeRemoved.ctmSkillId);
    setQueueList(updatedQueueList);
  };

  const getDropDownOptions = (optionsList: Skill[]) => {
    return optionsList.map(option => ({
      value: option.ctmSkillId,
      label: option.ctmSkillDisplayName
    }));
  };

  return (
    <ProfileActivitiesControlWrapper>
      <Label>Add Transfer Queues</Label>
      <ProfileActivityRow>
        <ProfileActivityRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getDropDownOptions(profileQueuesForDropDown)}
            multiple={true}
            value={getDropDownOptions(newProfileQueue)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newProfileQueueChanged(newInputValue)}
          />
        </ProfileActivityRowItem>
        <ProfileActivityRowItem>
          <IconButtonWrapper disabled={!newProfileQueue.length} onClick={addProfileQueueClicked} data-testid="add-queue-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileActivityRowItem>
      </ProfileActivityRow>
      <ProfileActivityRowSeperator/>
      <ProfileActivitiesWrapper>
        {queueList.map((queue: Skill, index: number) => {
          return (
            // @ts-ignore
            <ProfileActivityRow highlightOnHover={true} key={`queue-row-${index}`}>
              <ProfileActivityRowItem>{queue.ctmSkillDisplayName}</ProfileActivityRowItem>
              <ProfileActivityRowItem>
                <IconButtonWrapper onClick={() => removeProfileQueueClicked(queue)} data-testid="delete-queue-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileActivityRowItem>
            </ProfileActivityRow>
          );
        })}
      </ProfileActivitiesWrapper>
    </ProfileActivitiesControlWrapper>
  );
};

export default ProfileQueuesSelectField;