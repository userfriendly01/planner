import { apiPaths } from "globals";
import React, { useState } from "react";
import styled from "styled-components";
import { myAxios } from "utils";

const AddMessageInput = styled.input`
  height: 200px;
  margin: 30px;
  padding: 10px;
  width: 800px;
`;

const AddFlashMessage = () => {

  const [flashMessage, setFlashMessage] = useState("");

  const nNumber = "n0274027";

  const handleChange = event => {
    setFlashMessage(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log("flashMessage:", flashMessage);
    myAxios.put(apiPaths.UPDATE_FLASH_MESSAGE, flashMessage, nNumber)
      .then(res => console.log("response:", res));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <AddMessageInput type="text" placeholder="Enter flash message here..." value={flashMessage} onChange={handleChange} maxLength="1024"/>
        <input type="submit" value="Flash!" />
      </form>

    </div>
  );
};

export default AddFlashMessage;