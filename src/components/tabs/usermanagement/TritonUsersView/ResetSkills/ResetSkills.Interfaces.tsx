import { Worker } from "globals";

export interface DefaultResetInformation {
  open: boolean,
  error: string | null,
  successfulResets: any[],
  unsuccessfulResets: any[]
}

export interface ResultsModalProps {
  error: string,
  handleClose: () => void,
  successfulWorkers: Worker[],
  unsuccessfulWorkers: any[]
}