import { logger } from "utils/logger";
import { TextField } from "@mui/material";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import { timeouts } from "globals";
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
import { LIST_SOFTPHONE_CONFIG } from "globals/graphql/profile";
import { getPaginatedResults } from "utils/graphUtils";

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
      valid: phoneNumberState.formMode !== "Create"
    },
    first_name: phoneNumberState.entry.first_name || "",
    last_name: phoneNumberState.entry.last_name || ""
  });

  const isPhoneNumberTaken = phoneNumberState.formMode === "Create" && filteredList.some((fl: DirectoryNumber) => fl.directory_num === formDirectoryEntry.directory_num.unmaskedValue);
  const isNameValid = (name: string) => !!name?.trim().length;

  const isFormValid = formDirectoryEntry.directory_num.valid && !isPhoneNumberTaken && isNameValid(formDirectoryEntry.first_name) && isNameValid(formDirectoryEntry.last_name);

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
      await getPaginatedResults(LIST_SOFTPHONE_CONFIG, dispatch);
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
      delete requestBody.profile_id;
      await editDirectoryEntry(formDirectoryEntry.id, selectedProfile, requestBody);
      logger.info(`Successfully updated directory ${formDirectoryEntry.directory_num}`, {
        nNumber,
        directoryId: formDirectoryEntry.id,
        requestBody
      });
      await getPaginatedResults(LIST_SOFTPHONE_CONFIG, dispatch);
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
        <Header>{phoneNumberState.formMode === "Create" ? `Add ${phoneNumberState.type} Entry` : `Edit ${phoneNumberState.type} Entry`}</Header>
        <PhoneNumberInput
          allowSevenDigitVdn={false}
          error={isPhoneNumberTaken && phoneNumberState.formMode === "Create"}
          helperText={isPhoneNumberTaken && phoneNumberState.formMode === "Create" && "Number already exists in directory"}
          id="transfer-number-input"
          label="Transfer Number *"
          number={formDirectoryEntry.directory_num.maskedValue}
          showError={!!formDirectoryEntry.directory_num.maskedValue.length}
          disabled={phoneNumberState.formMode !== "Create"}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setFormDirectoryEntry({
              ...formDirectoryEntry,
              directory_num: {
                ...formDirectoryEntry.directory_num,
                maskedValue: maskedValue,
                unmaskedValue: unmaskedValue,
                valid: isValid
              }
            });
          }}
        />
        <TextField
          helperText={!isNameValid(formDirectoryEntry.first_name) && "Please enter a first name"}
          id="first-name-input"
          inputProps={{ maxLength: 80 }}
          label="First Name *"
          name="First Name"
          onChange={({
            target: { value }
          }) => setFormDirectoryEntry({
            ...formDirectoryEntry,
            first_name: value
          })}
          margin="normal"
          variant="outlined"
          value={formDirectoryEntry.first_name}
        />
        <TextField
          helperText={!isNameValid(formDirectoryEntry.last_name) && "Please enter a last name" }
          id="last-name-input"
          inputProps={{ maxLength: 80 }}
          label="Last Name *"
          name="Last Name *"
          onChange={({
            target: { value }
          }) => setFormDirectoryEntry({
            ...formDirectoryEntry,
            last_name: value
          })}
          margin="normal"
          variant="outlined"
          value={formDirectoryEntry.last_name}
        />
        <ButtonWrapper>
          <StyledButton onClick={closeModal}>
            Close
          </StyledButton>
          <StyledButton disabled={!isFormValid} onClick={phoneNumberState.formMode === "Create" ? insertDirectoryEntry : updateDirectoryEntry}>
            Save
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};