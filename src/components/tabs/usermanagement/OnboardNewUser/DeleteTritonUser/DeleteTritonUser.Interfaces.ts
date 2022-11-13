import { WorkerOpts } from "../UserEntryFormWrapper.Interfaces";

export interface DeleteTritonUserProps {
  workerOpts: WorkerOpts,
  setWorkerOpts: (opts: WorkerOpts) => void
}