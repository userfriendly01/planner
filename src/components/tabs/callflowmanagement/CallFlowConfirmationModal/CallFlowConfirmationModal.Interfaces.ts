import { ModalOverlayStatuses } from "globals/interfaces";
import { TableState } from "../CallFlowManagementWrapper/CallFlowManagement.Interfaces";

export interface ConfirmationModalOptsProps {
  open: boolean,
  confirmationText: any,
  exportButton: boolean,
  callbackMethods: {
    onConfirm: () => void,
    handleClose: () => void
  }
}
export interface SaveResultProps {
  status: ModalOverlayStatuses,
  message: string | null,
}

export interface CallFlowConfirmationModalProps {
  confirmationModalOpts: ConfirmationModalOptsProps,
  saveResult: SaveResultProps,
  tableState?: TableState
}