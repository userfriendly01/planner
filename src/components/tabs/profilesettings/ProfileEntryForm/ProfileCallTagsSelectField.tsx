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
  WorkerTaskInfoOptions,
  apiPaths
} from "globals";
import { Tooltip } from "@mui/material";
import { myAxios } from "utils";

console.log("rz before getCallTags");
const getCallTagOptions = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_WORKER_TASK_INFO_OPTIONS)
  .then(res => {
    console.log("rz getCallTagOptions=", res.data);
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch getCallTagOptions from service",
      error
    });
  })
);

console.log("rz before getCallTags");
const getCallTags = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_WORKER_TASK_INFO)
  .then(res => {
    console.log("rz getCallTags=", res.data);
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch getCallTags from service",
      error
    });
  })
);

const ProfileCallTagsSelectField = (props: ProfileCallTagsSelectFieldProps) => {
  const {
    callTagsList,
    workerTaskInfoOptionsList,
    setCallTagsList
  } = props;

  const defaultNewCallTag: CallTag[] = [];
  const [newProfileCallTag, setNewProfileCallTag] = React.useState<CallTag[]>(defaultNewCallTag);
  const [callTags, setCallTags] = React.useState([]);
  const defaultNewWorkerTaskInfoOptions: WorkerTaskInfoOptions[] = [];
  const [newWorkerTaskInfoOptions, setNewWorkerTaskInfoOptions] = React.useState<WorkerTaskInfoOptions[]>(defaultNewWorkerTaskInfoOptions);
  const [workerTaskInfoOptions, setWorkerTaskInfoOptions] = React.useState([]);
  
  React.useEffect(() => {
    if(!callTags.length) {
      getCallTags()
        .then((allCallTags: CallTag[]) => {
          setCallTags(allCallTags);
        })
        .catch(error => console.error(error.msg));
    }
    if(!workerTaskInfoOptions.length) {
      getCallTagOptions()
      .then((workerTaskInfoOptions: WorkerTaskInfoOptions[]) => {
        setWorkerTaskInfoOptions(workerTaskInfoOptions);
      })
      .catch(error => console.error(error.msg));
    }
  }, []);

  const profileCallTagsForDropDown = callTags.filter(callTag => {
    console.log("rz callTagsList=", callTagsList);
    console.log("rz workerTaskInfoOptions=", workerTaskInfoOptions);
    console.log("rz workerTaskInfoList=", workerTaskInfoOptionsList);
    return !callTagsList.find(item => {
        return item.wrkr_tsk_info_id === callTag.wrkr_tsk_info_id;
      });
  });

  const callTagOptions = workerTaskInfoOptions.filter(workerTaskInfoOption => {
    console.log("rz callTagOptions workerTaskInfoOptions=", workerTaskInfoOptions);
    console.log("rz callTagOptions workerTaskInfoOption=", workerTaskInfoOption);
    return !workerTaskInfoOptionsList.find(item => {
      console.log(`rz callTagOptions item=${item}, workerTaskInfoOption=${workerTaskInfoOption}`);
      console.log("rz callTagOptions item.wrkr_tsk_info_id === workerTaskInfoOption.wrkr_tsk_info_id=", item.options_id === workerTaskInfoOption.options_id);
      return item.options_id === workerTaskInfoOption.options_id;
    });
  });

  console.log("rz callTagOptions=", callTagOptions);

  const newProfileCallTagChanged = (profileCallTag: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedCallTags = profileCallTag.map(selectedCallTag => callTags.find(callTag => selectedCallTag.value === callTag.options_id));
    setNewProfileCallTag(selectedCallTags);
  };

  const newWorkerTaskInfoOptionsChanged = (workerTaskInfoOptions: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedWorkerTaskInfoOptions = workerTaskInfoOptions.map(selectedWorkerTaskInfo => callTags.find(callTag => selectedWorkerTaskInfo.value === callTag.options_id));
    setNewWorkerTaskInfoOptions(selectedWorkerTaskInfoOptions);
  };

  const addProfileCallTagClicked = () => {
    const updatedCallTagsList = [ ...callTagsList, ...newProfileCallTag ];
    setCallTagsList(updatedCallTagsList);
    setNewProfileCallTag(defaultNewCallTag);
  };

  const addWorkerTaskInfoOptionsClicked = () => {
    const updatedWorkerTaskInfoOptions = [ ...workerTaskInfoOptions, ...newWorkerTaskInfoOptions ];
    setCallTagsList(updatedWorkerTaskInfoOptions);
    setNewWorkerTaskInfoOptions(defaultNewWorkerTaskInfoOptions);
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

  const getCallTagOptionsDropDownOptions = (optionsList: WorkerTaskInfoOptions[]) => {
    console.log("rz getCallTagOptionsDropDownOptions optionsList=", optionsList);
    return optionsList.map(option => ({
      value: option.options_id,
      label: option.options
    }));
  };

  console.log("rz getCallTagOptionsDropDownOptions(callTagOptions)=", callTagOptions);

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
                      options={getCallTagOptionsDropDownOptions(callTagOptions)}
                      multiple={false}
                      updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newWorkerTaskInfoOptionsChanged(newInputValue)}
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