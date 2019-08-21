import { ButtonBase } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const CustomButton = styled(ButtonBase)`
  && {
    background-color: #AAEDED;
    border: none;
    border-radius: 3px;
    color: theme.textColor;
    cursor: pointer;
    outline: none;
    padding: 5 10 5 10;
  }
`;

const CustomTable = styled.table`
  border-spacing: 0px;
`;

const CustomTableData = styled.td`
  color: theme.textColor;
  padding: 1%;
`;

const CustomTableHeader = styled.th`
  color: theme.textColor;
  border-bottom: 2px solid #F5F5F5;
  padding: 1%;
  text-align: left;
`;

const CustomTableRow = styled.tr`
  &:hover {
    background-color: #E6E6E6;
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
  return (
    <TableContainer>
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>NAME</CustomTableHeader>
            <CustomTableHeader>N NUMBER</CustomTableHeader>
            <CustomTableHeader></CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker,index) => {
            return (
              <CustomTableRow key={index}>
                <CustomTableData>{worker.attributes.full_name}</CustomTableData>
                <CustomTableData>{worker.id}</CustomTableData>
                <CustomTableData><CustomButton disabled>Remove</CustomButton></CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
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