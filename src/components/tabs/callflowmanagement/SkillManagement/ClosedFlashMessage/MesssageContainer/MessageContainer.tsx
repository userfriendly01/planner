import * as React from "react";
import { SaveButton } from "components";
import {
  MessageContainerProps,
  MessageContainerWrapper,
  MessageBoxWrapper,
  TextField
} from "../";
import { ActionTypes } from "../../";

const MessageContainer = (props: MessageContainerProps) => {
  const {
    action,
    confirmationModalOpts,
    messageType,
    tableState,
    setAction,
    setTableState,
    setConfirmationModalOpts,
    setSaveResult
  } = props;

  const [ text, setText ] = React.useState("");

  React.useEffect(() => {
    const variable = messageType.variable;

    if(tableState.selected.length > 1 || tableState.selected.length === 0){
      setText("");
    } else {
      const text = tableState.selected[0][variable] || "";
      setText(text);
    }
  }, [action, tableState.selected]);

  return (
    <MessageContainerWrapper>
      {action === ActionTypes.EDIT &&
        <MessageBoxWrapper>
          <TextField
            onChange={(event: any) => setText(event.target.value)}
            value={text}
          />
        </MessageBoxWrapper>
      }
      {action &&
        <SaveButton
          action={action}
          confirmationModalOpts= {confirmationModalOpts}
          setAction={setAction}
          setSaveResult={setSaveResult}
          setConfirmationModalOpts={setConfirmationModalOpts}
          tableState={tableState}
          setTableState={setTableState}
          messageType={messageType}
          text={text}
        />
      }

    </MessageContainerWrapper>
  );
};

export default MessageContainer;