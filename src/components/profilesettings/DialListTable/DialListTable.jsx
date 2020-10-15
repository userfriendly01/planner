import {
  Modal,
  Paper
} from "@material-ui/core";
import {
  Delete,
  Edit
} from "@material-ui/icons";
import {
  DialListEntryForm,
  StatusOverlay,
  StyledButton
} from "components";
import {
  apiPaths,
  formModes,
  statusOverlayStatuses,
  statusOverlayTimeout
} from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  formatTenDigitNumber,
  myAxios
} from "utils";
import styled from "styled-components";

const AddContactButtonContainer = styled.div`
  display: flex;
  margin-bottom: 1em;
  width: 100%;
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

const NoDialListDiv = styled.div`
  margin-top: 25vh;
  text-align: center;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
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

const DialListTable = props => {
  const {
    dialList,
    profileId,
    refreshProfileData
  } = props;

  const [dialListTableState, setDialListTableState] = useState({
    dialListId: null,
    dialListEntryFormInitialValues: {}, // populated with diallist entry data and passed to DialListEntryForm
    dialListEntryFormMode: "",
    isDialListEntryFormOpen: false, // show DialListEntryForm
    otherContactNums: [],
    overlayMessage: "",
    saveStatus: null
  });

  const waitAndHideOverlay = () => setTimeout(() => {
    setDialListTableState({
      ...dialListTableState,
      overlayMessage: "",
      saveStatus: null
    });
  }, statusOverlayTimeout);

  const getDeleteButtonOnClick = diallistId => () => {
    const popUp = confirm("Are you sure you want to delete this dial list entry?");
    if (popUp === true) {
      setDialListTableState({
        ...dialListTableState,
        overlayMessage: "Deleting dial list entry...",
        saveStatus: statusOverlayStatuses.SAVING
      });
      myAxios.delete(apiPaths.DIAL_LIST_ENTRY(diallistId))
        .then(res => {
          console.log(`Successfully deleted dial list entry with diallist_id ${diallistId}`, {
            responseData: res.data
          });
          refreshProfileData();
          setDialListTableState({
            ...dialListTableState,
            overlayMessage: "Successfully deleted dial list entry",
            saveStatus: statusOverlayStatuses.SUCCESS
          });
          waitAndHideOverlay();
        })
        .catch(err => {
          console.error(`Failed to delete dial list entry with diallist_id ${diallistId}`, {
            err
          });
          setDialListTableState({
            ...dialListTableState,
            overlayMessage: "Failed to delete dial list entry",
            saveStatus: statusOverlayStatuses.FAIL
          });
          waitAndHideOverlay();
        });
    }
  };

  const addContactButtonClicked = () => {
    setDialListTableState({
      dialListEntryFormInitialValues: {
        contact_nme: "",
        contact_num: "",
        external_num: ""
      },
      dialListEntryFormMode: formModes.INSERT,
      isDialListEntryFormOpen: true,
      otherContactNums: dialList.map(entry => entry.contact_num)
    });
  };

  return(
    <TableContainer>
      <AddContactButtonContainer>
        <StyledButton onClick={addContactButtonClicked}>
          Add Contact
        </StyledButton>
      </AddContactButtonContainer>
      <Modal disableBackdropClick={true} open={dialListTableState.isDialListEntryFormOpen}>
        <DialListEntryForm
          dialListTableState={dialListTableState}
          profileId={profileId}
          refreshProfileData={refreshProfileData}
          setDialListTableState={setDialListTableState}
        />
      </Modal>
      {
        dialList.length === 0
          ?
          <NoDialListDiv>
            <h1>No dial list entries exist for this profile</h1>
          </NoDialListDiv>
          :
          <StyledPaper elevation={3}>
            {dialListTableState.saveStatus ?
              <ModalOverlay
                message={dialListTableState.overlayMessage}
                status={dialListTableState.saveStatus}
              /> : null}
            <CustomTable>
              <thead>
                <tr>
                  <CustomTableHeader>NAME</CustomTableHeader>
                  <CustomTableHeader>NUMBER</CustomTableHeader>
                </tr>
              </thead>
              <tbody>
                {dialList.map(entry => {
                  const editButtonOnClick = () => {
                    setDialListTableState({
                      dialListId: entry.diallist_id,
                      dialListEntryFormInitialValues: {
                        contact_nme: entry.contact_nme,
                        contact_num: entry.contact_num,
                        external_num: entry.external_num
                      },
                      dialListEntryFormMode: formModes.UPDATE,
                      isDialListEntryFormOpen: true,
                      otherContactNums: dialList.filter(e => e.diallist_id !== entry.diallist_id).map(e => e.contact_num)
                    });
                  };
                  return(
                    <CustomTableRow key={entry.diallist_id} data-testid="table-row">
                      <CustomTableData>
                        <TableText>{entry.contact_nme}</TableText>
                      </CustomTableData>
                      <CustomTableData>
                        <TableText>{formatTenDigitNumber(entry.contact_num)}</TableText>
                      </CustomTableData>
                      <CustomTableData>
                        <IconWrapper onClick={editButtonOnClick} data-testid="edit-button">
                          <Edit fontSize={"inherit"} />
                        </IconWrapper>
                      </CustomTableData>
                      <CustomTableData>
                        <IconWrapper onClick={getDeleteButtonOnClick(entry.diallist_id)} data-testid="delete-button">
                          <Delete fontSize={"inherit"} />
                        </IconWrapper>
                      </CustomTableData>
                    </CustomTableRow>
                  );
                })}
              </tbody>
            </CustomTable>
          </StyledPaper>
      }
    </TableContainer>
  );
};

DialListTable.propTypes = {
  dialList: PropTypes.array.isRequired,
  profileId: PropTypes.string.isRequired,
  refreshProfileData: PropTypes.func.isRequired
};

export default DialListTable;
