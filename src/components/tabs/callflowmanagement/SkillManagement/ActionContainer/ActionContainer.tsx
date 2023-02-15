import {
  Dropdown,
  MessageContainer,
  SkillGroupInputContainer
} from "components";
import React from "react";
import {
  propertyOptions,
  ActionContainerProps
} from "../Skills.Interfaces";
import { FormControlsContainer } from "../Skills.Styles";

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
      case propertyOptions.SKILL_GROUP.label:
        if (action && action.value) {
          return <SkillGroupInputContainer
            action={action}
            setTableState={setTableState}
            confirmationModalOpts={confirmationModalOpts}
            setAction={setAction}
            tableState={tableState}
            setConfirmationModalOpts={setConfirmationModalOpts}
            setSaveResult={setSaveResult}
          />;
        }
        return <div></div>;
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