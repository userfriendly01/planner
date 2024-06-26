import React from "react";
import { ProfileQueuesSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import { Dropdown } from "components/Dropdown";
import { useSkillState } from "context/appContext";
import { logger } from "utils/logger";
import { Skill } from "callflowmanagement/Skills.Interfaces";
import {
  IconButtonWrapper,
  ProfileDropdownControlWrapper,
  ProfileDropdownRow,
  ProfileDropdownRowItem,
  ProfileDropdownRowSeperator,
  Label,
  ProfileDropdownWrapper
} from "./ProfileEntryForm.Styles";
import {
  Add,
  Delete
} from "@mui/icons-material";

export const ProfileQueuesSelectField = (props: ProfileQueuesSelectFieldProps) => {
  const {
    transferQueues,
    setQueueList
  } = props;

  const defaultNewQueue: Skill[] = [];
  const [newProfileQueue, setNewProfileQueue] = React.useState<Skill[]>(defaultNewQueue);
  const queues = useSkillState().skills;
  const [filteredQueues, setFilteredQueues] = React.useState<Skill[]>(defaultNewQueue);

  const profileQueuesForDropDown = filteredQueues.filter(queue => {
    return !transferQueues.find(item => {
      return item.name === queue.name;
    });
  });

  const newProfileQueueChanged = (profileQueue: Array<{[index: string]: any, value: string}>) => {
    const selectedQueues = profileQueue.map(selectedQueue => filteredQueues.find(queue => selectedQueue.value === queue.name));
    setNewProfileQueue(selectedQueues);
  };

  const addProfileQueueClicked = () => {
    const updatedQueuesList = [ ...transferQueues, ...newProfileQueue ];
    setQueueList(updatedQueuesList);
    setNewProfileQueue(defaultNewQueue);
  };

  const removeProfileQueueClicked = (queueToBeRemoved: Skill) => {
    const updatedQueueList = transferQueues.filter(queues => queues.name !== queueToBeRemoved.name);
    setQueueList(updatedQueueList);
  };

  const getDropDownOptions = (optionsList: Skill[]) => {
    return optionsList.map(option => ({
      value: option.name,
      label: option.taskQueueName
    }));
  };

  return (
    <ProfileDropdownControlWrapper>
      <Label>Add Transfer Queues</Label>
      <ProfileDropdownRow>
        <ProfileDropdownRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getDropDownOptions(profileQueuesForDropDown)}
            multiple={true}
            value={getDropDownOptions(newProfileQueue)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: string; }>) => newProfileQueueChanged(newInputValue)}
          />
        </ProfileDropdownRowItem>
        <ProfileDropdownRowItem>
          <IconButtonWrapper disabled={!newProfileQueue.length} onClick={addProfileQueueClicked} data-testid="add-queue-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileDropdownRowItem>
      </ProfileDropdownRow>
      <ProfileDropdownRowSeperator/>
      <ProfileDropdownWrapper>
        {transferQueues.map((queue: Skill, index: number) => {
          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // Aggregate queues have a negative ID (ctmSkillId) in order not to clash with single transfer queues
            <ProfileDropdownRow highlightOnHover={true} key={`queue-row-${index}`}>
              {/* {queue.ctmSkillId < 0 ?
                <Tooltip
                  title={"Aggregate Queue"}
                  placement={"bottom"}
                >
                  <ProfileDropdownRowItem>{queue.taskQueueName}</ProfileDropdownRowItem>
                </Tooltip>
                : */}
              <ProfileDropdownRowItem>{queue.taskQueueName}</ProfileDropdownRowItem>
              <ProfileDropdownRowItem>
                <IconButtonWrapper onClick={() => removeProfileQueueClicked(queue)} data-testid="delete-queue-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileDropdownRowItem>
            </ProfileDropdownRow>
          );
        })}
      </ProfileDropdownWrapper>
    </ProfileDropdownControlWrapper>
  );
};