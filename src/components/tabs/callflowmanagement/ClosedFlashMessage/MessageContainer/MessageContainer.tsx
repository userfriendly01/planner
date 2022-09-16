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
    selected,
    setSelected,
    messageType
  } = props;

  const [ text, setText ] = React.useState("");
  const [ action, setAction ] = React.useState(ActionTypes.VIEW);

  return (
    <FormControlsContainer>
      <ActionBar
        action={action}
        setAction={setAction}
        setText={setText}
      />
      <MessageBox
        text={text}
        setText={setText}
        action={action}
        selected={selected}
        setAction={setAction}
        messageType={messageType}
      />
      <SaveButton
        action={action}
        confirmationModalOpts= {confirmationModalOpts}
        setSaveResult={setSaveResult}
        setConfirmationModalOpts={setConfirmationModalOpts}
        selected={selected}
        setSelected={setSelected}
        messageType={messageType}
        text={text}
      />
    </FormControlsContainer>
  );
};

export default MessageContainer;