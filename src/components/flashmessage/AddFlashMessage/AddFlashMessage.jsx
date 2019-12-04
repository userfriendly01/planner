import { StyledButton } from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
// import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
// import { myAxios } from "utils";

const AddMessageButton = styled(StyledButton)`
  align-self: center;
  width: min-content;
`;

const AddMessageInput = styled.textarea`
  border: 2px solid ${props => props.validMessage ? props.theme.libertyDarkTeal : "red"};
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
  color: red;
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

  const { toggleReadOnly } = props;

  const dispatch = useAdminDispatch();
  const state = useAdminState();
  const flashMessage = state.flashMessage;
  const [charCount, setCharCount] = useState(0);
  const [validMessage, setValidMessage] = useState(true);

  // const nNumber = "n0274027";

  // console.log("validMessage = ", validMessage);

  const handleChange = event => {
    const message = event.target.value;
    // console.log("message:", message);
    dispatch({
      type: "updateFlashMessage",
      payload: message
    });
    setCharCount(message.length);
    isMessageValid(message) ? setValidMessage(true) : setValidMessage(false);
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

  const handleSubmit = event => {
    event.preventDefault();
    const popUp = confirm("Are you sure you want to create this flash message?");
    if (popUp === true) {
      // const req = {
      //   callflowId: "whatever",
      //   flashMessage: "flash!",
      //   updatedBy: "n0132412"
      // };
      // myAxios.put(apiPaths.UPDATE_FLASH_MESSAGE, flashMessage, nNumber) // this might have to change
      //   .then(res => console.log("response:", res));
      toggleReadOnly(true);
    }
  };

  return (
    <AddMessageWrapper>
      <StyledForm onSubmit={handleSubmit}>
        <AddMessageInput type="text" placeholder="Enter flash message here..." value={flashMessage} onChange={handleChange} maxLength="1024" validMessage={validMessage}/>
        <Helpers>
          {!validMessage ? <SpecialCharacterWarning>Special characters are not allowed</SpecialCharacterWarning> : <div></div>}
          <CharCount>Characters: {charCount} / 1024</CharCount>
        </Helpers>
        <AddMessageButton disabled={flashMessage.length === 0 || !validMessage} onClick={handleSubmit}>Submit</AddMessageButton>
      </StyledForm>
    </AddMessageWrapper>
  );
};

AddFlashMessage.propTypes = {
  toggleReadOnly: PropTypes.func.isRequired
};

export default AddFlashMessage;