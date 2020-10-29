import { Paper } from "@material-ui/core";
import {
  Delete,
  Edit
} from "@material-ui/icons";
import { ModalOverlay } from "components";
import { modalOverlayStatuses } from "globals";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { formatTenDigitNumber } from "utils";

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
  &:nth-child(3) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(4) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
`;

const CustomTableHeader = styled.th`
  color: ${props => props.theme.textColor};
  border-bottom: 2px solid ${props => props.theme.tableRow.borderColor};
  padding: 10px 4px;
  text-align: left;
  &:nth-child(1) {
    width: 50%;
  }
  &:nth-child(2) {
    width: 30%;
  }
  &:nth-child(3) {
    width: 10%;
  }
  &:nth-child(4) {
    width: 10%;
  }
`;

const CustomTableRow = styled.tr`
  &:nth-child(odd) {
    background-color: ${props => props.theme.tableRow.alternateRowColor};
  }
  background-color: "inherit";
  &:hover {
    background-color: ${props => props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
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

const NoDialListDiv = styled.div`
  margin-top: 25vh;
  text-align: center;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const TableText = styled.div`
  margin: 2px;
`;

const PhoneNumberTable = props => {
  const {
    deleteFunction,
    editFunction,
    emptyListMsg,
    phoneNumberList,
    saveState
  } = props;

  console.log("emptyListMsg:", emptyListMsg);

  return(
    <div>
      {
        phoneNumberList.length === 0 ? (
          <NoDialListDiv>
            <h1>{emptyListMsg}</h1>
          </NoDialListDiv>
        ) : (
          <StyledPaper elevation={3}>
            {saveState.status ?
              <ModalOverlay
                message={saveState.overlayMessage}
                status={saveState.status}
              /> : null}
            <CustomTable>
              <thead>
                <tr>
                  <CustomTableHeader>NAME</CustomTableHeader>
                  <CustomTableHeader>NUMBER</CustomTableHeader>
                </tr>
              </thead>
              <tbody>
                {
                  phoneNumberList.map(entry => {
                    return(
                      <CustomTableRow key={entry.directory_id} data-testid="table-row">
                        <CustomTableData>
                          <TableText>{`${entry.last_nme}, ${entry.first_nme}`}</TableText>
                        </CustomTableData>
                        <CustomTableData>
                          <TableText>{formatTenDigitNumber(entry.phone_num)}</TableText>
                        </CustomTableData>
                        <CustomTableData>
                          <IconWrapper onClick={editFunction(entry)} data-testid="edit-button">
                            <Edit fontSize={"inherit"} />
                          </IconWrapper>
                        </CustomTableData>
                        <CustomTableData>
                          <IconWrapper onClick={deleteFunction(entry.directory_id)} data-testid="delete-button">
                            <Delete fontSize={"inherit"} />
                          </IconWrapper>
                        </CustomTableData>
                      </CustomTableRow>
                    );
                  })
                }
              </tbody>
            </CustomTable>
          </StyledPaper>
        )
      }
    </div>
  );
};

PhoneNumberTable.propTypes = {
  deleteFunction: PropTypes.func.isRequired,
  editFunction: PropTypes.func.isRequired,
  emptyListMsg: PropTypes.string.isRequired,
  phoneNumberList: PropTypes.array.isRequired,
  saveState: PropTypes.shape({
    status: PropTypes.oneOf(Object.values(modalOverlayStatuses)),
    overlayMessage: PropTypes.string
  }).isRequired
};

export default PhoneNumberTable;
