import {
  isNumberValid,
  unMaskPhoneNumber
} from "@lmig/phone-number-utils";
import { TextField } from "@material-ui/core";
import {
  PaperContainer,
  ModalPhoneNumber,
  ModalOverlay,
  StyledButton
} from "components";
import {
  formModes,
  modalOverlayStatuses,
  modalOverlayTimeout
} from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  insertDirectory,
  updateDirectory
} from "services";
import styled from "styled-components";

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

const DirectoryEntryForm = props => {
  const {
    closeModal,
    directoryState,
    profileId,
    refreshProfileData
  } = props;

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
      maskedPhoneNumber: phone_num // raw masked phone number value to properly update ModalPhoneNumber with ex: `(800) 555-4444`,
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
        saveStatus: modalOverlayStatuses.SUCCESS
      });
      waitAndHideOverlay(true);
    } else {
      setLoading({
        overlayMessage: `Failed to ${added ? "add" : "update"} directory entry`,
        saveStatus: modalOverlayStatuses.FAIL
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
  }, modalOverlayTimeout);

  const insertDirectoryEntry = () => {
    setLoading({
      overlayMessage: "Adding directory entry...",
      saveStatus: modalOverlayStatuses.SAVING
    });
    insertDirectory(form.first_nme, form.last_nme, form.phone_num, profileId)
      .then(() => {
        updateStateFromService(true, true);
      })
      .catch(() => {
        updateStateFromService(false, true);
      });
  };

  const updateDirectoryEntry = () => {
    setLoading({
      overlayMessage: "Updating directory entry...",
      saveStatus: modalOverlayStatuses.SAVING
    });
    updateDirectory(directoryState.directoryId, form.first_nme, form.last_nme, form.phone_num)
      .then(() => {
        updateStateFromService(true, false);
      })
      .catch(() => {
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
        <ModalPhoneNumber
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

export default DirectoryEntryForm;