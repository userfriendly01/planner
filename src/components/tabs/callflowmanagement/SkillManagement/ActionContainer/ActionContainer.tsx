import * as React from "react";
import {
  Dropdown,
  MessageContainer
} from "components";
import { FormControlsContainer } from "../Skills.Styles";
import {
  ActionTypes,
  ActionContainerProps
} from "../Skills.Interfaces";
import { messageTypes } from "../ClosedFlashMessage/ClosedFlashMessage.Interfaces";

const ActionContainer = (props: ActionContainerProps) => {
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
    <FormControlsContainer>
      <h1>{propertySelection.label}</h1>
      <Dropdown
        label="What are you changing?"
        value={propertySelection}
        options={propertyOptions}
        updateValue={(event: any, property: any) => setPropertySelection(property)}
        styles={{
          margin: "10 0",
          width: "400px"
        }}
      />
      <Dropdown
        label="Action"
        value={action}
        options={propertySelection.actions}
        updateValue={(event: any, action: any) => setAction(action)}
        styles={{
          margin: "10 0",
          width: "400px"
        }}
      />
      {action === ActionTypes[2] &&
      <MessageContainer
        checked={checked}
        confirmationModalOpts={confirmationModalOpts}
        tableState={tableState}
        setChecked={setChecked}
        setConfirmationModalOpts={setConfirmationModalOpts}
        setSaveResult={setSaveResult}
      />
      }
    </FormControlsContainer>
  );
};

export default ActionContainer;