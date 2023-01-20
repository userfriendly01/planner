import { Worker } from "globals";

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