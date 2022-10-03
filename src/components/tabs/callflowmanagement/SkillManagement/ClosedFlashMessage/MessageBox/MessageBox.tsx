import React from "react";
import {
  MessageBoxWrapper,
  TextField
} from "../ClosedFlashMessage.Styles";
import { MessageBoxProps } from "../ClosedFlashMessage.Interfaces";
import { ActionTypes } from "../../Skills.Interfaces";

export const MessageBox = (props: MessageBoxProps) => {
  const {
    text,
    setText,
    tableState,
    action,
    checked,
    messageType
  } = props;

  const isMultiChecked = checked.length > 1;

  React.useEffect(() => {
    const variable = messageType.variable;

    if(action !== ActionTypes[0] && isMultiChecked){
      setText("");
    } else if (tableState.selected){
      const text = tableState.selected[variable] || "";
      setText(text);
    } else {
      setText("");
    }
  }, [action, tableState.selected]);


  return (
    <MessageBoxWrapper>
      <TextField
        readOnly={action !== ActionTypes[2]}
        onChange={(event: any) => setText(event.target.value)}
        value={text}
      />
    </MessageBoxWrapper>
  );
};

export default MessageBox;