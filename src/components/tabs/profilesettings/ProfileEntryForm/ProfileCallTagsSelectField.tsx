import React from "react";
import { ProfileCallTagsSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileCallTagsControlWrapper,
  ProfileCallTagRow,
  ProfileCallTagRowItem,
  ProfileCallTagRowSeperator,
  Label,
  ProfileCallTagsWrapper
} from "./ProfileEntryForm.Styles";
import { Dropdown } from "components";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  CallTag,
  WorkerTaskInfo,
  apiPaths
} from "globals";
import { Tooltip } from "@mui/material";
import { myAxios } from "utils";

console.log("rz before getCallTags");
const getCallTags = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_PROFILE_WORKER_TASK_INFO)
  .then(res => {
    console.log("rz getCallTags=", res.data);
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch CallTags from service",
      error
    });
  })
);

console.log("rz before getWorkerTaskInfo");
const getWorkerTaskInfo = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_WORKER_TASK_INFO)
  .then(res => {
    console.log("rz getWorkerTaskInfo=", res.data);
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch workerTaskInfo from service",
      error
    });
  })
);

const ProfileCallTagsSelectField = (props: ProfileCallTagsSelectFieldProps) => {
  const {
    callTagsList,
    setCallTagsList
  } = props;

  const defaultNewCallTag: CallTag[] = [];
  const [newProfileCallTag, setNewProfileCallTag] = React.useState<CallTag[]>(defaultNewCallTag);
  const [callTags, setCallTags] = React.useState([]);
  //const [workerTaskInfo, setWorkerTaskInfo] = React.useState([]);

  React.useEffect(() => {
    if(!callTags.length) {
      getCallTags()
        .then((allCallTags: CallTag[]) => {
          setCallTags(allCallTags);
        })
        .catch(error => console.error(error.msg));
      getWorkerTaskInfo()
      .then((workerTaskInfo: WorkerTaskInfo[]) => {
        //setWorkerTaskInfo(workerTaskInfo);
        console.log("rz workerTaskInfo=", workerTaskInfo);
      })
      .catch(error => console.error(error.msg));
    }
  }, []);

  const profileCallTagsForDropDown = callTags.filter(callTag => {
      return !callTagsList.find(item => {
        return item.options_id === callTag.options_id;
      });
  });

  const newProfileCallTagChanged = (profileCallTag: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedCallTags = profileCallTag.map(selectedCallTag => callTags.find(callTag => selectedCallTag.value === callTag.options_id));
    setNewProfileCallTag(selectedCallTags);
  };

  const addProfileCallTagClicked = () => {
    const updatedCallTagsList = [ ...callTagsList, ...newProfileCallTag ];
    setCallTagsList(updatedCallTagsList);
    setNewProfileCallTag(defaultNewCallTag);
  };

  const removeProfileCallTagClicked = (callTagToBeRemoved: CallTag) => {
    const updatedCallTagsList = callTagsList.filter(callTag => callTag.options_id !== callTagToBeRemoved.options_id);
    setCallTagsList(updatedCallTagsList);
  };

  const getDropDownOptions = (optionsList: CallTag[]) => {
    return optionsList.map(option => ({
      value: option.options_id,
      label: option.display_nme
    }));
  };

  return (
    <ProfileCallTagsControlWrapper>
      <Label>Add Call Tags</Label>
      <ProfileCallTagRow>
        <ProfileCallTagRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getDropDownOptions(profileCallTagsForDropDown)}
            multiple={true}
            value={getDropDownOptions(newProfileCallTag)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newProfileCallTagChanged(newInputValue)}
          />
        </ProfileCallTagRowItem>
        <ProfileCallTagRowItem>
          <IconButtonWrapper disabled={!newProfileCallTag.length} onClick={addProfileCallTagClicked} data-testid="add-profileCallTag-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileCallTagRowItem>
      </ProfileCallTagRow>
      <ProfileCallTagRowSeperator/>
      <ProfileCallTagsWrapper>
        {callTagsList.map((callTag: CallTag, index: number) => {
          return (
            // @ts-ignore
            <ProfileCallTagRow highlightOnHover={true} key={`callTag-row-${index}`}>
              <Tooltip
                title={callTag.display_nme}
                placement={"bottom"}
              >
                <ProfileCallTagRowItem>{callTag.display_nme}</ProfileCallTagRowItem>
              </Tooltip>
              <ProfileCallTagRowItem>
                <IconButtonWrapper onClick={() => removeProfileCallTagClicked(callTag)} data-testid="delete-callTag-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileCallTagRowItem>
            </ProfileCallTagRow>
          );
        })}
      </ProfileCallTagsWrapper>
    </ProfileCallTagsControlWrapper>
  );
};

export default ProfileCallTagsSelectField;