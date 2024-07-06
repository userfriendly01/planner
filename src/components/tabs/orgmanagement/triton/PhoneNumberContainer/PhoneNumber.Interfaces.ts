
import { ModalOverlayStatuses } from "globals/interfaces";

export interface PhoneNumberTableProps {
  type: "Directory" | "DialList",
  filteredList: any[],
  editFunction: (entry: any) => void,
  deleteFunction: (entry: any) => void,
  selectedProfile: (profile_id: number) => void,
  saveState: {
    status?: ModalOverlayStatuses,
    overlayMessage?: string
  }
}

export interface PhoneNumberStateProps {
  type: "Directory" | "DialList",
  entry?: any,
  formMode?: "Create" | "Edit" | "Delete",
  isModalOpen?: boolean,
  overlayMessage?: string,
  saveState?: { status: ModalOverlayStatuses, overlayMessage?: string }
}

export interface PhoneNumberFormProps {
  filteredList: any[],
  phoneNumberState: PhoneNumberStateProps,
  closeModal: VoidFunction,
  selectedProfile: number
}

export interface DirectoryFormEntryProps {
  id: string,
  directory_num: {
    maskedValue: string,
    unmaskedValue: string,
    valid: boolean
  },
  first_name: string,
  last_name: string
}

export interface DialListFormEntryProps {
  id: string,
  contact_num: {
    maskedValue: string,
    unmaskedValue: string,
    valid: boolean
  },
  external_num: string,
  contact_name: string
}

