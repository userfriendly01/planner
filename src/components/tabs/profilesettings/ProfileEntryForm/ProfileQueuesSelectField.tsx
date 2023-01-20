import React from "react";
import { ProfileQueuesSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import { Dropdown } from "components";
import { useAdminState } from "context";
import { sortQueueByName } from "utils";
import {
  AggregateQueue,
  Skill
} from "globals";
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
import { getAggregateQueuesType } from "services";

const ProfileQueuesSelectField = (props: ProfileQueuesSelectFieldProps) => {
  const {
    transferQueues,
    setQueueList
  } = props;

  const defaultNewQueue: Skill[] = [];
  const [newProfileQueue, setNewProfileQueue] = React.useState<Skill[]>(defaultNewQueue);
  const queues = useAdminState().skillContext.skills;
  const filteredQueues = queues.filter(queue => queue.ctmSkillId !== null).sort(sortQueueByName);
  const [aggregateQueues, setAggregateQueues] = React.useState([]);
  const aggregateQueuesType = 'aggregate';

  React.useEffect(() => {
    if(!aggregateQueues.length) {
      getAggregateQueuesType(aggregateQueuesType)
        .then((allAggregateQueues: AggregateQueue[]) => {
          setAggregateQueues(allAggregateQueues);

          console.log('allAggregateQueues', allAggregateQueues)

          const test = filteredQueues.concat(allAggregateQueues.map(queue => {
            return {
              name: "",
              timeOfDays: [],
              flashMessage: null,
              closedMessage: null,
              vhThreshold: 0,
              vhCallerId: null,
              vhCallTarget: null,
              levels: [],
              ctmSkillDisplayName: queue.aggregate_queues_nme,
              ctmSkillId: queue.aggregate_queues_id + 1000, //adding 1000 here as a hack around in order to not have duplicate ctmSkillIds.
              profiles: []
            }
          }));
          console.log('test', test);
        })
        .catch((error: { msg: any; }) => console.error(error.msg));
    }
  }, []);

  const profileQueuesForDropDown = filteredQueues.filter(queue => {
    return !transferQueues.find(item => {
      return item.ctmSkillId === queue.ctmSkillId;
    });
  });

  const newProfileQueueChanged = (profileQueue: Array<{[index: string]: any, value: number}>) => {
    const selectedQueues = profileQueue.map(selectedQueue => filteredQueues.find(queue => selectedQueue.value === queue.ctmSkillId));
    setNewProfileQueue(selectedQueues);
  };

  const addProfileQueueClicked = () => {
    const updatedQueuesList = [ ...transferQueues, ...newProfileQueue ];
    setQueueList(updatedQueuesList);
    setNewProfileQueue(defaultNewQueue);
  };

  const removeProfileQueueClicked = (queueToBeRemoved: Skill) => {
    const updatedQueueList = transferQueues.filter(queues => queues.ctmSkillId !== queueToBeRemoved.ctmSkillId);
    setQueueList(updatedQueueList);
  };

  const getDropDownOptions = (optionsList: Skill[]) => {
    return optionsList.map(option => ({
      value: option.ctmSkillId,
      label: option.ctmSkillDisplayName
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
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newProfileQueueChanged(newInputValue)}
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
            // @ts-ignore
            <ProfileDropdownRow highlightOnHover={true} key={`queue-row-${index}`}>
              <ProfileDropdownRowItem>{queue.ctmSkillDisplayName}</ProfileDropdownRowItem>
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

export default ProfileQueuesSelectField;