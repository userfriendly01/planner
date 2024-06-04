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
import { Dropdown } from "components/Dropdown";
import {
  Add,
  Delete,
  Info
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {
  CallTag,
  CallTagOptions
} from "globals/interfaces";
import { logger } from "utils/logger";
import { sortCallTagByName } from "utils/sortUtils";
import { formatCallTagsName } from "utils/profileUtils";
import {
  getCallTags,
  getCallTagOptions
} from "services/callTags";

export const ProfileCallTagsSelectField = (props: ProfileCallTagsSelectFieldProps) => {
  const {
    callTagsList,
    callTagOptionsList,
    setCallTagsList
  } = props;

  const defaultNewCallTag: CallTag[] = [];
  const [newProfileCallTag, setNewProfileCallTag] = React.useState<CallTag[]>(defaultNewCallTag);
  const [callTags, setCallTags] = React.useState([]);
  const [callTagOptions, setCallTagOptions] = React.useState([]);

  React.useEffect(() => {
    if(!callTags.length) {
      getCallTags()
        .then((allCallTags: CallTag[]) => {
          setCallTags(allCallTags);
        })
        .catch(error => logger.error(error.msg, { error }, false));
    }
    if(!callTagOptions.length) {
      getCallTagOptions()
        .then((allCallTagOptions: CallTagOptions[]) => {
          setCallTagOptions(allCallTagOptions);
        })
        .catch(error => logger.error(error.msg, { error }, false));
    }
  }, []);

  const callTagsForDropDown = callTags.filter(callTag => {
    return !callTagsList.find(item => {
      return item.wrkr_tsk_info_id === callTag.wrkr_tsk_info_id;
    });
  });

  const callTagOptionsForDropdown = callTagOptions.filter(callTagOption => {
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
    return optionsList.sort(sortCallTagByName).map(option => ({
      value: option.wrkr_tsk_info_id,
      label: formatCallTagsName(option.wrkr_tsk_info_nme)
    }));
  };

  const getCallTagOptionsDropDownOptions = (optionsList: CallTagOptions[]) => {
    return optionsList.map(option => ({
      value: option.options_id,
      label: option.options_id
    }));
  };

  const callTagOptionsChanged = (inputCallTagOptions: { value: any; }, wrkr_tsk_info_id: number) => {
    const updatedCallTagsList = callTagsList.map(callTag => {
      if (callTag.wrkr_tsk_info_id === wrkr_tsk_info_id) {
        callTag.options_id = inputCallTagOptions !== null ? inputCallTagOptions.value : null;
        return callTag;
      }
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
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newCallTagChanged(newInputValue)} />
        </ProfileDropdownRowItem>
        <ProfileDropdownRowItem>
          <IconButtonWrapper disabled={!newProfileCallTag.length} onClick={addCallTagClicked} data-testid="add-profileCallTag-button">
            <Add fontSize={"inherit"} />
          </IconButtonWrapper>
          <IconButtonWrapper data-testid="tooltip-profileCallTag-button">
            <Tooltip key={"callTagTooltip"} placement="top" title={<span style={{ whiteSpace: "pre-line" }}>{callTagOptions.filter(option => option.options_id !== null).map(option => option.options_id + ") " + option.options + "\n\n")}</span>}>
              <Info fontSize={"inherit"} />
            </Tooltip>
          </IconButtonWrapper>
        </ProfileDropdownRowItem>
      </ProfileDropdownRow>
      <ProfileDropdownRowSeperator />
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
                  value={callTag.options_id}
                  options={getCallTagOptionsDropDownOptions(callTagOptionsForDropdown)}
                  multiple={false}
                  updateValue={(event: any, newInputValue: { value: number; }) => callTagOptionsChanged(newInputValue, callTag.wrkr_tsk_info_id)} />
              </ProfileDropdownRowItem>
              <ProfileDropdownRowItem>
                <IconButtonWrapper onClick={() => removeCallTagClicked(callTag)} data-testid="delete-callTag-button">
                  <Delete fontSize="inherit" />
                </IconButtonWrapper>
              </ProfileDropdownRowItem>
            </ProfileDropdownRow>
          );
        })}
      </ProfileDropdownWrapper>
    </ProfileDropdownControlWrapper>
  );
};