import { Modal } from "@material-ui/core";
import { EditUserModal } from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const CustomTable = styled.table`
  border-spacing: 0px;
`;

const CustomTableData = styled.td`
  color: ${props => props.theme.textColor};
  padding: 1%;
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

const TableContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
`;

const ManagementTable = props => {
  const { workers } = props;

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const state = useAdminState();
  const selectedWorkers = state.workerContext.selectedWorkers;
  const dispatch = useAdminDispatch();

  const handleCloseEditUser = () => {
    setIsEditUserModalOpen(false);
  };

  return (
    <TableContainer>
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>NAME</CustomTableHeader>
            <CustomTableHeader>N NUMBER</CustomTableHeader>
            <CustomTableHeader>OFFICE</CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker,index) => {
            const isSelected = selectedWorkers.includes(worker.sid);
            const handleWorkerOnClick = () => dispatch({
              type: "toggleWorkerSelected",
              payload: worker.sid
            });
            return (
              <CustomTableRow key={index} onClick={handleWorkerOnClick} selected={isSelected} data-testid="table-row">
                <CustomTableData>{worker.attributes.full_name}</CustomTableData>
                <CustomTableData>{worker.id}</CustomTableData>
                <CustomTableData>{worker.attributes.office_location_name}</CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
        <Modal open={isEditUserModalOpen}>
          <EditUserModal handleClose={handleCloseEditUser} worker={null}/>
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