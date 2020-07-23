import {
  Modal,
  Paper
} from "@material-ui/core";
import {
  Delete,
  Edit
} from "@material-ui/icons";
import {
  AddContact,
  DialListEntryForm
} from "components";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  formatTenDigitNumber,
  myAxios,
  removeNonNumericCharacters,
  sortDialListEntriesByName
} from "utils";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

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

const TableContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;

const TableText = styled.div`
  margin: 2px;
`;

const NoDialListDiv = styled.div`
  margin-top: 25vh;
  text-align: center;
`;

const DialListTable = props => {
  const {
    profile,
    setProfileSettingsState
  } = props;

  console.log("profile in DialListTable:", profile);

  const { dialList } = profile;

  dialList.sort(sortDialListEntriesByName);

  const [dialListTableState, setDialListTableState] = useState({
    isDialListEntryFormOpen: false,
    contactInfo: {}
  });

  const handleCloseDialListEntryForm = () => {
    setDialListTableState({
      ...dialListTableState,
      isDialListEntryFormOpen: false
    });
  };

  const handleSubmitUpdate = form => () => {
    console.log("UPDATE dial list entry");
    const req = {
      contact_nme: form.friendlyName,
      contact_num: removeNonNumericCharacters(form.transferNumber),
      external_num: removeNonNumericCharacters(form.externalNumber)
    };
    // TODO: find the diallist_id of the entry to edit (don't hard-code 522 in the request)
    myAxios.post(apiPaths.DIAL_LIST_ENTRY(522), req)
      .then(res => {
        console.log("post response:", res);
        // TODO: success overlay
      });
    // .catch(err => {
    //   console.error(`DialListTable - Failed to delete dial list entry for diallist_id ${entry.diallist_id}`, {
    //     err
    //   });
    //   // TODO: fail overlay
    // });
  };

  if (dialList.length === 0) {
    return(
      <NoDialListDiv>
        <h1>No dial list entries exist for this profile</h1>
      </NoDialListDiv>
    );
  } else {
    return(
      <TableContainer>
        <AddContact profile={profile} />
        <StyledPaper elevation={3}>
          <CustomTable>
            <thead>
              <tr>
                <CustomTableHeader>NAME</CustomTableHeader>
                <CustomTableHeader>NUMBER</CustomTableHeader>
              </tr>
            </thead>
            <tbody>
              {dialList.map((entry, index) => {
                const editButtonOnClick = () => {
                  setDialListTableState({
                    isDialListEntryFormOpen: true,
                    contactInfo: entry
                  });
                };
                const deleteButtonOnClick = () => {
                  const popUp = confirm("Are you sure you want to delete this dial list entry?");
                  if (popUp === true) {
                    myAxios.delete(apiPaths.DIAL_LIST_ENTRY(entry.diallist_id))
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
                        console.error(`DialListTable - Failed to delete dial list entry for diallist_id ${entry.diallist_id}`, {
                          err,
                          entry
                        });
                      // TODO: What to display to user?
                      });
                  }
                };
                return(
                  <CustomTableRow key={entry.diallist_id} data-testid="table-row">
                    <CustomTableData><TableText>{entry.contact_nme}</TableText></CustomTableData>
                    <CustomTableData><TableText>{formatTenDigitNumber(entry.contact_num)}</TableText></CustomTableData>
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
            <Modal disableBackdropClick={true} open={dialListTableState.isDialListEntryFormOpen}>
              <DialListEntryForm
                contactInfo={dialListTableState.contactInfo}
                handleClose={handleCloseDialListEntryForm}
                headerText={"Edit Contact"}
                onSubmit={handleSubmitUpdate}
                submitButtonText={"Update"} />
            </Modal>
          </CustomTable>
        </StyledPaper>
      </TableContainer>
    );
  }
};

DialListTable.propTypes = {
  profile: PropTypes.object.isRequired,
  setProfileSettingsState: PropTypes.func.isRequired
};

export default DialListTable;
