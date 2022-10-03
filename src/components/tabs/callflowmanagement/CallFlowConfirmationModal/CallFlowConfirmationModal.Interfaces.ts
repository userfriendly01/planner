import { ModalOverlayStatuses } from "globals";

export interface ConfirmationModalOptsProps {
  open: boolean,
  confirmationText: any,
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