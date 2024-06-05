import { CallflowWrapper } from "./CallFlowManagement.Styles";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import { CallFlowConfirmationModal } from "callflowmanagement/CallFlowConfirmationModal/CallFlowConfirmationModal";
import { TfnActivation } from "callflowmanagement/TfnActivation/TfnActivation";
import React from "react";
import { Modal } from "@mui/material";

export const CallFlowManagementTfn = () => {

  const defaultConfirmationModalOpts: ConfirmationModalOptsProps = {
    open: false,
    exportButton: false,
    confirmationText: "",
    callbackMethods: {
      onConfirm: null,
      handleClose: null
    }
  };

  const defaultSaveResult: SaveResultProps = {
    status: null,
    message: null
  };

  const [ confirmationModalOpts, setConfirmationModalOpts ] = React.useState(defaultConfirmationModalOpts);
  const [ saveResult, setSaveResult ] = React.useState(defaultSaveResult);

  return (
    <CallflowWrapper>
      <TfnActivation
        confirmationModalOpts={confirmationModalOpts}
        setSaveResult={setSaveResult}
        setConfirmationModalOpts={setConfirmationModalOpts}
      />
      <Modal open={confirmationModalOpts.open}>
        <>
          <CallFlowConfirmationModal
            confirmationModalOpts={confirmationModalOpts}
            saveResult={saveResult}
          />
        </>
      </Modal>
    </CallflowWrapper>
  );
};