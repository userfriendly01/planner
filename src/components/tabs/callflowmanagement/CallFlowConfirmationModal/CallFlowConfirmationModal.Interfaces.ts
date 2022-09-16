import { ModalOverlayStatuses } from "globals";

export interface ConfirmationModalOptsProps {
  open: boolean,
  confirmationText: string,
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
  saveResult: SaveResultProps
}