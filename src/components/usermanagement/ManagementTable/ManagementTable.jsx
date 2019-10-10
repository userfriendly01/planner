import { Modal } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { EditUserModal } from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { formatWorkerSkillsToHTML } from "utils";

const CustomTable = styled.table`
  border-spacing: 0px;
`;

const CustomTableData = styled.td`
  color: ${props => props.theme.textColor};
  padding: 1%;
`;

const CustomTableDataFlex = styled(CustomTableData)`
  display: flex;
`;

const CustomTableHeader = styled.th`
  color: ${props => props.theme.textColor};
  border-bottom: 2px solid #F5F5F5;
  padding: 1%;
  text-align: left;
`;

const CustomTableRow = styled.tr`
  background-color: ${props => props.selected ? props.theme.button.backgroundColor : "inherit"};
  &:hover {
    background-color: ${props => props.selected ? props.theme.tableRow.hoverSelectedColor : props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
`;

const EditIconWrapper = styled.div`
  cursor: pointer;
`;

const TableContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
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
            <CustomTableHeader>NAME</CustomTableHeader>
            <CustomTableHeader>N NUMBER</CustomTableHeader>
            <CustomTableHeader>OFFICE</CustomTableHeader>
            <CustomTableHeader>SKILLS (Current)</CustomTableHeader>
            <CustomTableHeader/>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker,index) => {
            const isSelected = selectedWorkers.includes(worker.sid);
            const handleWorkerOnClick = () => dispatch({
              type: "toggleWorkerSelected",
              payload: worker.sid
            });
            const editButtonOnClick = () => setEditUserModalOpts({
              open: true,
              worker
            });
            return (
              <CustomTableRow key={index} onClick={handleWorkerOnClick} selected={isSelected} data-testid="table-row">
                <CustomTableData>{worker.attributes.full_name}</CustomTableData>
                <CustomTableData>{worker.id}</CustomTableData>
                <CustomTableData>{worker.attributes.office_location_name}</CustomTableData>
                <CustomTableDataFlex>{formatWorkerSkillsToHTML(worker.attributes.routing)}</CustomTableDataFlex>
                <CustomTableData>
                  <EditIconWrapper onClick={editButtonOnClick} data-testid="edit-button">
                    <Edit/>
                  </EditIconWrapper>
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