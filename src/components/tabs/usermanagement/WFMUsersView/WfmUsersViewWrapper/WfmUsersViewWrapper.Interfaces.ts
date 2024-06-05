import { UMUser } from "globals/interfaces";

export interface UserModalState {
  open: boolean,
  worker: UMUser | null
}