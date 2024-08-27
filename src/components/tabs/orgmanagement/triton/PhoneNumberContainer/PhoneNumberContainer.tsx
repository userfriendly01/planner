import { Modal } from "@mui/material";
import { DirectoryNumberForm } from "orgmanagement/DirectoryNumberForm";
import { PhoneNumberTable } from "orgmanagement/PhoneNumberTable";
import { StyledButton } from "components/StyledButton";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import { timeouts } from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import React, { useState } from "react";
import { logger } from "utils/logger";
import {
  deleteDialListEntry, deleteDirectoryEntry,
  listUMSoftphoneConfigs
} from "services/profile";
import { ProfileDropDown } from "orgmanagement/ProfileDropDown";
import { ProfileSettingsContainerDiv } from "../ProfileSettingsContainer/ProfileSettingsContainer.Styles";
import { PhoneNumberStateProps } from "../PhoneNumberContainer/PhoneNumber.Interfaces";
import { DialListNumberForm } from "orgmanagement/DialListNumberForm";
import { useLocation } from "react-router-dom";
import {
  AddContactButtonContainer,
  TableContainer
} from "./PhoneNumber.Styles";

export const PhoneNumberContainer = () => {

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const params = useLocation();
  const type = params.pathname.includes("directory") ? "Directory" : "DialList";
  const { nNumber } = state.userContext;
  const {
    dialListEntries,
    directoryEntries
  } = state.profileContext;

  const defaultPhoneNumberState: PhoneNumberStateProps = {
    type,
    entry: null,
    formMode: "Create",
    isModalOpen: false,
    overlayMessage: "",
    saveState: {
      status: null
    }
  };

  const [phoneNumberState, setPhoneNumberState] = useState<PhoneNumberStateProps>(defaultPhoneNumberState);

  const [ selectedProfile, setSelectedProfile ] = React.useState(null);
  const isProfileSelected = selectedProfile || selectedProfile === 0;
  const filteredList = isProfileSelected  ? (type === "Directory" ? directoryEntries.filter((e: any) => e.profile_id === selectedProfile) : dialListEntries.filter((e: any) => e.profile_id === selectedProfile)) : [];
  const deleteFunction = type === "Directory" ? deleteDirectoryEntry : deleteDialListEntry;

  React.useEffect(() => {
    setSelectedProfile(null);
  }, [type]);

  const waitAndHideOverlay = () => setTimeout(() => {
    setPhoneNumberState({
      ...phoneNumberState,
      saveState: {
        overlayMessage: "",
        status: null
      }
    });
  }, timeouts.MODAL_OVERLAY);

  const deleteButtonOnClick = async (entry: any) => {
    const popUp = confirm(`Are you sure you want to delete this ${type} entry?`);
    if (popUp === true) {
      setPhoneNumberState({
        ...phoneNumberState,
        saveState: {
          overlayMessage: `Deleting ${type} entry...`,
          status: ModalOverlayStatuses.SAVING
        }
      });
      try {
        await deleteFunction(entry.id, entry.profile_id);
        logger.info(`Successfully deleted ${type} Entry`, {
          nNumber,
          type,
          entry: phoneNumberState.entry
        });
        await listUMSoftphoneConfigs(dispatch);
        setPhoneNumberState({
          ...phoneNumberState,
          saveState: {
            overlayMessage: `Successfully deleted ${type} entry`,
            status: ModalOverlayStatuses.SUCCESS
          }
        });
        waitAndHideOverlay();
      } catch(error){
        logger.error(`Failed to delete ${type} entry`, {
          nNumber,
          type,
          entry: phoneNumberState.entry,
          error
        });

        setPhoneNumberState({
          ...phoneNumberState,
          saveState: {
            overlayMessage: `Failed to delete ${type} entry`,
            status: ModalOverlayStatuses.FAIL
          }
        });
        waitAndHideOverlay();
      }
    }
  };

  const editButtonOnClick = (entry: any) => {
    setPhoneNumberState({
      ...defaultPhoneNumberState,
      entry,
      formMode: "Edit",
      isModalOpen: true
    });
  };

  const addButtonOnClick = () => {
    setPhoneNumberState({
      ...defaultPhoneNumberState,
      formMode: "Create",
      entry: {},
      isModalOpen: true
    });
  };

  return (
    <ProfileSettingsContainerDiv>
      <ProfileDropDown
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
      />
      {isProfileSelected &&
      <AddContactButtonContainer>
        <StyledButton onClick={addButtonOnClick}>
          Add {type} Entry
        </StyledButton>
      </AddContactButtonContainer>
      }
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
      { isProfileSelected &&
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
      }
    </ProfileSettingsContainerDiv>
  );
};