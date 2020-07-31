import {
  isNumberValid,
  unMaskPhoneNumber
} from "@lmig/phone-number-utils";
import {
  TextField,
  Tooltip
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import {
  PaperContainer,
  ModalPhoneNumber,
  ModalOverlay,
  StyledButton
} from "components";
import {
  apiPaths,
  formModes,
  modalOverlayStatuses,
  modalOverlayTimeout
} from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { myAxios } from "utils";

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
    font-size: 24px;
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

const TextFieldContainer = styled.div`
  width: 90%;
`;

const validateContactNme = value => value.length > 0;

const DialListEntryForm = props => {
  const {
    dialListTableState,
    profileId,
    refreshProfileData,
    setDialListTableState
  } = props;

  const getInitialFormState = () => {
    const contact_nme = dialListTableState.dialListEntryFormInitialValues.contact_nme || "";
    const contact_num = dialListTableState.dialListEntryFormInitialValues.contact_num || "";
    const external_num = dialListTableState.dialListEntryFormInitialValues.external_num || "";
    return {
      contact_nme,
      contact_nme_valid: validateContactNme(contact_nme),
      contact_num,
      contact_num_valid: isNumberValid(unMaskPhoneNumber(contact_num)), // unmasked phone number value ex: `8005554444`
      external_num,
      maskedPhoneNumber: contact_num, // raw masked phone number value to properly update ModalPhoneNumber with ex: `(800) 555-4444`,
      overlayMessage: "",
      saveStatus: null
    };
  };

  const [form, setForm] = useState(getInitialFormState());

  const formValid = form.contact_nme_valid && form.contact_num_valid;

  const onClose = () => setDialListTableState({
    ...dialListTableState,
    isDialListEntryFormOpen: false
  });

  const waitAndHideOverlay = closeDialListEntryForm => setTimeout(() => {
    if (closeDialListEntryForm) {
      onClose();
    } else {
      setForm({
        ...form,
        overlayMessage: "",
        saveStatus: null
      });
    }
  }, modalOverlayTimeout);

  const insertDialListEntry = () => {
    const requestBody = {
      contact_nme: form.contact_nme,
      contact_num: form.contact_num,
      external_num: form.external_num,
      profile_id: profileId
    };
    setForm({
      ...form,
      overlayMessage: "Adding dial list entry...",
      saveStatus: modalOverlayStatuses.SAVING
    });
    myAxios.post(apiPaths.DIAL_LIST, requestBody)
      .then(res => {
        console.log("Successfully inserted dial list entry", {
          responseData: res.data,
          requestBody
        });
        refreshProfileData();
        setForm({
          ...form,
          overlayMessage: "Successfully added dial list entry",
          saveStatus: modalOverlayStatuses.SUCCESS
        });
        waitAndHideOverlay(true);
      })
      .catch(err => {
        // TODO err.response.data.code = "ER_DUP_ENTRY" the record already exists
        // TODO or we could prevent entering a duplicate value in the first place???
        console.error("Failed to insert dial list entry", {
          err,
          requestBody
        });
        setForm({
          ...form,
          overlayMessage: "Failed to add dial list entry",
          saveStatus: modalOverlayStatuses.FAIL
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
    setForm({
      ...form,
      overlayMessage: "Updating dial list entry...",
      saveStatus: modalOverlayStatuses.SAVING
    });
    myAxios.put(apiPaths.DIAL_LIST_ENTRY(dialListTableState.dialListId), requestBody)
      .then(res => {
        console.log(`Successfully updated dial list entry with diallist_id ${dialListTableState.dialListId}`, {
          responseData: res.data,
          requestBody
        });
        refreshProfileData();
        setForm({
          ...form,
          overlayMessage: "Successfully updated dial list entry",
          saveStatus: modalOverlayStatuses.SUCCESS
        });
        waitAndHideOverlay(true);
      })
      .catch(err => {
        // TODO err.response.data.code = "ER_DUP_ENTRY" the record already exists
        // TODO or we could prevent entering a duplicate value in the first place???
        console.error(`Failed to update dial list entry with diallist_id ${dialListTableState.dialListId}`, {
          err,
          requestBody
        });
        setForm({
          ...form,
          overlayMessage: "Failed to update dial list entry",
          saveStatus: modalOverlayStatuses.FAIL
        });
        waitAndHideOverlay();
      });
  };

  return (
    <ModalContainer>
      <PaperContainer>
        {form.saveStatus ?
          <ModalOverlay
            message={form.overlayMessage}
            status={form.saveStatus}
          /> : null}
        <Header>{dialListTableState.dialListEntryFormMode === formModes.INSERT ? "Add Dial List Entry" : "Edit Dial List Entry"}</Header>
        <ModalPhoneNumber
          allowSevenDigitVdn={true}
          id="transfer-number-input"
          label="Transfer Number"
          number={form.maskedPhoneNumber}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setForm({
              ...form,
              contact_num: unmaskedValue,
              contact_num_valid: isValid,
              maskedPhoneNumber: maskedValue
            });
          }}
        />
        <TextField
          error={!form.contact_nme_valid}
          helperText={form.contact_nme_valid ? undefined : "Please enter a friendly name"}
          id="friendly-name-input"
          inputProps={{ maxLength: 80 }}
          label="Friendly Name"
          name="Friendly Name"
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
          <Tooltip title={"External number to share with customer"}>
            <InfoOutlinedStyled />
          </Tooltip>
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

DialListEntryForm.propTypes = {
  dialListTableState: PropTypes.shape({
    dialListId: PropTypes.number,
    dialListEntryFormInitialValues: PropTypes.shape({
      contact_nme: PropTypes.string,
      contact_num: PropTypes.string,
      external_num: PropTypes.string
    }).isRequired,
    dialListEntryFormMode: PropTypes.string
  }).isRequired,
  profileId: PropTypes.string.isRequired,
  refreshProfileData: PropTypes.func.isRequired,
  setDialListTableState: PropTypes.func.isRequired
};

export default DialListEntryForm;