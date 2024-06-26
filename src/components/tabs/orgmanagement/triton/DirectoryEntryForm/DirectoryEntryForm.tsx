import {
  isNumberValid, unMaskPhoneNumber
} from "utils/numberUtils";
import { logger } from "utils/logger";
import { TextField } from "@mui/material";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import {
  formModes, timeouts
} from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import React, { useState } from "react";
import styled from "styled-components";
import { useAdminState } from "context/appContext";
import {
  createDirectoryEntry, editDirectoryEntry
} from "services/profile";

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const Header = styled.h1`
  align-self: center;
`;

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export interface DirectoryEntryFormInitialValuesProps {
  directory_id?: number,
  first_nme?: string,
  last_nme?: string,
  phone_num?: string
}

export interface DirectoryStateProps {
  directoryId?: number,
  directoryEntryFormInitialValues?: DirectoryEntryFormInitialValuesProps,
  directoryEntryFormMode?: string,
  takenPhoneNums?: any[],
  isDirectoryEntryFormOpen?: boolean,
  overlayMessage?: string,
  saveState?: { status: ModalOverlayStatuses, overlayMessage?: string }
}

interface DirectoryEntryFormProps {
    directoryState: DirectoryStateProps,
    closeModal: VoidFunction,
    profileId: string | number,
    refreshProfileData: VoidFunction,
}

const validateStringNotEmpty = (value: string) => value.length > 0;

export const DirectoryEntryForm = (props: DirectoryEntryFormProps) => {
  const {
    closeModal,
    directoryState,
    profileId,
    refreshProfileData
  } = props;

  const state = useAdminState();
  const { nNumber } = state.userContext;

  const getInitialFormState = () => {
    const first_nme = directoryState.directoryEntryFormInitialValues.first_nme || "";
    const last_nme = directoryState.directoryEntryFormInitialValues.last_nme || "";
    const phone_num = directoryState.directoryEntryFormInitialValues.phone_num || "";
    return {
      first_nme,
      first_nme_updated: false,
      first_nme_valid: validateStringNotEmpty(first_nme),
      last_nme,
      last_nme_updated: false,
      last_nme_valid: validateStringNotEmpty(last_nme),
      phone_num,
      phone_num_is_duplicate: false,
      phone_num_updated: false,
      phone_num_valid: isNumberValid(unMaskPhoneNumber(phone_num)), // unmasked phone number value ex: `8005554444`
      maskedPhoneNumber: phone_num // raw masked phone number value to properly update PhoneNumberInput with ex: `(800) 555-4444`,
    };
  };

  const [form, setForm] = useState(getInitialFormState());
  const [loading, setLoading] = useState({
    overlayMessage: "",
    saveStatus: null
  });

  const firstNameValid = form.first_nme_updated && !form.first_nme_valid;
  const formValid = form.first_nme_valid && form.last_nme_valid && form.phone_num_valid && !form.phone_num_is_duplicate;
  const lastNameValid = form.last_nme_updated && !form.last_nme_valid;

  const updateStateFromService = (success: boolean, added: boolean) => {
    if (success) {
      refreshProfileData();
      setLoading({
        overlayMessage: `Successfully ${added ? "added" : "updated"} directory entry`,
        saveStatus: ModalOverlayStatuses.SUCCESS
      });
      waitAndHideOverlay(true);
    } else {
      setLoading({
        overlayMessage: `Failed to ${added ? "add" : "update"} directory entry`,
        saveStatus: ModalOverlayStatuses.FAIL
      });
      waitAndHideOverlay();
    }
  };

  const waitAndHideOverlay = (closeDialListEntryForm?: boolean) => setTimeout(() => {
    if (closeDialListEntryForm) {
      closeModal();
    } else {
      setLoading({
        overlayMessage: "",
        saveStatus: null
      });
    }
  }, timeouts.MODAL_OVERLAY);

  const insertDirectoryEntry = () => {
    setLoading({
      overlayMessage: "Adding directory entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });
    createDirectoryEntry({
      directory_num: form.phone_num,
      first_name: form.first_nme,
      last_name: form.last_nme,
      profile_id: typeof profileId === "string" ? parseInt(profileId) : profileId
    }).then(() => {
      logger.info(`Successfully inserted directory ${directoryState.directoryId}`, {
        nNumber,
        directoryId: directoryState.directoryId
      });
      updateStateFromService(true, true);
    })
      .catch(() => {
        logger.info(`Failed to insert directory ${directoryState.directoryId}`, {
          nNumber,
          directoryId: directoryState.directoryId
        });
        updateStateFromService(false, true);
      });
  };

  const updateDirectoryEntry = () => {
    setLoading({
      overlayMessage: "Updating directory entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });
    editDirectoryEntry("", typeof profileId === "string" ? parseInt(profileId) : profileId, {
      directory_num: form.phone_num,
      first_name: form.first_nme,
      last_name: form.last_nme,
      profile_id: typeof profileId === "string" ? parseInt(profileId) : profileId
    })
      .then(() => {
        logger.info(`Successfully updated directory ${directoryState.directoryId}`, {
          nNumber,
          directoryId: directoryState.directoryId
        });
        updateStateFromService(true, false);
      })
      .catch(() => {
        logger.info(`Failed to update directory ${directoryState.directoryId}`, {
          nNumber,
          directoryId: directoryState.directoryId
        });
        updateStateFromService(false, false);
      });
  };

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveStatus ?
          <ModalOverlay
            message={loading.overlayMessage}
            status={loading.saveStatus}
          /> : null}
        <Header>{directoryState.directoryEntryFormMode === formModes.INSERT ? "Add Directory Entry" : "Edit Directory Entry"}</Header>
        <PhoneNumberInput
          allowSevenDigitVdn={false}
          error={form.phone_num_is_duplicate}
          helperText={form.phone_num_is_duplicate ? "Number already exists in directory" : null}
          id="transfer-number-input"
          label="Transfer Number"
          number={form.maskedPhoneNumber}
          onBlur={() => setForm({
            ...form,
            phone_num_updated: true
          })}
          showError={form.phone_num_updated}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setForm({
              ...form,
              phone_num: unmaskedValue,
              phone_num_is_duplicate: directoryState.takenPhoneNums.includes(unmaskedValue),
              phone_num_valid: isValid,
              maskedPhoneNumber: maskedValue
            });
          }}
        />
        <TextField
          error={firstNameValid}
          helperText={firstNameValid ? "Please enter a first name" : null}
          id="first-name-input"
          inputProps={{ maxLength: 80 }}
          label="First Name"
          name="First Name"
          onBlur={() => setForm({
            ...form,
            first_nme_updated: true
          })}
          onChange={({
            target: { value }
          }) => setForm({
            ...form,
            first_nme: value,
            first_nme_valid: validateStringNotEmpty(value)
          })}
          margin="normal"
          variant="outlined"
          value={form.first_nme}
        />
        <TextField
          error={lastNameValid}
          helperText={lastNameValid ? "Please enter a last name" : null}
          id="last-name-input"
          inputProps={{ maxLength: 80 }}
          label="Last Name"
          name="Last Name"
          onBlur={() => setForm({
            ...form,
            last_nme_updated: true
          })}
          onChange={({
            target: { value }
          }) => setForm({
            ...form,
            last_nme: value,
            last_nme_valid: validateStringNotEmpty(value)
          })}
          margin="normal"
          variant="outlined"
          value={form.last_nme}
        />
        <ButtonWrapper>
          <StyledButton disabled={!formValid} onClick={directoryState.directoryEntryFormMode === formModes.INSERT ? insertDirectoryEntry : updateDirectoryEntry}>
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