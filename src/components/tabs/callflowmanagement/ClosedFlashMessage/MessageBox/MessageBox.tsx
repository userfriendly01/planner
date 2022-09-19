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

  const isMultiChecked = checked.length > 1;

  React.useEffect(() => {
    console.log("Selected", selected);
    const variable = messageType.variable;
    if(selected) {
      const text = selected[variable] || "";
      setText(text);
    }else {
      setText("");
    }
    if(action !== ActionTypes.VIEW && isMultiChecked){
      setText("");
    }
  }, [action, selected]);

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