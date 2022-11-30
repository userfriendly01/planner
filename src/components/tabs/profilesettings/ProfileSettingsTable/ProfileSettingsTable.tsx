import React from "react";
import {
  StyledProfileTable,
  ProfileTableData,
  ProfileTableHeader,
  ProfilesTableRow,
  ProfileSettingsTableProps,
  StyledProfilesPaper,
  ProfilesTableContainer,
  ProfilesTableDataFlex,
  ProfilesTableText,
  IconWrapper
} from "./";
import {
  checkIfPO,
  formatProfileBooleanData,
  formatOverflowSkillData,
  formatActivityData,
  sortProfilesById
} from "utils";
import { Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  profileTableColumnHeader,
  formModes
} from "globals";
import {
  profileEntryFormDispatch,
  profileEntryFormActions
} from "context";

const ProfileSettingsTable = (props: ProfileSettingsTableProps) => {
  const {
    profileList,
    loggedInRep,
    setProfileModalState
  } = props;
  const setForm = profileEntryFormDispatch();

  const editButtonOnClick = (profile: any) => (event: any) => {
    event.stopPropagation();
    setForm({
      type: profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE,
      payload: {
        formMode: formModes.UPDATE,
        profile
      }
    });
    setProfileModalState({
      open: true
    });
  };

  return(
    <ProfilesTableContainer>
      <StyledProfilesPaper elevation={3}>
        <StyledProfileTable>
          <thead>
            <tr>
              {
                profileTableColumnHeader.map(entry => {
                  return(
                    <Tooltip key={entry.COLUMN_NAME} placement="top" title={entry.TOOLTIP}>
                      <ProfileTableHeader key={entry.COLUMN_NAME} data-testid="table-header">{entry.COLUMN_NAME}</ProfileTableHeader>
                    </Tooltip>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              profileList.sort(sortProfilesById).map((profile: any) => {
                return(
                  <ProfilesTableRow key={profile.profile_id} data-testid="table-row">
                    <ProfileTableData>
                      <ProfilesTableText>{profile.profile_id}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{profile.profile_nme}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.recorded_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.auto_answd_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.pmt_prcsg_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.otbnd_recorded_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.acw_option_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.manual_recorded_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.acw_data_entry_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.manual_record_inbound_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.agent_assisted_pay_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatOverflowSkillData(profile.overflow_skill)}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.policy_number_edit_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableText>{formatProfileBooleanData(profile.voice_mail_transcription_i.data[0])}</ProfilesTableText>
                    </ProfileTableData>
                    <ProfileTableData>
                      <ProfilesTableDataFlex>
                        {
                          JSON.parse(profile.activities).map((activity: any) => {
                            return formatActivityData(activity.name);
                          })
                        }
                      </ProfilesTableDataFlex>
                    </ProfileTableData>
                    {
                      checkIfPO(loggedInRep) ?
                        <ProfileTableData>
                          <IconWrapper
                            radius="10px"
                            onClick={editButtonOnClick(profile)} data-testid="edit-button">
                            <Edit fontSize={"inherit"}/>
                          </IconWrapper>
                        </ProfileTableData>
                        : <ProfileTableData />
                    }
                  </ProfilesTableRow>
                );
              })
            }
          </tbody>
        </StyledProfileTable>
      </StyledProfilesPaper>
    </ProfilesTableContainer>
  );
};

export default ProfileSettingsTable;
