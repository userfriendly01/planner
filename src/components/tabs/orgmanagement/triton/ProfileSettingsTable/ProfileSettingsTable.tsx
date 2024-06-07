import { checkIfPO } from "authentication/authUtils";
import React from "react";
import {
  BubbleDiv,
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  HighlightRed,
  TableText,
  StyledPaper,
  TableContainer,
  TableDataFlex,
  IconWrapper
} from "./ProfileSettingsTable.Styles";
import { sortProfilesById } from "utils/_sortUtils";
import { formatTenDigitNumber } from "utils/numberUtils";
import {
  formatAggregateQueues,
  formatProfileBooleanData,
  formatProfileACWDataEntry,
  formatSimpleText,
  formatActivityData,
  formatSelfServiceIndicatorData
} from "utils/profileUtils";
import { Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  profileTableColumnHeader,
  formModes
} from "globals/index";
import { profileEntryFormDispatch } from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";

interface ProfileSettingsTableProps {
  profileList: any[],
  setProfileModalState: (payload: any) => void,
  loggedInUser: any
}
export const ProfileSettingsTable = (props: ProfileSettingsTableProps) => {
  const {
    profileList,
    setProfileModalState,
    loggedInUser
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
    <TableContainer>
      <StyledPaper elevation={3}>
        <CustomTable>
          <thead>
            <tr>
              {
                profileTableColumnHeader.map(entry => {
                  return(
                    <Tooltip key={entry.COLUMN_NAME} placement="top" title={entry.TOOLTIP}>
                      <CustomTableHeader data-testid="table-header">{entry.COLUMN_NAME}</CustomTableHeader>
                    </Tooltip>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              profileList.sort(sortProfilesById).map(profile => {
                return(
                  <CustomTableRow key={profile.profile_id} data-testid="table-row">
                    <CustomTableData>
                      <TableText>{profile.profile_id}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.profile_nme}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.recorded_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.auto_answd_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.pmt_prcsg_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.otbnd_recorded_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.acw_option_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.manual_recorded_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileACWDataEntry(profile.acw_data_entry_i.data[0], profile.callTags.filter((data: any) => data.profile_id === profile.profile_id), BubbleDiv, HighlightRed)}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.manual_record_inbound_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.agent_assisted_pay_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatSimpleText(profile.overflow_skill)}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.policy_number_edit_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.voice_mail_transcription_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.click_to_dial_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.call_reason_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.eft_authorization_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.claim_number_edit_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatSelfServiceIndicatorData(profile.profile_id)}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableDataFlex>
                        {
                          profile.activities.map((activity: any) => {
                            return <div key={`${activity.activity_nme}`}>{formatActivityData(activity.activity_nme, BubbleDiv)}</div>;
                          })
                        }
                      </TableDataFlex>
                    </CustomTableData>
                    <CustomTableData>
                      <TableDataFlex>
                        {formatAggregateQueues(profile.aggregateQueues, BubbleDiv)}
                      </TableDataFlex>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatSimpleText(profile?.access_group_nme)}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatSimpleText(profile?.operating_unit_nme)}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText style={{ "textWrap": "nowrap" }}>{profile.fwd_to_num ? formatTenDigitNumber(profile.fwd_to_num) : ""}</TableText>
                    </CustomTableData>
                    {
                      checkIfPO(loggedInUser) ?
                        <CustomTableData>
                          <IconWrapper onClick={editButtonOnClick(profile)} data-testid="edit-button">
                            <Edit fontSize={"inherit"}/>
                          </IconWrapper>
                        </CustomTableData>
                        : <CustomTableData />
                    }
                  </CustomTableRow>
                );
              })
            }
          </tbody>
        </CustomTable>
      </StyledPaper>
    </TableContainer>
  );
};