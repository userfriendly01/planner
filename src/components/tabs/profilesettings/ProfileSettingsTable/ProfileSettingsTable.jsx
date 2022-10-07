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
import { formatProfileBooleanData } from "utils";

const ProfileSettingsTable = props => {
  const { profileList } = props;

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
