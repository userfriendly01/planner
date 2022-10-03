import * as React from "react";
import {
  MessageBox,
  SaveButton
} from "components";
import { FormControlsContainer } from "../../Skills.Styles";
import {
  ActionTypes,
  ActionContainerProps
} from "../../Skills.Interfaces";
import {
  MessageContainerWrapper,
  messageTypes
} from "../";

const MessageContainer = (props: ActionContainerProps) => {
  const {
    checked,
    confirmationModalOpts,
    tableState,
    setChecked,
    setConfirmationModalOpts,
    setSaveResult
  } = props;

  const propertyOptions = [
    {
      label: "Closed Message",
      value: messageTypes.CLOSED,
      actions: [
        ActionTypes[2],
        ActionTypes[3]
      ]
    },
    {
      label: "Flash Message",
      value: messageTypes.FLASH,
      actions: [
        ActionTypes[2],
        ActionTypes[3]
      ]
    }
  ];

  const [ text, setText ] = React.useState("");
  const [ propertySelection, setPropertySelection ] = React.useState(propertyOptions[0]);
  const [ action, setAction ] = React.useState(null);
  console.log("**Action", action);
  console.log("**ActionTypes", ActionTypes);

  return (
    <MessageContainerWrapper>
      <MessageBox
        action={action}
        checked={checked}
        messageType={propertySelection.value}
        tableState={tableState}
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
        propertyValue={propertySelection.value}
        text={text}
      />
    </MessageContainerWrapper>
  );
};

export default MessageContainer;