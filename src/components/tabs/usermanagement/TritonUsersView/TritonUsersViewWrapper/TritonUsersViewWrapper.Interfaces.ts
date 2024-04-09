import { UMUser } from "globals";

export interface UserModalState {
  open: boolean,
  worker: UMUser | null
}