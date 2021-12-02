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
  margin-bottom: 10px;
  min-height: 10vh;
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

const AddClosedMessage = props => {

  const {
    closedMessageState,
    setClosedMessageState
  } = props;

  const isMessageValid = message => {
    // XML "special characters" - https://docs.oracle.com/cd/A97335_02/apps.102/bc4j/developing_bc_projects/obcCustomXml.htm
    const specialCharacters = RegExp(/<|>|&|"|'/);
    if (specialCharacters.test(message) === true) {
      return false;
    } else {
      return true;
    }
  };

  const adminState = useAdminState();
  const nNumber = adminState.userContext.pingIdentity.sub;

  const [tempClosedMessage, setTempClosedMessage] = useState(closedMessageState.closedMessage);

  const charCount = tempClosedMessage.length;
  const validMessage = isMessageValid(tempClosedMessage);

  const handleChange = event => setTempClosedMessage(event.target.value);

  const handleSubmit = () => {
    const popUp = confirm("Are you sure you want to create this closed message?");
    if (popUp === true) {
      setClosedMessageState({
        ...closedMessageState,
        fetching: true
      });
      const req = {
        skill: closedMessageState.skill,
        closedMessage: tempClosedMessage,
        updatedBy: nNumber
      };
      myAxios.post(apiPaths.CLOSED_MESSAGE, req)
        .then(res => {
          setClosedMessageState({
            ...closedMessageState,
            fetching: false,
            closedMessage: JSON.parse(res.config.data).closedMessage,
            readOnly: true
          });
        })
        .catch(err => {
          const uploadError = "Failed to upload closed message. Please try again or submit a request via";
          setClosedMessageState({
            ...closedMessageState,
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
          placeholder="Enter closed message here..."
          type="text"
          validMessage={validMessage}
          value={tempClosedMessage} />
        <Helpers>
          {!validMessage ? <SpecialCharacterWarning>Special characters are not allowed</SpecialCharacterWarning> : <div></div>}
          <CharCount>Characters: {charCount} / 1024</CharCount>
        </Helpers>
        <AddMessageButton disabled={tempClosedMessage.length === 0 || !validMessage} onClick={handleSubmit}>Add Message</AddMessageButton>
      </StyledForm>
    </AddMessageWrapper>
  );
};

AddClosedMessage.propTypes = {
  closedMessageState: PropTypes.object.isRequired,
  setClosedMessageState: PropTypes.func.isRequired
};

export default AddClosedMessage;