import { isNumberValid } from "utils/numberUtils";
import { logger } from "utils/logger";
import { TextField } from "@mui/material";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import {
  formModes, timeouts
} from "globals";
import {
  DirectoryNumber, ModalOverlayStatuses
} from "globals/interfaces";
import React, { useState } from "react";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  createDirectoryEntry, editDirectoryEntry
} from "services/profile";
import {
  PhoneNumberFormProps, DirectoryFormEntryProps
} from "../PhoneNumber.Interfaces";
import {
  ModalContainer,
  Header,
  ButtonWrapper
} from "../PhoneNumber.Styles";

export const DirectoryNumberForm = (props: PhoneNumberFormProps) => {
  const {
    closeModal,
    filteredList,
    phoneNumberState,
    selectedProfile
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const { nNumber } = state.userContext;

  const [loading, setLoading] = useState({
    overlayMessage: "",
    saveStatus: null
  });


  const [formDirectoryEntry, setFormDirectoryEntry] = React.useState<DirectoryFormEntryProps>({
    id: phoneNumberState.entry.id || null,
    directory_num: {
      maskedValue: phoneNumberState.entry.directory_num || "",
      unmaskedValue: phoneNumberState.entry.directory_num || "",
      valid: false
    },
    first_name: phoneNumberState.entry.first_name || "",
    last_name: phoneNumberState.entry.last_name || "",
    updated: false
  });

  const isPhoneNumberTaken = filteredList.some((fl: DirectoryNumber) => fl.directory_num === phoneNumberState.entry.directory_num);
  const isNameValid = (name: string) => name?.trim().length;

  const isFormValid = () => isNumberValid(phoneNumberState.entry.directory_num)
      && !isPhoneNumberTaken && isNameValid(phoneNumberState.entry.first_name)
      && isNameValid(phoneNumberState.entry.last_name);

  const refreshState = () => {
    const filteredArray = state.profileContext.directoryEntries.filter((de: DirectoryNumber) => de.id !== phoneNumberState.entry.id);
    dispatch({
      type: "loadProfileOptions",
      payload: {
        ...state.profileContext,
        directoryEntries: [...filteredArray, phoneNumberState.entry]
      }
    });
  };

  const requestBody: Partial<DirectoryNumber> = {
    directory_num: formDirectoryEntry.directory_num.unmaskedValue,
    first_name: formDirectoryEntry.first_name,
    last_name: formDirectoryEntry.last_name,
    profile_id: selectedProfile
  };

  const insertDirectoryEntry = async () => {
    setLoading({
      overlayMessage: "Adding directory entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });

    try {
      await createDirectoryEntry(requestBody);
      logger.info(`Successfully created directory ${formDirectoryEntry.directory_num}`, {
        nNumber,
        directoryId: formDirectoryEntry.id,
        requestBody
      });
      refreshState();
      setLoading({
        overlayMessage: "Successfully created directory entry",
        saveStatus: ModalOverlayStatuses.SUCCESS
      });
      setTimeout(closeModal, timeouts.MODAL_OVERLAY);
    } catch(error){
      logger.info(`Failed to create directory ${formDirectoryEntry.id}`, {
        nNumber,
        error,
        directoryId: formDirectoryEntry.id,
        requestBody
      });
      setLoading({
        overlayMessage: "Failed to create directory entry",
        saveStatus: ModalOverlayStatuses.FAIL
      });
      setTimeout(() => setLoading({
        overlayMessage: "",
        saveStatus: null
      }), timeouts.MODAL_OVERLAY);
    }
  };

  const updateDirectoryEntry = async () => {
    setLoading({
      overlayMessage: "Updating directory entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });

    try {
      await editDirectoryEntry(formDirectoryEntry.id, selectedProfile, requestBody);
      logger.info(`Successfully updated directory ${formDirectoryEntry.directory_num}`, {
        nNumber,
        directoryId: formDirectoryEntry.id,
        requestBody
      });
      refreshState();
      setLoading({
        overlayMessage: "Successfully updated directory entry",
        saveStatus: ModalOverlayStatuses.SUCCESS
      });
      setTimeout(closeModal, timeouts.MODAL_OVERLAY);
    } catch(error){
      logger.info(`Failed to update directory ${formDirectoryEntry.id}`, {
        nNumber,
        error,
        directoryId: formDirectoryEntry.id,
        requestBody
      });
      setLoading({
        overlayMessage: "Failed to update directory entry",
        saveStatus: ModalOverlayStatuses.FAIL
      });
      setTimeout(() => setLoading({
        overlayMessage: "",
        saveStatus: null
      }), timeouts.MODAL_OVERLAY);
    }
  };

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveStatus ?
          <ModalOverlay
            message={loading.overlayMessage}
            status={loading.saveStatus}
          /> : null}
        <Header>{phoneNumberState.formMode === formModes.INSERT ? `Add ${phoneNumberState.type} Entry` : `Edit ${phoneNumberState.type} Entry`}</Header>
        <PhoneNumberInput
          allowSevenDigitVdn={false}
          error={isPhoneNumberTaken}
          helperText={isPhoneNumberTaken && "Number already exists in directory"}
          id="transfer-number-input"
          label="Transfer Number"
          number={formDirectoryEntry.directory_num.maskedValue}
          showError={formDirectoryEntry.updated}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setFormDirectoryEntry({
              ...formDirectoryEntry,
              updated: true,
              directory_num: {
                ...formDirectoryEntry.directory_num,
                maskedValue: unmaskedValue,
                unmaskedValue: maskedValue,
                valid: isValid
              }
            });
          }}
        />
        <TextField
          error={!isNameValid(formDirectoryEntry.first_name)}
          helperText={!isNameValid(formDirectoryEntry.first_name) || "Please enter a first name"}
          id="first-name-input"
          inputProps={{ maxLength: 80 }}
          label="First Name"
          name="First Name"
          onChange={({
            target: { value }
          }) => setFormDirectoryEntry({
            ...formDirectoryEntry,
            updated: true,
            first_name: value
          })}
          margin="normal"
          variant="outlined"
          value={formDirectoryEntry.first_name}
        />
        <TextField
          error={!isNameValid(formDirectoryEntry.first_name)}
          helperText={!isNameValid(formDirectoryEntry.first_name) || "Please enter a last name" }
          id="last-name-input"
          inputProps={{ maxLength: 80 }}
          label="Last Name"
          name="Last Name"
          onChange={({
            target: { value }
          }) => setFormDirectoryEntry({
            ...formDirectoryEntry,
            updated: true,
            last_name: value
          })}
          margin="normal"
          variant="outlined"
          value={formDirectoryEntry.last_name}
        />
        <ButtonWrapper>
          <StyledButton disabled={!isFormValid} onClick={phoneNumberState.formMode === formModes.INSERT ? insertDirectoryEntry : updateDirectoryEntry}>
            Save
          </StyledButton>
          <StyledButton onClick={closeModal}>
            Close
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};