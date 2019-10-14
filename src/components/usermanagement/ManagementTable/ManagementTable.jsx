import { Modal } from "@material-ui/core";
import {
  Edit,
  ChangeHistoryRounded
} from "@material-ui/icons";
import { EditUserModal } from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import {
  formatWorkerSkillsToHTML
} from "utils";

const iconFieldWidth = "30px";

const CustomTable = styled.table`
  border-spacing: 0;
  font-size: 14px;
  table-layout: fixed;
  width: 100%;
`;

const CustomTableData = styled.td`
  color: ${props => props.theme.textColor};
  padding: 4px;
`;

const CustomTableHeader = styled.th`
  color: ${props => props.theme.textColor};
  border-bottom: 2px solid ${props => props.theme.tableRow.borderColor};
  text-align: left;
  width: ${props => props.width};
`;

const CustomTableRow = styled.tr`
  background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : "inherit"};
  &:hover {
    background-color: ${props => props.selected ? props.theme.tableRow.hoverSelectedColor : props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
`;

const DeltaNotification = styled(ChangeHistoryRounded)`
  color: #565656;
`;

const IconWrapper = styled.div`
  align-items: center;
  border-radius: ${props => props.theme.tableRow.icon.hoverDiameter / 2}px;
  color: #565656;
  cursor: pointer;
  display: flex;
  font-size: ${props => props.theme.tableRow.icon.size}px;
  height: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  justify-content: center;
  margin: auto;
  width: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  &:hover {
    background-color: ${props => props.theme.tableRow.selectedColor};
    cursor: pointer;
  }
`;

const TableContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
`;

const TableDataFlex = styled.div`
  color: ${props => props.theme.textColor};
  display: flex;
  flex-wrap: wrap;
`;

const ManagementTable = props => {
  const { workers } = props;

  const defaultEditUserModalOpts = {
    open: false,
    worker: null
  };

  const [editUserModalOpts, setEditUserModalOpts] = useState(defaultEditUserModalOpts);
  const state = useAdminState();
  const selectedWorkers = state.workerContext.selectedWorkers;
  const dispatch = useAdminDispatch();

  return (
    <TableContainer>
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader width={"20%"}>NAME</CustomTableHeader>
            <CustomTableHeader width={"20%"}>N NUMBER</CustomTableHeader>
            <CustomTableHeader width={"20%"}>OFFICE</CustomTableHeader>
            <CustomTableHeader width={"20%"}>SKILLS (Current)</CustomTableHeader>
            <CustomTableHeader width={"20%"}>SKILLS (Default)</CustomTableHeader>
            <CustomTableHeader width={iconFieldWidth}/>
            <CustomTableHeader width={iconFieldWidth}/>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker,index) => {
            const isSelected = selectedWorkers.includes(worker.sid);
            const handleWorkerOnClick = () => dispatch({
              type: "toggleWorkerSelected",
              payload: worker.sid
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
                <CustomTableData>{worker.attributes.full_name}</CustomTableData>
                <CustomTableData>{worker.id}</CustomTableData>
                <CustomTableData>{worker.attributes.office_location_name}</CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerSkillsToHTML(worker.attributes.routing)}</TableDataFlex></CustomTableData>
                <CustomTableData><TableDataFlex>{formatWorkerSkillsToHTML(worker.attributes.default_skills)}</TableDataFlex></CustomTableData>
                <CustomTableData>
                  <IconWrapper onClick={editButtonOnClick} data-testid="edit-button">
                    <Edit fontSize={"inherit"}/>
                  </IconWrapper>
                </CustomTableData>
                <CustomTableData>
                  {
                    worker.skillsDifferent ? <DeltaNotification data-testid="delta-icon" fontSize={"inherit"}/> : null
                  }
                </CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
        <Modal open={editUserModalOpts.open}>
          <EditUserModal handleClose={() => setEditUserModalOpts(defaultEditUserModalOpts)} worker={editUserModalOpts.worker}/>
        </Modal>
      </CustomTable>
    </TableContainer>
  );
};

ManagementTable.propTypes = {
  workers: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      id: PropTypes.string,
      sid: PropTypes.string
    })
  )
};

export default ManagementTable;