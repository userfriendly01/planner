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
  formatTransferQueues,
  formatProfileACWDataEntry,
  formatSelfServiceIndicatorData,
  profileTableColumnHeader
} from "utils/profileUtils";
import { Tooltip } from "@mui/material";
import {
  Check, Edit
} from "@mui/icons-material";
import { formModes } from "globals";
import {
  profileEntryFormDispatch, useAdminState,
  useSkillState
} from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import {
  Activity, UMSoftphoneConfiguration
} from "globals/interfaces";

interface ProfileSettingsTableProps {
  setProfileModalState: (payload: any) => void,
  loggedInUser: any
}
export const ProfileSettingsTable = (props: ProfileSettingsTableProps) => {
  const {
    setProfileModalState,
    loggedInUser
  } = props;

  const setForm = profileEntryFormDispatch();
  const {
    activities,
    profiles
  } = useAdminState().profileContext;
  const { taskQueues } = useSkillState();

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
              profiles.sort(sortProfilesById).map((profile: UMSoftphoneConfiguration) => {
                return(
                  <CustomTableRow key={profile.profile_id} data-testid="table-row">
                    <CustomTableData>
                      <TableText>{profile.profile_id}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.profile_name}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.ou_name || ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.inbnd_rec ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.outbnd_rec ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.man_inbnd_rec ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.man_outbnd_rec ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.auto_ans ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.takes_paymnts ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.agnt_asst_pay ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.edt_policy_num ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.voice_mail_trans ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.clk_to_dial ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.call_reason? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.eft_auth ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.edt_claim_num ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatSelfServiceIndicatorData(profile.profile_id)}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.acw_option ? <Check /> : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileACWDataEntry(profile.acw_tags, profile.call_tags, BubbleDiv, HighlightRed)}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableDataFlex>
                        {
                          profile?.activities?.map((ac: Activity) => {
                            const activity: Partial<Activity> = activities?.find((a: Activity) => a.activity_sid ===  ac.activity_sid) || { activity_name: "Unknown" };
                            return <div key={`${activity.activity_name}`}>{<BubbleDiv>{activity.activity_name}</BubbleDiv>}</div>;
                          })
                        }
                      </TableDataFlex>
                    </CustomTableData>
                    <CustomTableData>
                      <TableDataFlex>
                        {formatTransferQueues(profile.transfer_queues, taskQueues, BubbleDiv)}
                      </TableDataFlex>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.overflow_skill || ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText style={{ "textWrap": "nowrap" }}>{profile.fwd_to_num ? formatTenDigitNumber(profile.fwd_to_num) : ""}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{profile.accessGroup?.access_group_nme || ""}</TableText>
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