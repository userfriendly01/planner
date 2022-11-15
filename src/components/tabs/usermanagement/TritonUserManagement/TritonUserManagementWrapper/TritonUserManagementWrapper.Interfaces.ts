import { Worker } from "globals";

import { WorkerOpts } from "../../OnboardNewUser/UserEntryFormWrapper.Interfaces";
export interface TritonUserManagementWrapperProps {
  workerOpts: WorkerOpts
  setWorkerOpts: (opts: WorkerOpts) => void
}
export interface ManagementWrapperState {
  deltaToggle: boolean,
  pageSelected: number,
  filterBy: string,
  searchBy: string
}

export interface UserModalState {
  open: boolean,
  worker: Worker | null
}