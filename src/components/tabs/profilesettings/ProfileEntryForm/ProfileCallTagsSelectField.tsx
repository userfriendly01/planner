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
import {
  myAxios,
  formatCallTagsName
} from "utils";

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

  const callTagsForDropDown = callTags.filter(callTag => {
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

  const newCallTagChanged = (profileCallTag: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedCallTags = profileCallTag.map(selectedCallTag => callTags.find(callTag => selectedCallTag.value === callTag.wrkr_tsk_info_id));
    setNewProfileCallTag(selectedCallTags);
  };

  const addCallTagClicked = () => {
    const updatedCallTagsList = [ ...callTagsList, ...newProfileCallTag ];
    setCallTagsList(updatedCallTagsList);
    setNewProfileCallTag(defaultNewCallTag);
  };

  const removeCallTagClicked = (callTagToBeRemoved: CallTag) => {
    const updatedCallTagsList = callTagsList.filter(callTag => callTag.wrkr_tsk_info_id !== callTagToBeRemoved.wrkr_tsk_info_id);
    setCallTagsList(updatedCallTagsList);
  };

  const getCallTagDropDownOptions = (optionsList: CallTag[]) => {
    return optionsList.map(option => ({
      value: option.wrkr_tsk_info_id,
      label: formatCallTagsName(option.wrkr_tsk_info_nme)
    }));
  };

  const getCallTagOptionsDropDownOptions = (optionsList: WorkerTaskInfoOptions[]) => {
    console.log("rz getCallTagOptionsDropDownOptions optionsList=", optionsList);
    return optionsList.map(option => ({
      value: option.options_id,
      label: option.options_id
    }));
  };

  const newWorkerTaskInfoOptionsChanged = (inputWorkerTaskInfoOptions: {
    [index: string]: any,
    value: number
  },
  wrkr_tsk_info_id: number
  ) => {
    console.log("rz newWorkerTaskInfoOptionsChanged() workerTaskInfoOptions=", inputWorkerTaskInfoOptions);
    console.log("rz newWorkerTaskInfoOptionsChanged() workerTaskInfoOptions is map?=", inputWorkerTaskInfoOptions instanceof Map);
    //const selectedWorkerTaskInfoOptions = inputWorkerTaskInfoOptions.map(selectedWorkerTaskInfo => workerTaskInfoOptions.find(options => selectedWorkerTaskInfo.value === options.options_id));
    const selectedWorkerTaskInfoOptions = workerTaskInfoOptions.find(options => inputWorkerTaskInfoOptions.value === options.options_id);
    setNewWorkerTaskInfoOptions(selectedWorkerTaskInfoOptions);

    const updatedCallTagsList = callTagsList.map(callTag => {
      if(callTag.wrkr_tsk_info_id !== wrkr_tsk_info_id){
        callTag.options_id = inputWorkerTaskInfoOptions[0].value;
        return callTag;
      }
      callTag.options_id = null
      return callTag

    });
    setCallTagsList(updatedCallTagsList);
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
            options={getCallTagDropDownOptions(callTagsForDropDown)}
            multiple={true}
            value={getCallTagDropDownOptions(newProfileCallTag)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newCallTagChanged(newInputValue)}
          />
        </ProfileCallTagRowItem>
        <ProfileCallTagRowItem>
          <IconButtonWrapper disabled={!newProfileCallTag.length} onClick={addCallTagClicked} data-testid="add-profileCallTag-button">
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
              <ProfileCallTagRowItem>{formatCallTagsName(callTag.wrkr_tsk_info_nme)}</ProfileCallTagRowItem>
              <ProfileCallTagRowItem>
                    <Dropdown
                      styles={{
                        "max-width": "380px"
                      }}
                      value={getCallTagOptionsDropDownOptions(newWorkerTaskInfoOptions)}
                      options={getCallTagOptionsDropDownOptions(callTagOptions)}
                      multiple={false}
                      updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newWorkerTaskInfoOptionsChanged(newInputValue, callTag.wrkr_tsk_info_id)}
                    />                      
              </ProfileCallTagRowItem>
              <ProfileCallTagRowItem>
                <IconButtonWrapper onClick={() => removeCallTagClicked(callTag)} data-testid="delete-callTag-button">
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