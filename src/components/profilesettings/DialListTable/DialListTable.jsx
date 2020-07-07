import {
  Delete,
  Edit
} from "@material-ui/icons";
import PropTypes from "prop-types";
import { apiPaths } from "globals";
import React from "react";
import { myAxios } from "utils";
import styled from "styled-components";

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
    background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : props.theme.tableRow.alternateRowColor};
  }
  background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : "inherit"};
  &:hover {
    background-color: ${props => props.selected ? props.theme.tableRow.hoverSelectedColor : props.theme.tableRow.hoverColor};
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

const TableContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;

const TableText = styled.div`
  margin: 2px;
`;

const DialListTable = props => {

  const {
    profile,
    setProfileSettingsState
  } = props;
  const {
    dialList,
    profileId
  } = profile;

  if (dialList.length === 0) {
    return(<h1>No dial list entries exist for this profile</h1>);
  } else {
    return(
      <TableContainer>
        <CustomTable>
          <thead>
            <tr>
              <CustomTableHeader>NAME</CustomTableHeader>
              <CustomTableHeader>NUMBER</CustomTableHeader>
            </tr>
          </thead>
          <tbody>
            {dialList.map((entry, index) => {
              const editButtonOnClick = event => {
                event.stopPropagation();
                // TODO: Launch add/edit modal here
                console.log("you clicked the edit button");
              };
              const deleteButtonOnClick = () => {
                const popUp = confirm("Are you sure you want to delete this dial list entry?");
                if (popUp === true) {
                  myAxios.delete(apiPaths.DELETE_CONTACT_FROM_PROFILE(profileId, entry.contact_id))
                    .then(() => {
                      dialList.splice(index, 1);
                      setProfileSettingsState({
                        profile: {
                          ...profile,
                          dialList
                        }
                      });
                    })
                    .catch(err => {
                      console.error(`DialListTable - Failed to delete dial list entry for contact_id ${entry.contact_id}`, {
                        err,
                        entry
                      });
                      // TODO: What to display to user?
                    });
                } else {
                  console.log("popUp === false");
                }
              };
              return(
                <CustomTableRow key={index} data-testid="table-row">
                  <CustomTableData><TableText>{entry.contact_nme}</TableText></CustomTableData>
                  <CustomTableData><TableText>{entry.contact_num}</TableText></CustomTableData>
                  <CustomTableData><IconWrapper onClick={editButtonOnClick} data-testid="edit-button">
                    <Edit fontSize={"inherit"} />
                  </IconWrapper></CustomTableData>
                  <CustomTableData><IconWrapper onClick={deleteButtonOnClick} data-testid="delete-button">
                    <Delete fontSize={"inherit"} />
                  </IconWrapper></CustomTableData>
                </CustomTableRow>
              );
            })}
          </tbody>
        </CustomTable>
      </TableContainer>
    );
  }
};

DialListTable.propTypes = {
  profile: PropTypes.object.isRequired,
  setProfileSettingsState: PropTypes.func.isRequired
};

export default DialListTable;
