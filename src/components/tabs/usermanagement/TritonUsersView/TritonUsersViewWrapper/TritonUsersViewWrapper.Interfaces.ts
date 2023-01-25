import { Worker } from "globals";

import { WorkerOpts } from "../../OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
export interface TritonUserManagementWrapperProps {
  workerOpts: WorkerOpts
  setWorkerOpts: (opts: WorkerOpts) => void
}

export interface UserModalState {
  open: boolean,
  worker: Worker | null
}