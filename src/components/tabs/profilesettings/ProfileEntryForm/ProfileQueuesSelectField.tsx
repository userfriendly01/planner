import React from "react";
import { ProfileQueuesSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileActivitiesControlWrapper,
  ProfileActivityRow,
  ProfileActivityRowItem,
  ProfileActivityRowSeperator,
  Label,
  ProfileActivitiesWrapper
} from "./ProfileEntryForm.Styles";
import { Dropdown } from "components";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  Queue,
  apiPaths
} from "globals";
import { myAxios } from "utils";

const getQueues = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_ACTIVITIES)
  .then(res => {
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch queues from service",
      error
    });
  })
);

const ProfileQueuesSelectField = (props: ProfileQueuesSelectFieldProps) => {
  const {
    queuesList,
    setQueuesList
  } = props;

  const defaultNewQueue: Queue[] = [];
  const [newProfileQueue, setNewProfileQueue] = React.useState<Queue[]>(defaultNewQueue);
  const [queues, setQueues] = React.useState([]);

  React.useEffect(() => {
    if(!queues.length) {
      getQueues()
        .then((allQueues: Queue[]) => {
          setQueues(allQueues);
        })
        .catch(error => console.error(error.msg));
    }
  }, []);

  const profileQueuesForDropDown = queues.filter(queue => {
    return !queuesList.find(item => {
      return item.activity_id === queue.activity_id;
    });
  });

  const newProfileQueueChanged = (profileQueue: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedQueues = profileQueue.map(selectedQueue => queues.find(queue => selectedQueue.value === queue.activity_id));
    setNewProfileQueue(selectedQueues);
  };

  const addProfileQueueClicked = () => {
    const updatedQueuesList = [ ...queuesList, ...newProfileQueue ];
    setQueuesList(updatedQueuesList);
    setNewProfileQueue(defaultNewQueue);
  };

  const removeProfileQueueClicked = (queueToBeRemoved: Queue) => {
    const updatedQueueList = queuesList.filter(queues => queues.activity_id !== queueToBeRemoved.activity_id);
    setQueuesList(updatedQueueList);
  };

  const getDropDownOptions = (optionsList: Queue[]) => {
    return optionsList.map(option => ({
      value: option.activity_id,
      label: option.activity_nme
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
        </ProfileActivityRowItem>s
      </ProfileActivityRow>
      <ProfileActivityRowSeperator/>
      <ProfileActivitiesWrapper>
        {queuesList.map((queue: Queue, index: number) => {
          return (
            // @ts-ignore
            <ProfileActivityRow highlightOnHover={true} key={`queue-row-${index}`}>
              <ProfileActivityRowItem>{queue.activity_nme}</ProfileActivityRowItem>
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