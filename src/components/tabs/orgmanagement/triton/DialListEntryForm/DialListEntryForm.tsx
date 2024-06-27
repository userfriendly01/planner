import {
  isNumberValid, unMaskPhoneNumber
} from "utils/numberUtils";
import { logger } from "utils/logger";
import {
  TextField,
  Tooltip
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { PaperContainer } from "components/PaperContainer";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { ModalOverlay } from "components/ModalOverlay";
import { StyledButton } from "components/StyledButton";
import {
  apiPaths,
  formModes,
  timeouts
} from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import React, { useState } from "react";
import styled from "styled-components";
import { myAxios } from "utils/myAxios";
import { useAdminState } from "context/appContext";

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const ExternalNumberContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.h1`
  align-self: center;
`;

const InfoOutlinedStyled = styled(InfoOutlined)`
  && {
    font-size: 1.5em;
  }
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

const InfoIconContainer = styled.div`
  padding: 0 .5em;
`;

const TextFieldContainer = styled.div`
  width: 100%;
`;

interface DialListEntryFormInitialValuesProps {
  contact_nme?: string,
  contact_num?: string,
  external_num?: string
}

export interface DialListTableStateProps {
  dialListId?: number,
  dialListEntryFormInitialValues?: DialListEntryFormInitialValuesProps,
  dialListEntryFormMode?: string,
  isDialListEntryFormOpen?: boolean,
  otherContactNums?: any[],
  overlayMessage?: string,
  saveStatus?: ModalOverlayStatuses
}

interface DialListEntryFormProps {
    dialListTableState: DialListTableStateProps,
    profileId: string | number,
    refreshProfileData: VoidFunction,
    setDialListTableState: (props: DialListTableStateProps) => void
}

const validateContactNme = (value: string) => value.length > 0;

export const DialListEntryForm = (props: DialListEntryFormProps) => {
  const {
    dialListTableState,
    profileId,
    refreshProfileData,
    setDialListTableState
  } = props;

  const state = useAdminState();
  const { nNumber } = state.userContext;

  const getInitialFormState = () => {
    const contact_nme = dialListTableState.dialListEntryFormInitialValues.contact_nme || "";
    const contact_num = dialListTableState.dialListEntryFormInitialValues.contact_num || "";
    const external_num = dialListTableState.dialListEntryFormInitialValues.external_num || "";
    return {
      contact_nme,
      contact_nme_updated: false,
      contact_nme_valid: validateContactNme(contact_nme),
      contact_num,
      contact_num_is_duplicate: false,
      contact_num_updated: false,
      contact_num_valid: isNumberValid(unMaskPhoneNumber(contact_num)), // unmasked phone number value ex: `8005554444`
      external_num,
      maskedPhoneNumber: contact_num // raw masked phone number value to properly update PhoneNumberInput with ex: `(800) 555-4444`,
    };
  };

  const [form, setForm] = useState(getInitialFormState());
  const [loading, setLoading] = useState({
    overlayMessage: "",
    saveStatus: null
  });

  const contactNmeError = form.contact_nme_updated && !form.contact_nme_valid;
  const formValid = form.contact_nme_valid && form.contact_num_valid && !form.contact_num_is_duplicate;

  const onClose = () => setDialListTableState({
    ...dialListTableState,
    isDialListEntryFormOpen: false
  });

  const waitAndHideOverlay = (closeDialListEntryForm?: boolean) => setTimeout(() => {
    if (closeDialListEntryForm) {
      onClose();
    } else {
      setLoading({
        overlayMessage: "",
        saveStatus: null
      });
    }
  }, timeouts.MODAL_OVERLAY);

  const insertDialListEntry = () => {
    const requestBody = {
      contact_nme: form.contact_nme,
      contact_num: form.contact_num,
      external_num: form.external_num,
      profile_id: profileId
    };
    setLoading({
      overlayMessage: "Adding dial list entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });
    myAxios.post(apiPaths.DIAL_LIST, requestBody)
      .then(res => {
        logger.info("Successfully added dial list entry", {
          responseData: res.data,
          requestBody,
          nNumber
        });
        refreshProfileData();
        setLoading({
          overlayMessage: "Successfully added dial list entry",
          saveStatus: ModalOverlayStatuses.SUCCESS
        });
        waitAndHideOverlay(true);
      })
      .catch(error => {
        logger.error("Failed to insert dial list entry", {
          error,
          requestBody,
          nNumber
        });
        setLoading({
          overlayMessage: "Failed to add dial list entry",
          saveStatus: ModalOverlayStatuses.FAIL
        });
        waitAndHideOverlay();
      });
  };

  const updateDialListEntry = () => {
    const requestBody = {
      contact_nme: form.contact_nme,
      contact_num: form.contact_num,
      external_num: form.external_num
    };
    setLoading({
      overlayMessage: "Updating dial list entry...",
      saveStatus: ModalOverlayStatuses.SAVING
    });
    myAxios.put(apiPaths.DIAL_LIST_ENTRY(dialListTableState.dialListId), requestBody)
      .then(res => {
        logger.info(`Successfully updated dial list entry with diallist_id ${dialListTableState.dialListId}`, {
          responseData: res.data,
          requestBody,
          nNumber
        });
        refreshProfileData();
        setLoading({
          overlayMessage: "Successfully updated dial list entry",
          saveStatus: ModalOverlayStatuses.SUCCESS
        });
        waitAndHideOverlay(true);
      })
      .catch(error => {
        logger.error(`Failed to update dial list entry with diallist_id ${dialListTableState.dialListId}`, {
          error,
          requestBody,
          nNumber
        });
        setLoading({
          overlayMessage: "Failed to update dial list entry",
          saveStatus: ModalOverlayStatuses.FAIL
        });
        waitAndHideOverlay();
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
        <Header>{dialListTableState.dialListEntryFormMode === formModes.INSERT ? "Add Dial List Entry" : "Edit Dial List Entry"}</Header>
        <PhoneNumberInput
          allowSevenDigitVdn={true}
          error={form.contact_num_is_duplicate}
          helperText={form.contact_num_is_duplicate ? "Number already exists in dial list" : null}
          id="transfer-number-input"
          label="Transfer Number"
          number={form.maskedPhoneNumber}
          onBlur={() => setForm({
            ...form,
            contact_num_updated: true
          })}
          showError={form.contact_num_updated}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setForm({
              ...form,
              contact_num: unmaskedValue,
              contact_num_is_duplicate: dialListTableState.otherContactNums.includes(unmaskedValue),
              contact_num_valid: isValid,
              maskedPhoneNumber: maskedValue
            });
          }}
        />
        <TextField
          error={contactNmeError}
          helperText={contactNmeError ? "Please enter a friendly name" : null}
          id="friendly-name-input"
          inputProps={{ maxLength: 80 }}
          label="Friendly Name"
          name="Friendly Name"
          onBlur={() => setForm({
            ...form,
            contact_nme_updated: true
          })}
          onChange={({
            target: { value }
          }) => setForm({
            ...form,
            contact_nme: value,
            contact_nme_valid: validateContactNme(value)
          })}
          margin="normal"
          variant="outlined"
          value={form.contact_nme}
        />
        <ExternalNumberContainer>
          <TextFieldContainer>
            <TextField
              fullWidth={true}
              id="external-number-input"
              inputProps={{ maxLength: 80 }}
              label="External Number"
              name="External Number"
              onChange={event => setForm({
                ...form,
                external_num: event.target.value
              })}
              margin="normal"
              variant="outlined"
              value={form.external_num}
            />
          </TextFieldContainer>
          <InfoIconContainer>
            <Tooltip title={"External number to share with customer"}>
              <InfoOutlinedStyled />
            </Tooltip>
          </InfoIconContainer>
        </ExternalNumberContainer>
        <ButtonWrapper>
          <StyledButton disabled={!formValid} onClick={dialListTableState.dialListEntryFormMode === formModes.INSERT ? insertDialListEntry : updateDialListEntry}>
            Save
          </StyledButton>
          <StyledButton onClick={onClose}>
            Close
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};