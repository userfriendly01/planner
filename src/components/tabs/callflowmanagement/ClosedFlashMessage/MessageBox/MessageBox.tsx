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
    action,
    setAction,
    checked,
    messageType
  } = props;

  const isSingleSelection = checked.length === 1;

  React.useEffect(() => {
    if(isSingleSelection) {
      setText(checked[0][messageType.variable]);
    } else {
      setAction(ActionTypes.VIEW);
      setText("");
    }
  }, [checked]);

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