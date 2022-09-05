import {
  ModalOverlayStatuses,
  Skill
} from "globals";

export interface ConfirmationModalOptsProps {
  open: boolean,
  confirmationText: string,
  callbackMethods: {
    onConfirm: () => void,
    handleClose: () => void
  }
}

export interface SaveResultProps {
  status: ModalOverlayStatuses,
  message: string | null,
}

export interface CallFlowConfirmationModalProps {
  confirmationModalOpts: ConfirmationModalOptsProps,
  saveResult: SaveResultProps
}

export interface FilteredStateProps {
  searchBy: string,
  profiles: any[],
  closedFilter: boolean,
  flashFilter: boolean,
  filteredList: any[]
}

export interface MessageBoxProps {
  confirmationModalOpts: ConfirmationModalOptsProps,
  setSaveResult: (props: SaveResultProps) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  selected: any[],
  setSelected: (props: Skill[]) => void
  messageType: string
}

export interface SkillsTableProps {
  filteredState: any,
  selected: any[],
  setSelected: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
}