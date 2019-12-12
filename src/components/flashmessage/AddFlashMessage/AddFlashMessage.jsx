import { StyledButton } from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { myAxios } from "utils";

const AddMessageButton = styled(StyledButton)`
  align-self: center;
  width: min-content;
`;

const AddMessageInput = styled.textarea`
  border: 2px solid ${props => props.validMessage ? props.theme.libertyDarkTeal : props.theme.errorColor};
  border-radius: 10px;
  min-height: 10vh;
  margin-bottom: 10px;
  outline: none;
  padding: 10px;
  resize: none;
  width: -webkit-fill-available;
`;

const AddMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: -webkit-fill-available;
`;

const CharCount = styled.div`
  font-size: .875rem;
  font-weight: 800;
  letter-spacing: 0.007142857143rem;
  padding-right: 10px;
`;

const Helpers = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SpecialCharacterWarning = styled.div`
  color: ${props => props.theme.errorColor};
  font-size: .875rem;
  font-weight: 800;
  letter-spacing: 0.007142857143rem;
  padding-left: 10px;
`;

const StyledForm = styled.form`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  margin: 2vw;
`;

const AddFlashMessage = props => {

  const {
    flashMessageState,
    setFlashMessageState
  } = props;

  const [charCount, setCharCount] = useState(flashMessageState.flashMessage.length);
  const [validMessage, setValidMessage] = useState(true);
  const adminState = useAdminState();
  const nNumber = adminState.userContext.pingIdentity.sub;

  const handleChange = event => {
    const flashMessage = event.target.value;
    setFlashMessageState({
      ...flashMessageState,
      flashMessage
    });
    setCharCount(flashMessage.length);
    isMessageValid(flashMessage) ? setValidMessage(true) : setValidMessage(false);
  };

  const isMessageValid = message => {
    // XML "special characters" - https://docs.oracle.com/cd/A97335_02/apps.102/bc4j/developing_bc_projects/obcCustomXml.htm
    const specialCharacters = RegExp(/<|>|&|"|'/);
    if (specialCharacters.test(message) === true) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    const popUp = confirm("Are you sure you want to create this flash message?");
    if (popUp === true) {
      setFlashMessageState({
        ...flashMessageState,
        fetching: true
      });
      const req = {
        callflowId: 5,
        flashMessage: flashMessageState.flashMessage,
        updatedBy: nNumber
      };
      myAxios.post(apiPaths.UPDATE_FLASH_MESSAGE, req)
        .then(() => {
          setFlashMessageState({
            ...flashMessageState,
            fetching: false,
            readOnly: true
          });
        })
        .catch(err => {
          const uploadError = "Failed to upload flash message. Please try again or submit a request via";
          setFlashMessageState({
            ...flashMessageState,
            fetching: false,
            serviceCallError: uploadError
          });
          console.error(uploadError, err);
        });
    }
  };

  return (
    <AddMessageWrapper>
      <StyledForm onSubmit={handleSubmit}>
        <AddMessageInput
          data-testid="add-message-input"
          maxLength="1024"
          onChange={handleChange}
          placeholder="Enter flash message here..."
          type="text"
          value={flashMessageState.flashMessage}
          validMessage={validMessage} />
        <Helpers>
          {!validMessage ? <SpecialCharacterWarning>Special characters are not allowed</SpecialCharacterWarning> : <div></div>}
          <CharCount>Characters: {charCount} / 1024</CharCount>
        </Helpers>
        <AddMessageButton disabled={flashMessageState.flashMessage.length === 0 || !validMessage} onClick={handleSubmit}>Add Message</AddMessageButton>
      </StyledForm>
    </AddMessageWrapper>
  );
};

AddFlashMessage.propTypes = {
  flashMessageState: PropTypes.object.isRequired,
  setFlashMessageState: PropTypes.func.isRequired
};

export default AddFlashMessage;