import { isNumberValid } from "utils/numberUtils";
import { logger } from "utils/logger";
import {
  TextField, Tooltip
} from "@mui/material";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import { timeouts } from "globals";
import {
  DialListNumber, ModalOverlayStatuses
} from "globals/interfaces";
import React, { useState } from "react";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  createDialListEntry, editDialListEntry, listUMSoftphoneConfigs
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
      valid: phoneNumberState.formMode !== "Create"
    },
    external_num: phoneNumberState.entry.external_num || null,
    contact_name: phoneNumberState.entry.contact_name || null
  });

  const isPhoneNumberTaken = phoneNumberState.formMode === "Create" && filteredList.some((fl: DialListNumber) => fl.contact_num === formDialListEntry.contact_num.unmaskedValue);
  const isExternalNumberValid = formDialListEntry.external_num && isNumberValid(formDialListEntry.external_num) || !formDialListEntry.external_num;
  const isNameValid = !!formDialListEntry.contact_name?.trim().length;

  const isFormValid = isExternalNumberValid && !isPhoneNumberTaken && isNameValid && formDialListEntry.contact_num.valid;

  console.warn("Faith", isPhoneNumberTaken, isExternalNumberValid, isNameValid, formDialListEntry.contact_num.valid, formDialListEntry);

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
      await listUMSoftphoneConfigs(dispatch);
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
      delete requestBody.profile_id;
      await editDialListEntry(formDialListEntry.id, selectedProfile, requestBody);
      logger.info(`Successfully updated dial list ${formDialListEntry.contact_name}`, {
        nNumber,
        dialListId: formDialListEntry.id,
        requestBody
      });
      await listUMSoftphoneConfigs(dispatch);
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
        {loading.saveStatus &&
          <ModalOverlay
            message={loading.overlayMessage}
            status={loading.saveStatus}
          />}
        <Header>{phoneNumberState.formMode === "Create" ? "Add Dial List Entry" : "Edit Dial List Entry"}</Header>
        <PhoneNumberInput
          allowSevenDigitVdn={true}
          error={isPhoneNumberTaken && phoneNumberState.formMode === "Create"}
          helperText={isPhoneNumberTaken && phoneNumberState.formMode === "Create" && "Number already exists in dial list" }
          id="transfer-number-input"
          label="Transfer Number *"
          number={formDialListEntry.contact_num.maskedValue}
          disabled={phoneNumberState.formMode !== "Create"}
          showError={!!formDialListEntry.contact_num.maskedValue.length}
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
          helperText={!isNameValid && "Please enter a friendly name" }
          id="friendly-name-input"
          inputProps={{ maxLength: 80 }}
          label="Friendly Name *"
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
              error={!!(!isExternalNumberValid && formDialListEntry.external_num.length)}
              id="external-number-input"
              inputProps={{ maxLength: 80 }}
              label="External Number (Optional)"
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
          <StyledButton onClick={closeModal}>
            Close
          </StyledButton>
          <StyledButton disabled={!isFormValid} onClick={phoneNumberState.formMode === "Create" ? insertDialListEntry : updateDialListEntry}>
            Save
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};