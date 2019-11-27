import {
  useAdminDispatch,
  useAdminState
} from "context";
// import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
// import { myAxios } from "utils";

const AddMessageInput = styled.input`
  height: 200px;
  margin: 30px;
  padding: 10px;
  width: 800px;
`;

const AddFlashMessage = props => {

  const { toggleReadOnly } = props;

  const dispatch = useAdminDispatch();
  const state = useAdminState();
  const flashMessage = state.flashMessage;
  const [charCount, setCharCount] = useState(0);

  // const nNumber = "n0274027";

  const handleChange = event => {
    dispatch({
      type: "updateFlashMessage",
      payload: event.target.value
    });
    setCharCount(event.target.value.length);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const popUp = confirm("Are you sure you want to create this flash message?");
    if (popUp === true) {
      // myAxios.put(apiPaths.UPDATE_FLASH_MESSAGE, flashMessage, nNumber)
      //   .then(res => console.log("response:", res));
      toggleReadOnly(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <AddMessageInput type="text" placeholder="Enter flash message here..." value={flashMessage} onChange={handleChange} maxLength="1024"/>
        <input type="submit" value="Flash!" />
      </form>
      <div>
        Characters: {charCount} / 1024
      </div>
    </div>
  );
};

AddFlashMessage.propTypes = {
  toggleReadOnly: PropTypes.func.isRequire
};

export default AddFlashMessage;