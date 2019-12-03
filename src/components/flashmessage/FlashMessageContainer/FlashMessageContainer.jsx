import {
  AddFlashMessage,
  ViewFlashMessage
} from "components";
import React, { useState } from "react";
import styled from "styled-components";

const FlashMessageContainerWrapper = styled.div`
  background-color: ${props => props.theme.tableRow.borderColor};
  height: 100vh;
`;

const FlashMessageContainer = () => {
  const [readOnly, setReadOnly] = useState(false);
  const toggleReadOnly = () => setReadOnly(!readOnly);
  return (
    <FlashMessageContainerWrapper>
      {readOnly ?
        <ViewFlashMessage toggleReadOnly={toggleReadOnly} /> :
        <AddFlashMessage toggleReadOnly={toggleReadOnly} />}
    </FlashMessageContainerWrapper>
  );
};

export default FlashMessageContainer;