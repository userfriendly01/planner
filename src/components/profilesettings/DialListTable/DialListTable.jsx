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
  StyledButton
} from "components";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  formatTenDigitNumber,
  myAxios,
  sortDialListEntriesByName
} from "utils";
import styled from "styled-components";

const AddContactButtonContainer = styled.div`
  display: flex;
  padding: 8px;
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
    profile,
    refreshProfileData
  } = props;

  // TODO remove this log
  console.log("profile in DialListTable:", profile);

  const {
    dialList,
    profileId
  } = profile;

  dialList.sort(sortDialListEntriesByName);

  const [dialListTableState, setDialListTableState] = useState({
    dialListEntryFormHeaderText: "",
    dialListEntryFormInitialValues: {},
    dialListEntryFormSubmitFn: () => console.error("dialListEntryFormSubmitFn not set"),
    isDialListEntryFormOpen: false
  });

  const dialListEntryFormOnClose = () => setDialListTableState({
    ...dialListTableState,
    isDialListEntryFormOpen: false
  });

  const getDeleteButtonOnClick = diallistId => () => {
    const popUp = confirm("Are you sure you want to delete this dial list entry?");
    if (popUp === true) {
      myAxios.delete(apiPaths.DIAL_LIST_ENTRY(diallistId))
        .then(res => {
          console.log(`Successfully deleted dial list entry with diallist_id ${diallistId}`, {
            responseData: res.data
          });
          refreshProfileData();
        })
        .catch(err => {
          console.error(`Failed to delete dial list entry with diallist_id ${diallistId}`, {
            err
          });
        // TODO: Alter UI to display something to the user
        });
    }
  };

  const submitButtonOnClickForInsert = form => {
    const requestBody = {
      contact_nme: form.contact_nme,
      contact_num: form.contact_num,
      external_num: form.external_num,
      profile_id: profileId
    };
    myAxios.post(apiPaths.DIAL_LIST, requestBody)
      .then(res => {
        console.log("Successfully inserted dial list entry", {
          responseData: res.data,
          requestBody
        });
        refreshProfileData();
        setDialListTableState({
          ...dialListTableState,
          isDialListEntryFormOpen: false
        });
        // TODO: success overlay
      })
      .catch(err => {
        console.error("Failed to insert dial list entry", {
          err,
          requestBody
        });
        // TODO: fail overlay
      });
  };

  const getSubmitButtonOnClickForUpdate = diallistId => form => {
    const requestBody = {
      contact_nme: form.contact_nme,
      contact_num: form.contact_num,
      external_num: form.external_num
    };
    myAxios.put(apiPaths.DIAL_LIST_ENTRY(diallistId), requestBody)
      .then(res => {
        console.log(`Successfully updated dial list entry with diallist_id ${diallistId}`, {
          responseData: res.data,
          requestBody
        });
        refreshProfileData();
        setDialListTableState({
          ...dialListTableState,
          isDialListEntryFormOpen: false
        });
        // TODO: success overlay
      })
      .catch(err => {
        console.error(`Failed to update dial list entry with diallist_id ${diallistId}`, {
          err,
          requestBody
        });
        // TODO: fail overlay
      });
  };

  const addContactButtonClicked = () => {
    setDialListTableState({
      dialListEntryFormHeaderText: "Add Dial List Entry",
      dialListEntryFormInitialValues: {
        contact_nme: "",
        contact_num: "",
        external_num: ""
      },
      dialListEntryFormSubmitFn: submitButtonOnClickForInsert,
      isDialListEntryFormOpen: true
    });
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
        <AddContactButtonContainer>
          <StyledButton onClick={addContactButtonClicked}>
            Add Contact
          </StyledButton>
        </AddContactButtonContainer>
        <StyledPaper elevation={3}>
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
                    dialListEntryFormHeaderText: "Edit Dial List Entry",
                    dialListEntryFormInitialValues: {
                      contact_nme: entry.contact_nme,
                      contact_num: entry.contact_num,
                      external_num: entry.external_num
                    },
                    dialListEntryFormSubmitFn: getSubmitButtonOnClickForUpdate(entry.diallist_id),
                    isDialListEntryFormOpen: true
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
            <Modal disableBackdropClick={true} open={dialListTableState.isDialListEntryFormOpen}>
              <DialListEntryForm
                headerText={dialListTableState.dialListEntryFormHeaderText}
                initialValues={dialListTableState.dialListEntryFormInitialValues}
                onClose={dialListEntryFormOnClose}
                onSubmit={dialListTableState.dialListEntryFormSubmitFn} />
            </Modal>
          </CustomTable>
        </StyledPaper>
      </TableContainer>
    );
  }
};

DialListTable.propTypes = {
  profile: PropTypes.object.isRequired,
  refreshProfileData: PropTypes.func.isRequired
};

export default DialListTable;
