import {
  isNumberValid, unMaskPhoneNumber
} from "utils/formatNumberUtils";
import { logger } from "utils/logger";
import { TextField } from "@mui/material";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import {
  formModes, timeouts
} from "globals/index";
import { ModalOverlayStatuses } from "globals/interfaces";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  insertDirectory,
  updateDirectory
} from "services/directory";
import styled from "styled-components";
import { useAdminState } from "context/appContext";

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

const validateStringNotEmpty = value => value.length > 0;

export const DirectoryEntryForm = props => {
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

  const updateStateFromService = (success, added) => {
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

  const waitAndHideOverlay = closeDialListEntryForm => setTimeout(() => {
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
    insertDirectory(form.first_nme, form.last_nme, form.phone_num, profileId)
      .then(() => {
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
    updateDirectory(directoryState.directoryId, form.first_nme, form.last_nme, form.phone_num)
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

DirectoryEntryForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  directoryState: PropTypes.shape({
    directoryId: PropTypes.number,
    directoryEntryFormInitialValues: PropTypes.shape({
      first_nme: PropTypes.string,
      last_nme: PropTypes.string,
      phone_num: PropTypes.string
    }).isRequired,
    directoryEntryFormMode: PropTypes.string.isRequired,
    takenPhoneNums: PropTypes.array.isRequired
  }).isRequired,
  profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshProfileData: PropTypes.func.isRequired
};