import { WorkerOpts } from "../UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";

export interface DeleteTritonUserProps {
  handleClose: () => void,
  loading: any,
  updateLoading: (payload: any) => void,
  workerOpts: WorkerOpts
}