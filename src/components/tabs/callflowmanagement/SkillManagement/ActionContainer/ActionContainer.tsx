import { Dropdown } from "components/Dropdown";
import { MessageContainer } from "callflowmanagement/MessageContainer";
import { SkillFormModal } from "callflowmanagement/SkillFormModal";
import { SkillGroupInputContainer } from "callflowmanagement/SkillGroupInputContainer";
import React from "react";
import {
  propertyOptions,
  ActionContainerProps,
  ActionTypes
} from "../Skills.Interfaces";
import { FormControlsContainer } from "../Skills.Styles";
import { useAdminState } from "context/appContext";
import { checkIfPO } from "authentication/authUtils";

export const ActionContainer = (props: ActionContainerProps) => {
  const {
    confirmationModalOpts,
    tableState,
    setConfirmationModalOpts,
    setSaveResult,
    setTableState
  } = props;

  const { nNumber } = useAdminState().userContext;
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
      case propertyOptions.SKILLS.label:
        if (action && action.value) {
          return <SkillFormModal
            action={action}
            setTableState={setTableState}
            confirmationModalOpts={confirmationModalOpts}
            setAction={setAction}
            tableState={tableState}
            setConfirmationModalOpts={setConfirmationModalOpts}
            setSaveResult={setSaveResult}
          />;
        }
        return null;
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
        options={checkIfPO(nNumber) ? Object.values(propertyOptions) : Object.values(propertyOptions).filter((op: any) => op.value.variable !== "skills")}
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