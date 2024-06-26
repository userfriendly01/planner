import { Modal } from "@mui/material";
import { DirectoryNumberForm } from "orgmanagement/DirectoryNumberForm";

import { PhoneNumberTable } from "orgmanagement/PhoneNumberTable";
import { StyledButton } from "components/StyledButton";
import { useAdminState } from "context/appContext";
import { timeouts } from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import React, { useState } from "react";
import styled from "styled-components";
import { logger } from "utils/logger";
import {
  deleteDialListEntry, deleteDirectoryEntry
} from "services/profile";
import { ProfileDropDown } from "../ProfileDropDown/ProfileDropDown";
import { ProfileSettingsContainerDiv } from "../ProfileSettingsContainer/ProfileSettingsContainer.Styles";
import { PhoneNumberStateProps } from "../PhoneNumberContainer/PhoneNumber.Interfaces";
import { DialListNumberForm } from "./PhoneNumberForm/DialListNumberForm";
import { useLocation } from "react-router-dom";

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


export const PhoneNumberContainer = () => {

  const state = useAdminState();
  const params = useLocation();
  const type = params.pathname.includes("directory") ? "Directory" : "DialList";
  console.log("FAITH type", type);
  const { nNumber } = state.userContext;
  const {
    dialListEntries,
    directoryEntries
  } = state.profileContext;

  const [phoneNumberState, setPhoneNumberState] = useState<PhoneNumberStateProps>({
    type,
    entry: null,
    formMode: "Create",
    isModalOpen: false,
    overlayMessage: "",
    saveState: {
      status: null
    }
  });

  const [ selectedProfile, setSelectedProfile ] = React.useState(null);
  const filteredList = selectedProfile ? (type === "Directory" ? directoryEntries.filter((e: any) => e.profile_id === selectedProfile) : dialListEntries.filter((e: any) => e.profile_id === selectedProfile)) : [];
  const deleteFunction = type === "Directory" ? deleteDirectoryEntry : deleteDialListEntry;

  const waitAndHideOverlay = () => setTimeout(() => {
    setPhoneNumberState({
      ...phoneNumberState,
      overlayMessage: "",
      saveState: {
        status: null
      }
    });
  }, timeouts.MODAL_OVERLAY);

  const deleteButtonOnClick = (entry: any) => () => {
    const popUp = confirm(`Are you sure you want to delete this ${type} entry?`);
    if (popUp === true) {
      setPhoneNumberState({
        ...phoneNumberState,
        saveState: {
          overlayMessage: "Deleting directory entry...",
          status: ModalOverlayStatuses.SAVING
        }
      });
      deleteFunction(entry.id, entry.profile_id)
        .then(() => {
          logger.info(`Successfully deleted ${type} Entry`, {
            nNumber,
            type,
            entry: phoneNumberState.entry
          });

          setPhoneNumberState({
            ...phoneNumberState,
            saveState: {
              overlayMessage: `Successfully deleted ${type} entry`,
              status: ModalOverlayStatuses.SUCCESS
            }
          });
          waitAndHideOverlay();
        })
        .catch((error: any) => {
          logger.error(`Failed to delete ${type} entry`, {
            nNumber,
            type,
            entry: phoneNumberState.entry,
            error
          });

          setPhoneNumberState({
            ...phoneNumberState,
            saveState: {
              overlayMessage: "Failed to delete directory entry",
              status: ModalOverlayStatuses.FAIL
            }
          });
          waitAndHideOverlay();
        });
    }
  };

  const editButtonOnClick = (entry: any) => () => {
    setPhoneNumberState({
      ...phoneNumberState,
      entry,
      formMode: "Edit",
      isModalOpen: true
    });
  };

  const addContactButtonClicked = () => {
    setPhoneNumberState({
      ...phoneNumberState,
      entry: {
        first_nme: "",
        last_nme: "",
        phone_num: ""
      },
      isModalOpen: true
    });
  };

  return (
    <ProfileSettingsContainerDiv>
      <ProfileDropDown
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
      />
      <AddContactButtonContainer>
        <StyledButton onClick={addContactButtonClicked}>
          Add {type} Entry
        </StyledButton>
      </AddContactButtonContainer>
      <Modal
        onClose={() => { return; }}
        open={phoneNumberState.isModalOpen}
      >
        <>
          {type === "Directory" &&
            <DirectoryNumberForm
              closeModal={() => setPhoneNumberState({
                ...phoneNumberState,
                isModalOpen: false
              })}
              filteredList={filteredList}
              phoneNumberState={phoneNumberState}
              selectedProfile={selectedProfile}
            />
          }
          {type === "DialList" &&
            <DialListNumberForm
              closeModal={() => setPhoneNumberState({
                ...phoneNumberState,
                isModalOpen: false
              })}
              filteredList={filteredList}
              phoneNumberState={phoneNumberState}
              selectedProfile={selectedProfile}
            />
          }
        </>
      </Modal>
      {
        selectedProfile !== null
          ?
          <TableContainer>
            <PhoneNumberTable
              type={type}
              filteredList={filteredList}
              editFunction={editButtonOnClick}
              deleteFunction={deleteButtonOnClick}
              selectedProfile={selectedProfile}
              saveState={phoneNumberState.saveState}
            />
          </TableContainer>
          :
          null
      }
    </ProfileSettingsContainerDiv>
  );
};