import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";

export interface TfnActivationProps {
  confirmationModalOpts: ConfirmationModalOptsProps,
  setSaveResult: (props: SaveResultProps) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void
}