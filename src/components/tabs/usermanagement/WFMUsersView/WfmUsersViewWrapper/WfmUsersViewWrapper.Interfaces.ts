import { Worker } from "globals";

export interface UserModalState {
  open: boolean,
  worker: Worker | null
}