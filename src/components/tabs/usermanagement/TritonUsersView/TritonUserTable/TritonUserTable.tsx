import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  DeltaWrapper,
  IconWrapper,
  TableContainer,
  TableDataFlex,
  TableText
} from "./TableUserTable.Styles";
import {
  Switch
} from "@mui/material";
import {
  Delete,
  Edit,
  ChangeHistoryRounded
} from "@mui/icons-material";
import { ModalOverlay } from "components";
import {
  useAdminState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  formModes,
  ModalOverlayStatuses
} from "globals";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatWorkerAttributeSkillsToHTML } from "utils";
import { TritonUserTableProps } from "./TritonUserTable.Interfaces";

const TritonUserTable = (props: TritonUserTableProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const state = useAdminState();
  const setForm = useFormDispatch();
  const navigate = useNavigate();

  const { isLoading } = state.workerContext;

  return (
    <TableContainer>
      {isLoading || state.resettingSkills ? <ModalOverlay message={isLoading ? "Loading Users" : "Resetting Worker Skills"} status={ModalOverlayStatuses.SAVING} /> : null }
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>NAME</CustomTableHeader>
            <CustomTableHeader>N NUMBER</CustomTableHeader>
            <CustomTableHeader>EXTENSION</CustomTableHeader>
            <CustomTableHeader>TEAM/PROFILE</CustomTableHeader>
            <CustomTableHeader>OU</CustomTableHeader>
            <CustomTableHeader>ROUTING TEAM</CustomTableHeader>
            <CustomTableHeader>CURRENT SKILLS</CustomTableHeader>
            <CustomTableHeader>DEFAULT SKILLS</CustomTableHeader>
            <CustomTableHeader>DISABLED SKILLS</CustomTableHeader>
            <CustomTableHeader>
              <Switch checked={tableState.deltaFilter} onChange={() =>
                setTableState({
                  ...tableState,
                  deltaFilter: !tableState.deltaFilter
                })} inputProps={{ "aria-label": "toggle skills modified" }} />
            </CustomTableHeader>
            <CustomTableHeader/>
            <CustomTableHeader/>
          </tr>
        </thead>
        <tbody>
          {tableState.filteredList.map((worker: any) => {
            const isSelected = tableState.selected.some((selectedWorker: any) => selectedWorker.sid === worker.sid);
            const handleWorkerOnClick = () => {
              if(isSelected){
                setTableState({
                  ...tableState,
                  selected: [
                    ...tableState.selected.filter((w: any) => w.sid !== worker.sid)
                  ]
                });
              } else {
                setTableState({
                  ...tableState,
                  selected: [
                    ...tableState.selected,
                    {
                      name: worker.attributes.full_name,
                      sid: worker.sid
                    }
                  ]
                });
              }
            };
            const editButtonOnClick = (event: any) => {
              event.stopPropagation();
              setForm({
                type: userFormActions.SET_UPDATE_TRITON_FORM_STATE,
                payload: {
                  formMode: formModes.UPDATE,
                  worker,
                  managers: state.managerContext.managers
                }
              });
              navigate("/triton-admin/user");
            };
            const deleteButtonOnClick = (event: any) => {
              event.stopPropagation();
              setForm({
                type: userFormActions.SET_DELETE_FORM_STATE,
                payload: {
                  worker,
                  managers: state.managerContext.managers
                }
              });
              navigate("/triton-admin/user");
            };
            const profile: any = state.profileContext.profiles.find((p: any) => p.profile_id === worker.attributes.profile_id) || {};
            return (
              <CustomTableRow key={worker.sid} onClick={handleWorkerOnClick} selected={isSelected} data-testid="table-row">
                <CustomTableData><TableText>{worker.attributes.emp_first_name} {worker.attributes.emp_last_name}</TableText></CustomTableData>
                <CustomTableData>
                  <TableText>
                    {`${worker.attributes.n_number}${worker.isConsole ? " [C]" : ""}`}
                  </TableText>
                </CustomTableData>
                <CustomTableData><TableText>{worker.attributes.extension}</TableText></CustomTableData>
                <CustomTableData><TableText>{profile.profile_nme} - {profile.profile_id}</TableText></CustomTableData>
                <CustomTableData><TableText>{profile.operating_unit_nme}</TableText></CustomTableData>
                <CustomTableData><TableText>{worker.attributes.routing?.team || ""}</TableText></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerAttributeSkillsToHTML(worker.attributes.routing)}</TableDataFlex></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerAttributeSkillsToHTML(worker.attributes.default_skills)}</TableDataFlex></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerAttributeSkillsToHTML(worker.attributes.disabled_skills)}</TableDataFlex></CustomTableData>
                <CustomTableData>
                  {
                    worker.skillsDifferent ? <DeltaWrapper data-testid="delta-icon"><ChangeHistoryRounded fontSize={"inherit"}/></DeltaWrapper> : null
                  }
                </CustomTableData>
                <CustomTableData>
                  <IconWrapper onClick={editButtonOnClick} data-testid="edit-button">
                    <Edit fontSize={"inherit"}/>
                  </IconWrapper>
                </CustomTableData>
                <CustomTableData>
                  <IconWrapper onClick={deleteButtonOnClick} data-testid="delete-button">
                    <Delete fontSize={"inherit"}/>
                  </IconWrapper>
                </CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
      </CustomTable>
    </TableContainer>
  );
};

export default TritonUserTable;