import { WorkerOpts } from "../../OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import { TableStateProps } from "globals";

export interface TritonUserTableProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
  workerOpts: WorkerOpts,
  setWorkerOpts: (opts: WorkerOpts) => void,
}