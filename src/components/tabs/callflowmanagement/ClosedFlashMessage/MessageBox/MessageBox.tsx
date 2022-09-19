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
    selected,
    messageType
  } = props;

  const isSingleSelection = selected.length === 1;

  React.useEffect(() => {
    if(isSingleSelection) {
      setText(selected[0][messageType.variable]);
    } else {
      setAction(ActionTypes.VIEW);
      setText("");
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