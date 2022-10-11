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
              <Tooltip placement="top" title="Profile ID">
                  <CustomTableHeader>ID</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Profile Name">
                <CustomTableHeader>Name</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="All calls inbound are automatically recorded">
                <CustomTableHeader>Recorded</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Automatically picks an available agent and accepts a call">
                <CustomTableHeader>Auto Answered</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Click for Payment button is enabled">
                <CustomTableHeader>PMT PRCSG</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="All calls outbound are automatically recorded">
                <CustomTableHeader>Outbound Recorded</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Agent has the choice to enable or disable acw">
                <CustomTableHeader>ACW Option</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Button appears with call controls">
                <CustomTableHeader>Manual Recorded</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="If ACW is enabled, during wrapup, call tagging appears">
                <CustomTableHeader>ACW Data Entry</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Button appears with call controls">
                <CustomTableHeader>Manual Recorded Inbound</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Need a tooltip!">
                <CustomTableHeader>Agent Assisted Pay</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="An agent misses a call, and its forwarded to next available agent with the same manager">
                <CustomTableHeader>Overflow Skill</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Need a tooltip!">
                <CustomTableHeader>CTAC Profile Change</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="An agent can capture and save a different policy number than what the IVR previously loaded.">
                <CustomTableHeader>Policy Number Edit</CustomTableHeader>
              </Tooltip>
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
