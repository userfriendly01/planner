import { Modal } from "@material-ui/core";
import {
  DirectoryEntryForm,
  PhoneNumberTable,
  StyledButton
} from "components";
import {
  formModes,
  ModalOverlayStatuses,
  timeouts
} from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { deleteDirectory } from "services";
import styled from "styled-components";

const AddContactButtonContainer = styled.div`
  display: flex;
  margin-bottom: 1em;
  width: 100%;
`;

const TableContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;

const Directory = props => {
  const {
    directory,
    profileId,
    refreshProfileData
  } = props;

  const [directoryState, setDirectoryState] = useState({
    directoryId: null,
    directoryEntryFormInitialValues: {},
    directoryEntryFormMode: "",
    isDirectoryEntryFormOpen: false,
    takenPhoneNums: [],
    overlayMessage: "",
    saveState: {
      status: null
    }
  });

  const waitAndHideOverlay = () => setTimeout(() => {
    setDirectoryState({
      ...directoryState,
      overlayMessage: "",
      saveState: {
        status: null
      }
    });
  }, timeouts.MODAL_OVERLAY);

  const deleteButtonOnClick = directoryId => () => {
    const popUp = confirm("Are you sure you want to delete this directory entry?");
    if (popUp === true) {
      setDirectoryState({
        ...directoryState,
        saveState: {
          overlayMessage: "Deleting directory entry...",
          status: ModalOverlayStatuses.SAVING
        }
      });
      deleteDirectory(directoryId)
        .then(() => {
          refreshProfileData();
          setDirectoryState({
            ...directoryState,
            saveState: {
              overlayMessage: "Successfully deleted directory entry",
              status: ModalOverlayStatuses.SUCCESS
            }
          });
          waitAndHideOverlay();
        })
        .catch(err => {
          console.error(`Failed to delete directory entry with directoryId ${directoryId}`, {
            err
          });
          setDirectoryState({
            ...directoryState,
            saveState: {
              overlayMessage: "Failed to delete directory entry",
              status: ModalOverlayStatuses.FAIL
            }
          });
          waitAndHideOverlay();
        });
    }
  };

  const editButtonOnClick = entry => () => {
    setDirectoryState({
      ...directoryState,
      directoryId: entry.directory_id,
      directoryEntryFormInitialValues: {
        first_nme: entry.first_nme,
        last_nme: entry.last_nme,
        phone_num: entry.phone_num
      },
      directoryEntryFormMode: formModes.UPDATE,
      isDirectoryEntryFormOpen: true,
      takenPhoneNums: directory.filter(e => e.directory_id !== entry.directory_id).map(e => e.phone_num)
    });
  };

  const addContactButtonClicked = () => {
    setDirectoryState({
      ...directoryState,
      directoryEntryFormInitialValues: {
        first_nme: "",
        last_nme: "",
        phone_num: ""
      },
      directoryEntryFormMode: formModes.INSERT,
      isDirectoryEntryFormOpen: true,
      takenPhoneNums: directory.map(entry => entry.phone_num)
    });
  };

  return (
    <TableContainer>
      <AddContactButtonContainer>
        <StyledButton onClick={addContactButtonClicked}>
          Add Directory Contact
        </StyledButton>
      </AddContactButtonContainer>
      <Modal
        disableBackdropClick={true}
        open={directoryState.isDirectoryEntryFormOpen}
      >
        <DirectoryEntryForm
          closeModal={() => setDirectoryState({
            ...directoryState,
            isDirectoryEntryFormOpen: false
          })}
          directoryState={directoryState}
          profileId={profileId}
          refreshProfileData={refreshProfileData}
        />
      </Modal>
      <PhoneNumberTable
        editFunction={editButtonOnClick}
        deleteFunction={deleteButtonOnClick}
        emptyListMsg={"No directory entries exist for this profile"}
        phoneNumberList={directory}
        saveState={directoryState.saveState}
      />
    </TableContainer>
  );
};

Directory.propTypes = {
  directory: PropTypes.array.isRequired,
  profileId: PropTypes.string.isRequired,
  refreshProfileData: PropTypes.func.isRequired
};

export default Directory;
