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
import { UserAction } from "../../OnboardNewUser/UserEntryFormWrapper.Interfaces";
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
  useAdminDispatch,
  useAdminState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  formModes
} from "globals";
import React from "react";
import PropTypes from "prop-types";
import { formatWorkerAttributeSkillsToHTML } from "utils";
import { views } from "../../UserManagementWrapper/UserManagement.Interfaces";

const TritonUserTable = props => {
  const {
    deltaToggle,
    workerOpts,
    setWorkerOpts,
    setDeltaToggle,
    paginatedWorkers
  } = props;

  const state = useAdminState();
  const selectedWorkers = state.workerContext.selectedWorkers;
  const dispatch = useAdminDispatch();
  const setForm = useFormDispatch();

  return (
    <TableContainer>
      { state.resettingSkills ? <ModalOverlay message="Resetting Worker Skills" status="saving" /> : null }
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>NAME</CustomTableHeader>
            <CustomTableHeader>N NUMBER</CustomTableHeader>
            <CustomTableHeader>EXTENSION</CustomTableHeader>
            <CustomTableHeader>OFFICE</CustomTableHeader>
            <CustomTableHeader>SKILLS (Current)</CustomTableHeader>
            <CustomTableHeader>SKILLS (Default)</CustomTableHeader>
            <CustomTableHeader>
              <Switch checked={deltaToggle} onChange={() => setDeltaToggle(!deltaToggle)} inputProps={{ "aria-label": "toggle skills modified" }} />
            </CustomTableHeader>
            <CustomTableHeader/>
            <CustomTableHeader/>
          </tr>
        </thead>
        <tbody>
          {paginatedWorkers.map(worker => {
            const isSelected = selectedWorkers.some(selectedWorker => selectedWorker.sid === worker.sid);
            const handleWorkerOnClick = () => dispatch({
              type: "toggleWorkerSelected",
              payload: {
                name: worker.attributes.full_name,
                sid: worker.sid
              }
            });
            const editButtonOnClick = event => {
              event.stopPropagation();
              setForm({
                type: userFormActions.SET_UPDATE_FORM_STATE,
                payload: {
                  worker,
                  managers: state.managerContext.managers,
                  formMode: formModes.UPDATE
                }
              });
              setWorkerOpts({
                ...workerOpts,
                action: UserAction.EDIT,
                worker: worker,
                routedFrom: views.TRITON_USERS
              });
            };
            const deleteButtonOnClick = event => {
              event.stopPropagation();
              setForm({
                type: userFormActions.SET_UPDATE_FORM_STATE,
                payload: {
                  worker,
                  managers: state.managerContext.managers,
                  formMode: formModes.DELETE
                }
              });
              setWorkerOpts({
                ...workerOpts,
                action: UserAction.DELETE,
                worker: worker,
                routedFrom: views.TRITON_USERS
              });
            };
            return (
              <CustomTableRow key={worker.sid} onClick={handleWorkerOnClick} selected={isSelected} data-testid="table-row">
                <CustomTableData><TableText>{worker.attributes.full_name}</TableText></CustomTableData>
                <CustomTableData><TableText>{worker.attributes.n_number}</TableText></CustomTableData>
                <CustomTableData><TableText>{worker.attributes.extension}</TableText></CustomTableData>
                <CustomTableData><TableText>{worker.attributes.office_location_name}</TableText></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerAttributeSkillsToHTML(worker.attributes.routing)}</TableDataFlex></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerAttributeSkillsToHTML(worker.attributes.default_skills)}</TableDataFlex></CustomTableData>
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

TritonUserTable.propTypes = {
  deltaToggle: PropTypes.bool.isRequired,
  setDeltaToggle: PropTypes.func.isRequired,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      levels: PropTypes.array,
      levelSelected: PropTypes.number,
      skill: PropTypes.string
    })
  ).isRequired,
  workerOpts: PropTypes.any,
  view: PropTypes.any,
  setView: PropTypes.any,
  setWorkerOpts: PropTypes.any,
  workers: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      sid: PropTypes.string
    })
  ),
  paginatedWorkers: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      id: PropTypes.string,
      sid: PropTypes.string
    })
  )
};

export default TritonUserTable;