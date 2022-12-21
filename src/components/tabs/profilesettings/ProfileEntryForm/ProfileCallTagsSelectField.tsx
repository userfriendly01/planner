import React from "react";
import { ProfileCallTagsSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileDropdownControlWrapper,
  ProfileDropdownRow,
  ProfileDropdownRowItem,
  ProfileDropdownRowSeperator,
  Label,
  ProfileDropdownWrapper
} from "./ProfileEntryForm.Styles";
import { Dropdown } from "components";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  CallTag,
  CallTagOptions
} from "globals";
import { formatCallTagsName } from "utils";
import {
  getCallTags,
  getCallTagOptions
} from "services";

const ProfileCallTagsSelectField = (props: ProfileCallTagsSelectFieldProps) => {
  const {
    callTagsList,
    callTagOptionsList,
    setCallTagsList
  } = props;

  const defaultNewCallTag: CallTag[] = [];
  const [newProfileCallTag, setNewProfileCallTag] = React.useState<CallTag[]>(defaultNewCallTag);
  const [callTags, setCallTags] = React.useState([]);

  const defaultNewCallTagOptions: CallTagOptions[] = [];
  const [newCallTagOptions, setNewCallTagOptions] = React.useState<CallTagOptions[]>(defaultNewCallTagOptions);
  const [callTagOptions, setCallTagOptions] = React.useState([]);

  React.useEffect(() => {
    if(!callTags.length) {
      getCallTags()
        .then((allCallTags: CallTag[]) => {
          setCallTags(allCallTags);
        })
        .catch(error => console.error(error.msg));
    }
    if(!callTagOptions.length) {
      getCallTagOptions()
        .then((allCallTagOptions: CallTagOptions[]) => {
          setCallTagOptions(allCallTagOptions);
        })
        .catch(error => console.error(error.msg));
    }
  }, []);

  const callTagsForDropDown = callTags.filter(callTag => {
    return !callTagsList.find(item => {
      return item.wrkr_tsk_info_id === callTag.wrkr_tsk_info_id;
    });
  });

  const callTagOptionsForDropdown = callTagOptions.filter(callTagOption => {
    console.log('callTagOptions', callTagOptions);
    console.log('callTagOption', callTagOption);

    return !callTagOptionsList.find(item => {
      return item.options_id === callTagOption.options_id;
    });
  });

  const newCallTagChanged = (profileCallTag: Array<{[index: string]: any, value: number}>) => {
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

  const getCallTagOptionsDropDownOptions = (optionsList: CallTagOptions[]) => {
    console.log('optionsList', optionsList);
    return optionsList.map(option => ({
      value: option.options_id,
      label: option.options_id
    }));
  };

  const newCallTagOptionsChanged = (inputCallTagOptions: { value: number; }, wrkr_tsk_info_id: number) => {
    const selectedCallTagOptions = callTagOptions.find(options => inputCallTagOptions.value === options.options_id);
    console.log('selectedCallTagOptions', selectedCallTagOptions);
    setNewCallTagOptions([selectedCallTagOptions]);

    const updatedCallTagsList = callTagsList.map(callTag => {
      if (callTag.wrkr_tsk_info_id === wrkr_tsk_info_id) {
        callTag.options_id = inputCallTagOptions.value;
        return callTag;
      }
      callTag.options_id = null;
      return callTag;
    });
    setCallTagsList(updatedCallTagsList);
  };

  return (
    <ProfileDropdownControlWrapper>
      <Label>Add Call Tags</Label>
      <ProfileDropdownRow>
        <ProfileDropdownRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getCallTagDropDownOptions(callTagsForDropDown)}
            multiple={true}
            value={getCallTagDropDownOptions(newProfileCallTag)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newCallTagChanged(newInputValue)}
          />
        </ProfileDropdownRowItem>
        <ProfileDropdownRowItem>
          <IconButtonWrapper disabled={!newProfileCallTag.length} onClick={addCallTagClicked} data-testid="add-profileCallTag-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileDropdownRowItem>
      </ProfileDropdownRow>
      <ProfileDropdownRowSeperator/>
      <ProfileDropdownWrapper>
        {callTagsList.map((callTag: CallTag, index: number) => {
          return (
            // @ts-ignore
            <ProfileDropdownRow highlightOnHover={true} key={`callTag-row-${index}`}>
              <ProfileDropdownRowItem>{formatCallTagsName(callTag.wrkr_tsk_info_nme)}</ProfileDropdownRowItem>
              <ProfileDropdownRowItem>
                <Dropdown
                  styles={{
                    "max-width": "380px"
                  }}
                  value={newCallTagOptions}
                  options={getCallTagOptionsDropDownOptions(callTagOptionsForDropdown)}
                  multiple={false}
                  updateValue={(event: any, newInputValue: { value: number; }) => newCallTagOptionsChanged(newInputValue, callTag.wrkr_tsk_info_id)}
                />
              </ProfileDropdownRowItem>
              <ProfileDropdownRowItem>
                <IconButtonWrapper onClick={() => removeCallTagClicked(callTag)} data-testid="delete-callTag-button">
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

export default ProfileCallTagsSelectField;