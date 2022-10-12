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
              <Tooltip placement="top" title="Unique Profile Identification">
                  <CustomTableHeader>ID</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Profile Name">
                <CustomTableHeader>Name</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="All inbound calls are automatically recorded">
                <CustomTableHeader>Inbound Recorded</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Automatically accepts a call and routes to an agent">
                <CustomTableHeader>Auto Answered</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="UI Feature: Click for payment button is enabled to manually pause/resume call recordings">
                <CustomTableHeader>Payment Processing</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="All outbound calls are automatically recorded">
                <CustomTableHeader>Outbound Recorded</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="UI Feature: Agent has the choice to enable or disable after call work (wrap-up). Default setting is off">
                <CustomTableHeader>ACW Option</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings">
                <CustomTableHeader>Manual Recorded</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="UI Feature: If enabled, during wrap-up, call tagging toggle appears which gives an input form to the user">
                <CustomTableHeader>ACW Data Entry</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings on inbound calls">
                <CustomTableHeader>Manual Recorded Inbound</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="Not a currently enabled UI feature">
                <CustomTableHeader>Agent Assisted Pay</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="An agent misses a call, and it's forwarded to the next available agent with the same manager">
                <CustomTableHeader>Overflow Skill</CustomTableHeader>
              </Tooltip>
              <Tooltip placement="top" title="UI Feature: An agent can capture and save a different policy number than what the IVR previously loaded">
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
