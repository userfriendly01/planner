import { UMUser } from "globals/interfaces";

export interface DefaultResetInformation {
  open: boolean,
  error: string | null,
  successfulResets: any[],
  unsuccessfulResets: any[]
}

export interface ResultsModalProps {
  error: string,
  handleClose: () => void,
  successfulWorkers: UMUser[],
  unsuccessfulWorkers: any[]
}

export interface ResetWorkerSkillsToDefaultResponse{
  reason?: string;
  updated: boolean;
  workerSid: string;
  worker?: UMUser;
}
export interface Worker{
  name: string,
  reason?: string
}