import React from "react";
import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  TableText,
  StyledPaper,
  TableContainer
} from "./ProfileSettingsTable.Styles";
import {
  formatProfileBooleanData,
  formatOverflowSkillData
 } from "utils";
 import { Tooltip } from "@mui/material";

const ProfileSettingsTable = props => {
  const { profileList } = props;

  return(
    <TableContainer>
      <StyledPaper elevation={3}>
        <CustomTable>
          <thead>
            <tr>
              <Tooltip
                  placement="top"
                  title={<h1 style={{ fontSize: "15px" }}>Profile ID</h1>}>
                  <CustomTableHeader>ID</CustomTableHeader>
              </Tooltip>
              <CustomTableHeader>ID</CustomTableHeader>
              <CustomTableHeader>Name</CustomTableHeader>
              <CustomTableHeader>Recorded</CustomTableHeader>
              <CustomTableHeader>Auto Answered</CustomTableHeader>
              <CustomTableHeader>PMT PRCSG</CustomTableHeader>
              <CustomTableHeader>Outbound Recorded</CustomTableHeader>
              <CustomTableHeader>ACW Option</CustomTableHeader>
              <CustomTableHeader>Manual Recorded</CustomTableHeader>
              <CustomTableHeader>ACW Data Entry</CustomTableHeader>
              <CustomTableHeader>Manual Recorded Inbound</CustomTableHeader>
              <CustomTableHeader>Agent Assisted Pay</CustomTableHeader>
              <CustomTableHeader>Overflow Skill</CustomTableHeader>
              <CustomTableHeader>CTAC Profile Change</CustomTableHeader>
              <CustomTableHeader>Policy Number Edit</CustomTableHeader>
            </tr>
          </thead>
          <tbody>
            {
              profileList.map(profile => {
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
                      <TableText>{formatProfileBooleanData(profile.completeTasksOnActivityChange_option_i.data[0])}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{formatProfileBooleanData(profile.policy_number_edit_i.data[0])}</TableText>
                    </CustomTableData>
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
