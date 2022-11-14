import { WorkerOpts } from "../UserEntryFormWrapper.Interfaces";

export interface DeleteTritonUserProps {
  handleClose: () => void,
  loading: any,
  updateLoading: (payload: any) => void,
  workerOpts: WorkerOpts,
  setWorkerOpts: (opts: WorkerOpts) => void
}