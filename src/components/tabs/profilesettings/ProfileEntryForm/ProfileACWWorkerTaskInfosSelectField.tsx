import React from "react";
import { ProfileACWWorkerTaskInfosSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileACWWorkerTaskInfosControlWrapper,
  ProfileACWWorkerTaskInfoRow,
  ProfileACWWorkerTaskInfoRowItem,
  ProfileACWWorkerTaskInfoRowSeperator,
  Label,
  ProfileACWWorkerTaskInfosWrapper
} from "./ProfileEntryForm.Styles";
import { Dropdown } from "components";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  ACWWorkerTaskInfo,
  apiPaths
} from "globals";
import { Tooltip } from "@mui/material";
import { myAxios } from "utils";

console.log("rz before getACWWorkerTaskInfos");
const getACWWorkerTaskInfos = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_PROFILE_WORKER_TASK_INFO)
  .then(res => {
    console.log("rz getACWWorkerTaskInfos=", res.data);
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch ACWWorkerTaskInfos from service",
      error
    });
  })
);

const ProfileACWWorkerTaskInfosSelectField = (props: ProfileACWWorkerTaskInfosSelectFieldProps) => {
  const {
    acwWorkerTaskInfosList,
    setACWWorkerTaskInfosList
  } = props;

  const defaultNewACWWorkerTaskInfo: ACWWorkerTaskInfo[] = [];
  const [newProfileACWWorkerTaskInfo, setNewProfileACWWorkerTaskInfo] = React.useState<ACWWorkerTaskInfo[]>(defaultNewACWWorkerTaskInfo);
  const [acwWorkerTaskInfos, setACWWorkerTaskInfos] = React.useState([]);

  React.useEffect(() => {
    if(!acwWorkerTaskInfos.length) {
      getACWWorkerTaskInfos()
        .then((allACWWorkerTaskInfos: ACWWorkerTaskInfo[]) => {
          setACWWorkerTaskInfos(allACWWorkerTaskInfos);
        })
        .catch(error => console.error(error.msg));
    }
  }, []);

  const profileACWWorkerTaskInfosForDropDown = acwWorkerTaskInfos.filter(acwWorkerTaskInfo => {
      return !acwWorkerTaskInfosList.find(item => {
        return item.options_id === acwWorkerTaskInfo.options_id;
      });
  });

  const newProfileACWWorkerTaskInfoChanged = (profileACWWorkerTaskInfo: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedACWWorkerTaskInfos = profileACWWorkerTaskInfo.map(selectedACWWorkerTaskInfo => acwWorkerTaskInfos.find(acwWorkerTaskInfo => selectedACWWorkerTaskInfo.value === acwWorkerTaskInfo.options_id));
    setNewProfileACWWorkerTaskInfo(selectedACWWorkerTaskInfos);
  };

  const addProfileACWWorkerTaskInfoClicked = () => {
    const updatedACWWorkerTaskInfosList = [ ...acwWorkerTaskInfosList, ...newProfileACWWorkerTaskInfo ];
    setACWWorkerTaskInfosList(updatedACWWorkerTaskInfosList);
    setNewProfileACWWorkerTaskInfo(defaultNewACWWorkerTaskInfo);
  };

  const removeProfileACWWorkerTaskInfoClicked = (acwWorkerTaskInfoToBeRemoved: ACWWorkerTaskInfo) => {
    const updatedACWWorkerTaskInfosList = acwWorkerTaskInfosList.filter(acwWorkerTaskInfo => acwWorkerTaskInfo.options_id !== acwWorkerTaskInfoToBeRemoved.options_id);
    setACWWorkerTaskInfosList(updatedACWWorkerTaskInfosList);
  };

  const getDropDownOptions = (optionsList: ACWWorkerTaskInfo[]) => {
    return optionsList.map(option => ({
      value: option.options_id,
      label: option.display_nme
    }));
  };

  return (
    <ProfileACWWorkerTaskInfosControlWrapper>
      <Label>Add ACW Options</Label>
      <ProfileACWWorkerTaskInfoRow>
        <ProfileACWWorkerTaskInfoRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getDropDownOptions(profileACWWorkerTaskInfosForDropDown)}
            multiple={true}
            value={getDropDownOptions(newProfileACWWorkerTaskInfo)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newProfileACWWorkerTaskInfoChanged(newInputValue)}
          />
        </ProfileACWWorkerTaskInfoRowItem>
        <ProfileACWWorkerTaskInfoRowItem>
          <IconButtonWrapper disabled={!newProfileACWWorkerTaskInfo.length} onClick={addProfileACWWorkerTaskInfoClicked} data-testid="add-profileACWWorkerTaskInfo-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileACWWorkerTaskInfoRowItem>
      </ProfileACWWorkerTaskInfoRow>
      <ProfileACWWorkerTaskInfoRowSeperator/>
      <ProfileACWWorkerTaskInfosWrapper>
        {acwWorkerTaskInfosList.map((acwWorkerTaskInfo: ACWWorkerTaskInfo, index: number) => {
          return (
            // @ts-ignore
            <ProfileACWWorkerTaskInfoRow highlightOnHover={true} key={`acwWorkerTaskInfo-row-${index}`}>
              <Tooltip
                title={acwWorkerTaskInfo.display_nme}
                placement={"bottom"}
              >
                <ProfileACWWorkerTaskInfoRowItem>{acwWorkerTaskInfo.display_nme}</ProfileACWWorkerTaskInfoRowItem>
              </Tooltip>
              <ProfileACWWorkerTaskInfoRowItem>
                <IconButtonWrapper onClick={() => removeProfileACWWorkerTaskInfoClicked(acwWorkerTaskInfo)} data-testid="delete-acwWorkerTaskInfo-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileACWWorkerTaskInfoRowItem>
            </ProfileACWWorkerTaskInfoRow>
          );
        })}
      </ProfileACWWorkerTaskInfosWrapper>
    </ProfileACWWorkerTaskInfosControlWrapper>
  );
};

export default ProfileACWWorkerTaskInfosSelectField;