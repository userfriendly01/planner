import {
  AddFlashMessage,
  FlashMessageSidebar,
  ViewFlashMessage
} from "components";
import React, { useState } from "react";
import styled from "styled-components";

const FlashMessageContainerWrapper = styled.div`
  background-color: ${props => props.theme.tableRow.borderColor};
  display: flex;
  height: calc(100vh - 96px);
`;

const FlashMessageContainer = () => {
  const [readOnly, setReadOnly] = useState(false);
  const toggleReadOnly = () => setReadOnly(!readOnly);
  return (
    <FlashMessageContainerWrapper>
      <FlashMessageSidebar />
      {readOnly ?
        <ViewFlashMessage toggleReadOnly={toggleReadOnly} /> :
        <AddFlashMessage toggleReadOnly={toggleReadOnly} />}
    </FlashMessageContainerWrapper>
  );
};

export default FlashMessageContainer;