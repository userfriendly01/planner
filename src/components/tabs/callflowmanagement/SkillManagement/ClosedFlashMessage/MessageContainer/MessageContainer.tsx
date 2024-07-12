import * as React from "react";
import { SaveButton } from "callflowmanagement/SaveButton";
import { MessageContainerProps } from "../ClosedFlashMessage.Interfaces";
import {
  MessageContainerWrapper,
  MessageBoxWrapper,
  TextField
} from "../ClosedFlashMessage.Styles";
import {
  ActionTypes, Skill
} from "../../Skills.Interfaces";
import { useSkillState } from "context/appContext";

export const MessageContainer = (props: MessageContainerProps) => {
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
  const { skills } = useSkillState();

  React.useEffect(() => {
    const variable = messageType.variable;

    if(tableState.selected.length !== 1){
      setText("");
    } else {
      const skill: Partial<Skill> = skills.find((s: Skill) => s.name === tableState.selected[0]) || {};
      const text = skill[variable] || "";
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