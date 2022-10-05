import * as React from "react";
import {
  Dropdown,
  MessageContainer
} from "components";
import { FormControlsContainer } from "../Skills.Styles";
import {
  propertyOptions,
  ActionContainerProps
} from "../Skills.Interfaces";

const ActionContainer = (props: ActionContainerProps) => {
  const {
    confirmationModalOpts,
    tableState,
    setConfirmationModalOpts,
    setSaveResult,
    setTableState
  } = props;

  const [ propertySelection, setPropertySelection ] = React.useState(propertyOptions.CLOSED_MESSAGE);
  const [ action, setAction ] = React.useState(null);

  const getPropertySelectionView = () => {
    switch(propertySelection.label){
      case propertyOptions.CLOSED_MESSAGE.label:
        return <MessageContainer
          action={action}
          confirmationModalOpts={confirmationModalOpts}
          tableState={tableState}
          messageType={propertySelection.value}
          setAction={setAction}
          setTableState={setTableState}
          setConfirmationModalOpts={setConfirmationModalOpts}
          setSaveResult={setSaveResult}
        />;
      case propertyOptions.FLASH_MESSAGE.label:
        return <MessageContainer
          action={action}
          confirmationModalOpts={confirmationModalOpts}
          tableState={tableState}
          messageType={propertySelection.value}
          setAction={setAction}
          setTableState={setTableState}
          setConfirmationModalOpts={setConfirmationModalOpts}
          setSaveResult={setSaveResult}
        />;
      default:
        return null;
    }
  };
  return (
    <FormControlsContainer>
      <h1>{propertySelection.label}</h1>
      <Dropdown
        label="What are you changing?"
        value={propertySelection}
        options={Object.values(propertyOptions)}
        updateValue={(event: any, property: any) => {
          setPropertySelection(property);
          console.warn("Action?", action);
          if(action) { setAction(null); }
        }}
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
      {getPropertySelectionView()}
    </FormControlsContainer>
  );
};

export default ActionContainer;