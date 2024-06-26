import { isNumberValid } from "utils/numberUtils";
import { logger } from "utils/logger";
import {
  TextField, Tooltip
} from "@mui/material";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import {
  formModes, timeouts
} from "globals";
import {
  DialListNumber, ModalOverlayStatuses
} from "globals/interfaces";
import React, { useState } from "react";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  createDialListEntry, editDialListEntry
} from "services/profile";
import {
  PhoneNumberFormProps, DialListFormEntryProps
} from "../PhoneNumber.Interfaces";
import {
  ModalContainer,
  Header,
  ButtonWrapper,
  ExternalNumberContainer,
  InfoOutlinedStyled
} from "../PhoneNumber.Styles";

export const DialListNumberForm = (props: PhoneNumberFormProps) => {
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


  const [formDialListEntry, setFormDialListEntry] = React.useState<DialListFormEntryProps>({
    id: phoneNumberState.entry.id || null,
    contact_num: {
      maskedValue: phoneNumberState.entry.contact_num || "",
      unmaskedValue: phoneNumberState.entry.contact_num || "",
      valid: false
    },
    external_num: phoneNumberState.entry.external_num || "",
    contact_name: phoneNumberState.entry.contact_name || "",
    updated: false
  });

  const isPhoneNumberTaken = filteredList.some((fl: DialListNumber) => fl.contact_num === phoneNumberState.entry.contact_num);
  const isNameValid = (name: string) => !!name?.trim().length;

  const isFormValid = () => isNumberValid(phoneNumberState.entry.contact_num)
      && !isPhoneNumberTaken && isNameValid(phoneNumberState.entry.contact_name);

  const refreshState = () => {
    const filteredArray = state.profileContext.dialListEntries.filter((de: DialListNumber) => de.id !== phoneNumberState.entry.id);
    dispatch({
      type: "loadProfileOptions",
      payload: {
        ...state.profileContext,
        dialListEntries: [...filteredArray, phoneNumberState.entry]
      }
    });
  };

  const requestBody: Partial<DialListNumber> = {
    contact_num: formDialListEntry.contact_num.unmaskedValue,
    contact_name: formDialListEntry.contact_name,
    external_num: formDialListEntry.external_num,
    profile_id: selectedProfile
  };

  const insertDialListEntry = async () => {
    setLoading({
      overlayMessage: "Adding dial list entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });

    try {
      await createDialListEntry(requestBody);
      logger.info(`Successfully created dial list entry ${formDialListEntry.contact_name}`, {
        nNumber,
        dialListId: formDialListEntry.id,
        requestBody
      });
      refreshState();
      setLoading({
        overlayMessage: "Successfully created dial list entry",
        saveStatus: ModalOverlayStatuses.SUCCESS
      });
      setTimeout(closeModal, timeouts.MODAL_OVERLAY);
    } catch(error){
      logger.info(`Failed to create dial list entry ${formDialListEntry.id}`, {
        nNumber,
        error,
        dialListId: formDialListEntry.id,
        requestBody
      });
      setLoading({
        overlayMessage: "Failed to create dial list entry",
        saveStatus: ModalOverlayStatuses.FAIL
      });
      setTimeout(() => setLoading({
        overlayMessage: "",
        saveStatus: null
      }), timeouts.MODAL_OVERLAY);
    }
  };

  const updateDialListEntry = async () => {
    setLoading({
      overlayMessage: "Updating dial list entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });

    try {
      await editDialListEntry(formDialListEntry.id, selectedProfile, requestBody);
      logger.info(`Successfully updated dial list ${formDialListEntry.contact_name}`, {
        nNumber,
        dialListId: formDialListEntry.id,
        requestBody
      });
      refreshState();
      setLoading({
        overlayMessage: "Successfully updated dial list entry",
        saveStatus: ModalOverlayStatuses.SUCCESS
      });
      setTimeout(closeModal, timeouts.MODAL_OVERLAY);
    } catch(error){
      logger.info(`Failed to update dial list ${formDialListEntry.id}`, {
        nNumber,
        error,
        dialListId: formDialListEntry.id,
        requestBody
      });
      setLoading({
        overlayMessage: "Failed to update dial list entry",
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
        <Header>{phoneNumberState.formMode === formModes.INSERT ? "Add Dial List Entry" : "Edit Dial List Entry"}</Header>
        <PhoneNumberInput
          allowSevenDigitVdn={true}
          error={isPhoneNumberTaken}
          helperText={isPhoneNumberTaken && "Number already exists in dial list" }
          id="transfer-number-input"
          label="Transfer Number"
          number={formDialListEntry.contact_num.maskedValue}
          showError={formDialListEntry.updated}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setFormDialListEntry({
              ...formDialListEntry,
              contact_num: {
                ...formDialListEntry.contact_num,
                maskedValue,
                unmaskedValue,
                valid: isValid
              }
            });
          }}
        />
        <TextField
          error={isNameValid(formDialListEntry.contact_name)}
          helperText={isNameValid(formDialListEntry.contact_name) && "Please enter a friendly name" }
          id="friendly-name-input"
          inputProps={{ maxLength: 80 }}
          label="Friendly Name"
          name="Friendly Name"
          onChange={({
            target: { value }
          }) => setFormDialListEntry({
            ...formDialListEntry,
            contact_name: value
          })}
          margin="normal"
          variant="outlined"
          value={formDialListEntry.contact_name}
        />
        <ExternalNumberContainer>
          <div style={{ width: "100%" }}>
            <TextField
              fullWidth={true}
              id="external-number-input"
              inputProps={{ maxLength: 80 }}
              label="External Number"
              name="External Number"
              onChange={event => setFormDialListEntry({
                ...formDialListEntry,
                external_num: event.target.value
              })}
              margin="normal"
              variant="outlined"
              value={formDialListEntry.external_num}
            />
          </div>
          <div style={{ padding: "0 .5em" }}>
            <Tooltip title={"External number to share with customer"}>
              <InfoOutlinedStyled />
            </Tooltip>
          </div>
        </ExternalNumberContainer>
        <ButtonWrapper>
          <StyledButton disabled={!isFormValid} onClick={phoneNumberState.formMode === formModes.INSERT ? insertDialListEntry : updateDialListEntry}>
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