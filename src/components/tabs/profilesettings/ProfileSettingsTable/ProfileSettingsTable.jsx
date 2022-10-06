import React from "react";
import styled from "styled-components";
import { Paper } from "@mui/material";
import {
  formatProfileBooleanData
} from "utils";

const CustomTable = styled.table`
  border-spacing: 0;
  font-size: 14px;
  table-layout: fixed;
  width: 100%;
  padding-left: 10px;
`;

const CustomTableData = styled.td`
  color: #1A1446;
  padding: 2px 4px;
  vertical-align: top;
`;

const CustomTableHeader = styled.th`
  color: #1A1446;
  border-bottom: 2px solid #F5F5F5;
  padding: 10px 4px;
  text-align: left;
  &:nth-child(1) {
    width: 2%;
  }
  &:nth-child(2) {
    width: 10%;
  }
`;

const CustomTableRow = styled.tr`
  &:nth-child(odd) {
    background-color: rgba(0,0,0,0.04);
  }
  background-color: "inherit";
  &:hover {
    background-color: rgba(0,0,0,0.15);
    cursor: pointer;
  }
`;

const TableText = styled.div`
  margin: 2px;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const TableContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;

const ProfileSettingsTable = props => {
  const {
    profileList,
  } = props;

  return(
    <TableContainer>
      <StyledPaper elevation={3}>
        <CustomTable>
          <thead>
            <tr>
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
            <CustomTableHeader>CTAC Profile Change</CustomTableHeader>
            <CustomTableHeader>Policy Number Edit</CustomTableHeader>
            </tr>
          </thead>
          <tbody>
            {
              profileList.map(entry => {
                return(
                  <CustomTableRow key={entry.profile_id} data-testid="table-row">
                    <CustomTableData>
                      <TableText>{`${entry.profile_id}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${entry.profile_nme}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.recorded_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.auto_answd_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.pmt_prcsg_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.otbnd_recorded_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.acw_option_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.manual_recorded_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.acw_data_entry_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.manual_record_inbound_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.agent_assisted_pay_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.completeTasksOnActivityChange_option_i.data[0])}`}</TableText>
                    </CustomTableData>
                    <CustomTableData>
                      <TableText>{`${formatProfileBooleanData(entry.policy_number_edit_i.data[0])}`}</TableText>
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
