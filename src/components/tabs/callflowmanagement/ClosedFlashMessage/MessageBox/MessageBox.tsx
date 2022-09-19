import React from "react";
import {
  MessageBoxWrapper,
  TextField
} from "../ClosedFlashMessage.Styles";
import {
  ActionTypes,
  MessageBoxProps
} from "../ClosedFlashMessage.Interfaces";

export const MessageBox = (props: MessageBoxProps) => {
  const {
    text,
    setText,
    selected,
    action,
    checked,
    messageType
  } = props;

  const isSingleSelection = checked.length === 1;

  React.useEffect(() => {
    const variable = messageType.variable;
    if(action === ActionTypes.VIEW){
      setText(selected[variable]);
    }
  }, [selected]);

  return (
    <MessageBoxWrapper>
      <TextField
        readOnly={action !== ActionTypes.EDIT}
        onChange={(event: any) => setText(event.target.value)}
        value={text}
      />
    </MessageBoxWrapper>
  );
};

export default MessageBox;