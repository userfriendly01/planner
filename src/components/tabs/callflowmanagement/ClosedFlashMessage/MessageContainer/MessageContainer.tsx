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
    setSaveResult,
    confirmationModalOpts,
    setConfirmationModalOpts,
    checked,
    setChecked,
    messageType
  } = props;

  const [ text, setText ] = React.useState("");
  const [ action, setAction ] = React.useState(ActionTypes.VIEW);

  return (
    <FormControlsContainer>
      <h1>{messageType.name}</h1>
      <ActionBar
        action={action}
        setAction={setAction}
        setText={setText}
      />
      <MessageBox
        text={text}
        setText={setText}
        action={action}
        checked={checked}
        setAction={setAction}
        messageType={messageType}
      />
      <SaveButton
        action={action}
        confirmationModalOpts= {confirmationModalOpts}
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