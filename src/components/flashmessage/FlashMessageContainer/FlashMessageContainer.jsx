import {
  AddFlashMessage,
  ViewFlashMessage
} from "components";
import React, { useState } from "react";

const FlashMessageContainer = () => {

  const [readOnly, setReadOnly] = useState(false);

  const toggleReadOnly = () => setReadOnly(!readOnly);

  return (
    <div>
      {readOnly ?
        <ViewFlashMessage toggleReadOnly={toggleReadOnly} /> :
        <AddFlashMessage toggleReadOnly={toggleReadOnly} />}
    </div>
  );
};

export default FlashMessageContainer;