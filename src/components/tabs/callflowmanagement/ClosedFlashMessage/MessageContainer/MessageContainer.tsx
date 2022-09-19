import * as React from "react";
import {
  ActionBar,
  MessageBox,
  SaveButton
} from "components";
import { FormControlsContainer } from "../ClosedFlashMessage.Styles";
import {
  ActionTypes,
  MessageContainerProps
} from "../ClosedFlashMessage.Interfaces";

const MessageContainer = (props: MessageContainerProps) => {
  const {
    checked,
    confirmationModalOpts,
    messageType,
    selected,
    setChecked,
    setConfirmationModalOpts,
    setSaveResult
  } = props;

  const [ text, setText ] = React.useState("");
  const [ action, setAction ] = React.useState(ActionTypes.VIEW);

  return (
    <FormControlsContainer>
      <h1>{messageType.name}</h1>
      <ActionBar
        action={action}
        setAction={setAction}
      />
      <MessageBox
        action={action}
        checked={checked}
        messageType={messageType}
        selected={selected}
        setText={setText}
        text={text}
      />
      <SaveButton
        action={action}
        confirmationModalOpts= {confirmationModalOpts}
        setAction={setAction}
        setSaveResult={setSaveResult}
        setConfirmationModalOpts={setConfirmationModalOpts}
        checked={checked}
        setChecked={setChecked}
        messageType={messageType}
        text={text}
      />
    </FormControlsContainer>
  );
};

export default MessageContainer;