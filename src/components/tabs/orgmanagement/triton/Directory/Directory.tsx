import { Modal } from "@mui/material";
import { DirectoryEntryForm } from "orgmanagement/DirectoryEntryForm";
import {
  DirectoryStateProps, DirectoryEntryFormInitialValuesProps
} from "../DirectoryEntryForm/DirectoryEntryForm";
import { PhoneNumberTable } from "orgmanagement/PhoneNumberTable";
import { StyledButton } from "components/StyledButton";
import { useAdminState } from "context/appContext";
import {
  formModes, timeouts
} from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import React, { useState } from "react";
import styled from "styled-components";
import { logger } from "utils/logger";
import { deleteDirectoryEntry } from "services/profile";

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

interface DirectoryProps {
    directory: any[],
    profileId: number | string,
    refreshProfileData: () => void
}

export const Directory = (props: DirectoryProps) => {
  const {
    directory,
    profileId,
    refreshProfileData
  } = props;

  const state = useAdminState();
  const { nNumber } = state.userContext;

  const [directoryState, setDirectoryState] = useState<DirectoryStateProps>({
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

  const deleteButtonOnClick = (directoryId: number) => () => {
    const popUp = confirm("Are you sure you want to delete this directory entry?");
    if (popUp === true) {
      setDirectoryState({
        ...directoryState,
        saveState: {
          overlayMessage: "Deleting directory entry...",
          status: ModalOverlayStatuses.SAVING
        }
      });
      deleteDirectoryEntry(directoryId.toString(), 3) //Faith
        .then(() => {
          logger.info(`Successfully deleted directory ${directoryId}`, {
            nNumber,
            directoryId
          });

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
        .catch((error: any) => {
          logger.error(`Failed to delete directory entry with directoryId ${directoryId}`, {
            nNumber,
            directoryId,
            error
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

  const editButtonOnClick = (entry: DirectoryEntryFormInitialValuesProps) => () => {
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
        onClose={() => { return; }}
        open={directoryState.isDirectoryEntryFormOpen}
      >
        <>
          <DirectoryEntryForm
            closeModal={() => setDirectoryState({
              ...directoryState,
              isDirectoryEntryFormOpen: false
            })}
            directoryState={directoryState}
            profileId={profileId}
            refreshProfileData={refreshProfileData}
          />
        </>
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