import {
  Modal,
  Switch
} from "@material-ui/core";
import {
  Edit,
  ChangeHistoryRounded
} from "@material-ui/icons";
import {
  EditUserModal,
  ModalOverlay,
  ResultsModal,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import {
  formatWorkerSkillsToHTML,
  mapWorkerFromTwilioWorker,
  myAxios
} from "utils";

const headerIconWidth = "64px";

const CustomTable = styled.table`
  border-spacing: 0;
  font-size: 14px;
  table-layout: fixed;
  width: 100%;
`;

const CustomTableData = styled.td`
  color: ${props => props.theme.textColor};
  padding: 2px 4px;
  vertical-align: top;
  &:nth-child(6) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(7) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
`;

const CustomTableHeader = styled.th`
  color: ${props => props.theme.textColor};
  border-bottom: 2px solid ${props => props.theme.tableRow.borderColor};
  padding-left: 4px;
  text-align: left;
  &:nth-child(1) {
    width: 15%;
  }
  &:nth-child(2) {
    width: 10%;
  }
  &:nth-child(3) {
    width: 18%;
  }
  &:nth-child(6) {
    width: ${headerIconWidth};
  }
  &:nth-child(7) {
    width: ${headerIconWidth};
  }
`;

const CustomTableRow = styled.tr`
  &:nth-child(odd) {
    background-color: #F1F1F1;
  }
  background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : "inherit"};
  &:hover {
    background-color: ${props => props.selected ? props.theme.tableRow.hoverSelectedColor : props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
`;

const DeltaWrapper = styled.div`
  align-items: center;
  color: ${props => props.theme.libertyDarkGray};
  display: flex;
  justify-content: center;
  margin: auto;
`;

const IconWrapper = styled.div`
  align-items: center;
  border-radius: ${props => props.theme.tableRow.icon.hoverDiameter / 2}px;
  color: ${props => props.theme.libertyDarkGray};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.theme.tableRow.icon.size}px;
  height: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  justify-content: center;
  width: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  &:hover {
    background-color: ${props => props.theme.tableRow.selectedColor};
    cursor: pointer;
  }
`;

const ResetSkillsText = styled.span`
  font-size: ${props => props.theme.button.fontSize.small};
`;

const TableContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;

const TableDataFlex = styled.div`
  color: ${props => props.theme.textColor};
  display: flex;
  flex-wrap: wrap;
`;

const TableText = styled.div`
  margin: 2px;
`;

const ManagementTable = props => {
  const {
    deltaToggle,
    setDeltaToggle,
    workers
  } = props;

  const defaultEditUserModalOpts = {
    open: false,
    worker: null
  };

  const defaultResetInformation = {
    open: false,
    resetting: false,
    successfulResets: [],
    unsuccessfulResets: []
  };

  const [editUserModalOpts, setEditUserModalOpts] = useState(defaultEditUserModalOpts);
  const [resultsModalOpts, setResultsModalOpts] = useState(defaultResetInformation);
  const state = useAdminState();
  const selectedWorkers = state.workerContext.selectedWorkers;
  const dispatch = useAdminDispatch();

  const resetWorkers = () => {
    setResultsModalOpts({
      ...resultsModalOpts,
      resetting: true
    });
    myAxios
      .post(apiPaths.RESET_WORKER_SKILLS, {
        workerSids: selectedWorkers.map(worker => worker.sid)
      }).then(response => {
        const failedWorkers = [];
        const passedWorkers = [];
        response.data.forEach(result => {
          if (result.updated){
            const updatedWorker = mapWorkerFromTwilioWorker(result.worker);
            dispatch({
              type: "toggleWorkerSelected",
              payload: {
                sid: result.workerSid
              }
            });
            dispatch({
              type: "updateWorker",
              payload: updatedWorker
            });
            passedWorkers.push({
              name: selectedWorkers.find(worker => result.workerSid === worker.sid).name
            });
          } else {
            failedWorkers.push({
              reason: result.reason,
              name: selectedWorkers.find(worker => result.workerSid === worker.sid).name
            });
          }
        });
        setResultsModalOpts({
          open: true,
          resetting: false,
          successfulResets: passedWorkers,
          unsuccessfulResets: failedWorkers
        });
      });
  };

  return (
    <TableContainer>
      { resultsModalOpts.resetting ? <ModalOverlay message="Resetting Workers" status="saving" /> : null }
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>NAME</CustomTableHeader>
            <CustomTableHeader>N NUMBER</CustomTableHeader>
            <CustomTableHeader>OFFICE</CustomTableHeader>
            <CustomTableHeader>SKILLS (Current)</CustomTableHeader>
            <CustomTableHeader>SKILLS (Default)</CustomTableHeader>
            <CustomTableHeader>
              <Switch checked={deltaToggle} onChange={() => setDeltaToggle(!deltaToggle)} inputProps={{ "aria-label": "toggle skills modified" }} />
            </CustomTableHeader>
            <CustomTableHeader>
              <StyledButton disabled={selectedWorkers.length === 0} onClick={() => resetWorkers()}>
                <ResetSkillsText>Reset Skills</ResetSkillsText>
              </StyledButton>
            </CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker,index) => {
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
              setEditUserModalOpts({
                open: true,
                worker
              });
            };
            return (
              <CustomTableRow key={index} onClick={handleWorkerOnClick} selected={isSelected} data-testid="table-row">
                <CustomTableData><TableText>{worker.attributes.full_name}</TableText></CustomTableData>
                <CustomTableData><TableText>{worker.id}</TableText></CustomTableData>
                <CustomTableData><TableText>{worker.attributes.office_location_name}</TableText></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerSkillsToHTML(worker.attributes.routing)}</TableDataFlex></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerSkillsToHTML(worker.attributes.default_skills)}</TableDataFlex></CustomTableData>
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
              </CustomTableRow>
            );
          })}
        </tbody>
        <Modal open={editUserModalOpts.open}>
          <EditUserModal handleClose={() => setEditUserModalOpts(defaultEditUserModalOpts)} worker={editUserModalOpts.worker}/>
        </Modal>
        <Modal open={resultsModalOpts.open}>
          <ResultsModal
            handleClose={() => setResultsModalOpts(defaultResetInformation)}
            successfulWorkers={resultsModalOpts.successfulResets}
            unsuccessfulWorkers={resultsModalOpts.unsuccessfulResets} />
        </Modal>
      </CustomTable>
    </TableContainer>
  );
};

ManagementTable.propTypes = {
  deltaToggle: PropTypes.bool.isRequired,
  setDeltaToggle: PropTypes.func.isRequired,
  workers: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      id: PropTypes.string,
      sid: PropTypes.string
    })
  )
};

export default ManagementTable;