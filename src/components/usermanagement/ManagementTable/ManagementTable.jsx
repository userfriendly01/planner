import { theme } from "globals";
import { Modal } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { EditUserModal } from "components";

const CustomTable = styled.table`
  border-spacing: 0px;
`;

const CustomTableData = styled.td`
  color: ${theme.textColor};
  padding: 1%;
`;

const CustomTableHeader = styled.th`
  color: ${theme.textColor};
  border-bottom: 2px solid #F5F5F5;
  padding: 1%;
  text-align: left;
`;

const CustomTableRow = styled.tr`
  &:hover {
    background-color: #E6E6E6;
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
  const [userSelected, setUserSelected] = useState(null);

  const handleOpenEditUser = worker => {
    setIsEditUserModalOpen(true);
    setUserSelected(worker);
  };

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
            return (
              <CustomTableRow key={index} onClick={() => handleOpenEditUser(worker)}>
                <CustomTableData>
                  <div >{worker.attributes.full_name}</div>
                </CustomTableData>
                <CustomTableData>{worker.id}</CustomTableData>
                <CustomTableData>{worker.attributes.office_location_name}</CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
        <Modal open={isEditUserModalOpen}>
          <EditUserModal handleClose={handleCloseEditUser} worker={userSelected}/>
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