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
  formatOverflowSkillData,
  formatActivityData,
  sortProfilesById
} from "utils";
import { Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  profileTableColumnHeader,
  formModes,
  apiPaths
} from "globals";
import {
  profileEntryFormDispatch,
  profileEntryFormActions
} from "context";

const getWorkerTaskInfo = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_PROFILE_WORKER_TASK_INFO)
  .then(res => {
    console.log('res', res)
    console.log('res.data', res.data)

    resolve(res.data);
  })
  .catch(error => {
    console.error('Failed to fetch worker task info from service')
    reject({
      msg: "Failed to fetch worker task info from service",
      error
    });
  })
);

const ProfileSettingsTable = props => {
  const { profileList, loggedInRep, setProfileModalState } = props;
  const setForm = profileEntryFormDispatch();
  const [workerTaskInfo, setWorkerTaskInfo] = React.useState([]);

  const editButtonOnClick = (profile) => event => {
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
    console.log('workerTaskInfo length', workerTaskInfo.length);
    console.log('workerTaskInfo length', !workerTaskInfo.length);

    if(!workerTaskInfo.length) {
      getWorkerTaskInfo()
        .then((allWorkerTaskInfo) => {
          console.log('allWorkerTaskInfo', allWorkerTaskInfo);

          setWorkerTaskInfo(allWorkerTaskInfo);
        })
        .catch(error => console.error("ERROR", error));
    }
  }, []);

  console.log('workerTaskInfo', workerTaskInfo);
  return(
    <TableContainer>
      <StyledPaper elevation={3}>
        <CustomTable>
          <thead>
            <tr>
              {
                profileTableColumnHeader.map(entry => {
                  return(
                    <Tooltip placement="top" title={entry.TOOLTIP}>
                      <CustomTableHeader data-testid="table-header">{entry.COLUMN_NAME}</CustomTableHeader>
                    </Tooltip>
                  )
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
                      <TableText>{formatProfileBooleanData(profile.acw_data_entry_i.data[0])}</TableText>
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
                      <TableDataFlex>
                        {
                          JSON.parse(profile.activities).map(activity => {
                            return formatActivityData(activity.name)
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
  )
};

export default ProfileSettingsTable;
