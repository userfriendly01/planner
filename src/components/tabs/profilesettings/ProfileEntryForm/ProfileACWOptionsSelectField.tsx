import React from "react";
import { ProfileACWOptionsSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileACWOptionsControlWrapper,
  ProfileACWOptionRow,
  ProfileACWOptionRowItem,
  ProfileACWOptionRowSeperator,
  Label,
  ProfileACWOptionsWrapper
} from "./ProfileEntryForm.Styles";
import { Dropdown } from "components";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  ACWOption,
  apiPaths
} from "globals";
import { Tooltip } from "@mui/material";
import { myAxios } from "utils";

console.log("rz before getACWOptions");
const getACWOptions = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_PROFILE_WORKER_TASK_INFO)
  .then(res => {
    console.log("rz getACWOptions=", res.data);
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch ACWOptions from service",
      error
    });
  })
);

const ProfileACWOptionsSelectField = (props: ProfileACWOptionsSelectFieldProps) => {
  const {
    acwOptionsList,
    setACWOptionsList
  } = props;

  const defaultNewACWOption: ACWOption[] = [];
  const [newProfileACWOption, setNewProfileACWOption] = React.useState<ACWOption[]>(defaultNewACWOption);
  const [acwOptions, setACWOptions] = React.useState([]);

  React.useEffect(() => {
    if(!acwOptions.length) {
      getACWOptions()
        .then((allACWOptions: ACWOption[]) => {
          setACWOptions(allACWOptions);
        })
        .catch(error => console.error(error.msg));
    }
  }, []);

  const profileACWOptionsForDropDown = acwOptions.filter(acwOption => {
      return !acwOptionsList.find(item => {
        return item.options_id === acwOption.options_id;
      });
  });

  const newProfileACWOptionChanged = (profileACWOption: Array<{
    [index: string]: any,
    value: number
  }>) => {
    const selectedACWOptions = profileACWOption.map(selectedACWOption => acwOptions.find(acwOption => selectedACWOption.value === acwOption.options_id));
    setNewProfileACWOption(selectedACWOptions);
  };

  const addProfileACWOptionClicked = () => {
    const updatedACWOptionsList = [ ...acwOptionsList, ...newProfileACWOption ];
    setACWOptionsList(updatedACWOptionsList);
    setNewProfileACWOption(defaultNewACWOption);
  };

  const removeProfileACWOptionClicked = (acwOptionToBeRemoved: ACWOption) => {
    const updatedACWOptionsList = acwOptionsList.filter(acwOption => acwOption.options_id !== acwOptionToBeRemoved.options_id);
    setACWOptionsList(updatedACWOptionsList);
  };

  const getDropDownOptions = (optionsList: ACWOption[]) => {
    return optionsList.map(option => ({
      value: option.options_id,
      label: option.display_nme
    }));
  };

  return (
    <ProfileACWOptionsControlWrapper>
      <Label>Add ACW Options</Label>
      <ProfileACWOptionRow>
        <ProfileACWOptionRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getDropDownOptions(profileACWOptionsForDropDown)}
            multiple={true}
            value={getDropDownOptions(newProfileACWOption)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newProfileACWOptionChanged(newInputValue)}
          />
        </ProfileACWOptionRowItem>
        <ProfileACWOptionRowItem>
          <IconButtonWrapper disabled={!newProfileACWOption.length} onClick={addProfileACWOptionClicked} data-testid="add-profileACWOption-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileACWOptionRowItem>
      </ProfileACWOptionRow>
      <ProfileACWOptionRowSeperator/>
      <ProfileACWOptionsWrapper>
        {acwOptionsList.map((acwOption: ACWOption, index: number) => {
          return (
            // @ts-ignore
            <ProfileACWOptionRow highlightOnHover={true} key={`acwOption-row-${index}`}>
              <Tooltip
                title={acwOption.display_nme}
                placement={"bottom"}
              >
                <ProfileACWOptionRowItem>{acwOption.display_nme}</ProfileACWOptionRowItem>
              </Tooltip>
              <ProfileACWOptionRowItem>
                <IconButtonWrapper onClick={() => removeProfileACWOptionClicked(acwOption)} data-testid="delete-acwOption-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileACWOptionRowItem>
            </ProfileACWOptionRow>
          );
        })}
      </ProfileACWOptionsWrapper>
    </ProfileACWOptionsControlWrapper>
  );
};

export default ProfileACWOptionsSelectField;