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

const AddMessage = props => {

  const {
    messageState,
    setMessageState
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

  const [tempMessage, setTempMessage] = useState(messageState.message);

  const charCount = tempMessage.length;
  const validMessage = isMessageValid(tempMessage);

  const handleChange = event => setTempMessage(event.target.value);

  const handleSubmit = () => {
    const popUp = confirm("Are you sure you want to create this message?");
    if (popUp === true) {
      setMessageState({
        ...messageState,
        fetching: true
      });
      let apiPath;
      let dataField;
      if(messageState.messageType === "closed"){
        apiPath = apiPaths.CLOSED_MESSAGE;
        dataField = "closedMessage";
      } else {
        apiPath = apiPaths.FLASH_MESSAGE;
        dataField = "flashMessage";
      }
      const req = {
        skill: messageState.skill,
        [dataField]: tempMessage,
        updatedBy: nNumber
      };

      myAxios.post(apiPath, req)
        .then(res => {
          console.log("data: " + res.config.data);
          setMessageState({
            ...messageState,
            fetching: false,
            message: JSON.parse(res.config.data)[dataField],
            readOnly: true,
            skillData: {
              ...messageState.skillData,
              allSkills: null
            }
          });
        })
        .catch(err => {
          console.log("err: " +err);
          const uploadError = "Failed to upload message. Please try again or submit a request via";
          setMessageState({
            ...messageState,
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
          value={tempMessage} />
        <Helpers>
          {!validMessage ? <SpecialCharacterWarning>Special characters are not allowed</SpecialCharacterWarning> : <div></div>}
          <CharCount>Characters: {charCount} / 1024</CharCount>
        </Helpers>
        <AddMessageButton disabled={tempMessage.length === 0 || !validMessage} onClick={handleSubmit}>Add Message</AddMessageButton>
      </StyledForm>
    </AddMessageWrapper>
  );
};

AddMessage.propTypes = {
  messageState: PropTypes.object.isRequired,
  setMessageState: PropTypes.func.isRequired
};

export default AddMessage;