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
    workerTaskInfo,
    setCallTagsList
  } = props;


  const defaultNewCallTag: CallTag[] = [];
  const [newProfileCallTag, setNewProfileCallTag] = React.useState<CallTag[]>(defaultNewCallTag);
  const [callTags, setCallTags] = React.useState([]);
  const defaultNewWorkerTaskInfo: WorkerTaskInfo[] = [];
  const [newWorkerTaskInfo, setNewWorkerTaskInfo] = React.useState<WorkerTaskInfo[]>(defaultNewWorkerTaskInfo);
  
  React.useEffect(() => {
    if(!callTags.length) {
      getCallTags()
        .then((allCallTags: CallTag[]) => {
          setCallTags(allCallTags);
        })
        .catch(error => console.error(error.msg));
    }
    if(!workerTaskInfo.length) {
      getWorkerTaskInfo()
      .then((workerTaskInfo: WorkerTaskInfo[]) => {
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

  const workerTaskInfoForDropDown = workerTaskInfo.filter(workerTaskInfoOption => {
    console.log("rz workerTaskInfoForDropDown workerTaskInfo=", workerTaskInfo);
    console.log("rz workerTaskInfoForDropDown workerTaskInfoOption=", workerTaskInfoOption);
    return !workerTaskInfo.find(item => {
      return item.wrkr_tsk_info_id === workerTaskInfoOption.wrkr_tsk_info_id;
    });
});

  const newProfileCallTagChanged = (profileCallTag: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedCallTags = profileCallTag.map(selectedCallTag => callTags.find(callTag => selectedCallTag.value === callTag.options_id));
    setNewProfileCallTag(selectedCallTags);
  };

  const newWorkerTaskInfoChanged = (workerTaskInfo: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedWorkerTaskInfo = workerTaskInfo.map(selectedWorkerTaskInfo => callTags.find(callTag => selectedWorkerTaskInfo.value === callTag.options_id));
    setNewProfileCallTag(selectedWorkerTaskInfo);
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

  const getworkerTaskInfoDropDownOptions = (optionsList: WorkerTaskInfo[]) => {
    console.log("rz getworkerTaskInfoDropDownOptions optionsList=", optionsList);
    return optionsList.map(option => ({
      value: option.wrkr_tsk_info_id,
      label: option.wrkr_tsk_info_nme
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
                    <Dropdown
                      styles={{
                        "max-width": "380px"
                      }}
                      options={getworkerTaskInfoDropDownOptions(workerTaskInfoForDropDown)}
                      multiple={false}
                      updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newWorkerTaskInfoChanged(newInputValue)}
                    />                      
              </ProfileCallTagRowItem>
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