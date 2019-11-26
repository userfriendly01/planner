import {
  AddFlashMessage,
  EditFlashMessage
} from "components";
import React, { useState } from "react";

const FlashMessageContainer = () => {

  const [displayEdit, setDisplayEdit] = useState(false);

  const toggleEdit = () => setDisplayEdit(!displayEdit);

  return (
    <div>
      {displayEdit ? <EditFlashMessage /> : <AddFlashMessage toggleEdit={toggleEdit}/>}
    </div>
  );
};

export default FlashMessageContainer;