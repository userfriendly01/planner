import { WfmUserTableProps } from "usermanagement/WfmUserTable.Interfaces";
import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  IconWrapper,
  TableContainer,
  TableText
} from "usermanagement/WfmUserTable.Styles";
import { Edit } from "@mui/icons-material";
import { userFormActions } from "context/userFormReducer";
import {
  useAdminState, useFormDispatch
} from "context/appContext";
import { formModes } from "globals";
import {
  WfmBusinessUnit, WfmTeam, WfmUser
} from "globals/interfaces";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  getWfmBusinessUnits, getWfmTeams
} from "utils/calabrioUtils";

export const WfmUserTable = (props: WfmUserTableProps) => {
  const {
    tableState
  } = props;

  const state = useAdminState();
  const setForm = useFormDispatch();
  const navigate = useNavigate();


  return (
    <TableContainer>
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>NAME</CustomTableHeader>
            <CustomTableHeader>ID</CustomTableHeader>
            <CustomTableHeader>EMAIL</CustomTableHeader>
            <CustomTableHeader>IDENTITY</CustomTableHeader>
            <CustomTableHeader>NNumber</CustomTableHeader>
            <CustomTableHeader>BUSINESS UNIT</CustomTableHeader>
            <CustomTableHeader>TEAM</CustomTableHeader>
            <CustomTableHeader/>
            <CustomTableHeader/>
          </tr>
        </thead>
        <tbody>
          {tableState.filteredList.map((user: WfmUser, index: number) => {
            const editButtonOnClick = (event: any) => {
              event.stopPropagation();
              setForm({
                type: userFormActions.SET_UPDATE_WFM_FORM_STATE,
                payload: {
                  user,
                  formMode: formModes.UPDATE,
                  state
                }
              });
              navigate("/triton-admin/user");
            };
            const deleteButtonOnClick = (event: any) => {
              event.stopPropagation();
              setForm({
                type: userFormActions.SET_DELETE_FORM_STATE,
                payload: {
                  worker: {
                    calabrioWfmUser: {
                      updated: false,
                      ...user
                    }
                  },
                  managers: state.managerContext.managers,
                  formMode: formModes.DELETE
                }
              });
              navigate("/triton-admin/user");
            };
            const businessUnit: WfmBusinessUnit | { Name: string } = getWfmBusinessUnits(state).find((bu: WfmBusinessUnit) => bu.Id === user.BusinessUnitId) || { Name: "Not Found" };
            const team: WfmTeam | { Name: string } = getWfmTeams(state).find((team: WfmTeam) => team.Id === user.ParentTeam) || { Name: "Not Found" };

            return (
              <CustomTableRow key={user.Id + index} data-testid="table-row">
                <CustomTableData><TableText>{user.FirstName} {user.LastName}</TableText></CustomTableData>
                <CustomTableData><TableText>{user.Id}</TableText></CustomTableData>
                <CustomTableData><TableText>{user.Email}</TableText></CustomTableData>
                <CustomTableData><TableText>{user.Identity}</TableText></CustomTableData>
                <CustomTableData><TableText>{user.EmploymentNumber}</TableText></CustomTableData>
                <CustomTableData><TableText>{businessUnit.Name}</TableText></CustomTableData>
                <CustomTableData><TableText>{team.Name}</TableText></CustomTableData>
                <CustomTableData>
                  <IconWrapper onClick={editButtonOnClick} data-testid="edit-button">
                    <Edit fontSize={"inherit"}/>
                  </IconWrapper>
                </CustomTableData>
                {/* <CustomTableData>
                  <IconWrapper onClick={deleteButtonOnClick} data-testid="delete-button">
                    <Delete fontSize={"inherit"}/>
                  </IconWrapper>
                </CustomTableData> */}
              </CustomTableRow>
            );
          })}
        </tbody>
      </CustomTable>
    </TableContainer>
  );
};