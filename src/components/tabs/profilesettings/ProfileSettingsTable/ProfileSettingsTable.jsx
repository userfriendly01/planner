import React from "react";
import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  TableText,
  StyledPaper,
  TableContainer,
  TableDataFlex,
  IconWrapper
} from "./ProfileSettingsTable.Styles";
import {
  checkIfPO,
  formatProfileBooleanData,
  formatProfileACWDataEntry,
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
import { getWorkerTaskInfo as getWorkerTaskInfoServiceCall, getProfileWorkerTaskInfo as getProfileWorkerTaskInfoServiceCall} from "services";

const getWorkerTaskInfo = async () => {
  try {
    return await getWorkerTaskInfoServiceCall();
  } catch (error) {
    throw ({
      msg: "Failed to fetch worker task info from service",
      error
    });
  }
};

const getProfileWorkerTaskInfo = async () => {
  try {
    return await getProfileWorkerTaskInfoServiceCall();
  } catch (error) {
    throw ({
      msg: "Failed to fetch profile worker task info from service",
      error
    });
  }
};

const ProfileSettingsTable = props => {
  const { profileList, loggedInRep, setProfileModalState } = props;
  console.log("rz profileList=", profileList);
  const setForm = profileEntryFormDispatch();
  const [workerTaskInfo, setWorkerTaskInfo] = React.useState([]);

  const editButtonOnClick = profile => event => {
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

  React.useEffect(() => {
    if(!workerTaskInfo.length) {
      getWorkerTaskInfo()
        .then((allWorkerTaskInfo) => {
          setWorkerTaskInfo(allWorkerTaskInfo);
        })
        .catch(error => console.error("ERROR:", error.msg));
      getProfileWorkerTaskInfo()
      .then((allWorkerTaskInfo) => {
        setProfileWorkerTaskInfo(allWorkerTaskInfo);
      })
      .catch(error => console.error("ERROR:", error.msg));
    }
  }, []);

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
                      <TableText>{formatProfileACWDataEntry(profile.acw_data_entry_i.data[0], workerTaskInfo.filter(data => data.profile_id === profile.profile_id))}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.manual_record_inbound_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.agent_assisted_pay_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatOverflowSkillData(profile.overflow_skill)}</TableText>
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
                      <TableDataFlex>
                        {
                          profile.activities.map(activity => {
                            return <div key={`${activity.name}`}>{formatActivityData(activity.name)}</div>;
                          })
                        }
                         
                      </TableDataFlex>
                    </CustomTableData>
                    {
                      checkIfPO(loggedInRep) ?
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

export default ProfileSettingsTable;
