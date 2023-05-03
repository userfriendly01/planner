import { Skill } from "globals";
import { TableState } from "../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
import { messageTypes } from "../SkillManagement/ClosedFlashMessage/ClosedFlashMessage.Interfaces";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";

export interface ActionType {
  value: string,
  label: string
}

export const ActionTypes = {
  VIEW: {
    label: "View",
    value: "view"
  },
  ADD: {
    label: "Add",
    value: "add"
  },
  EDIT: {
    label: "Edit",
    value: "edit"
  },
  DELETE: {
    label: "Delete",
    value: "delete"
  }
};

export interface PropertyOption {
  value: any,
  label: string,
  actions: ActionType[]
}

export const propertyOptions = {
  CLOSED_MESSAGE: {
    label: "Closed Message",
    value: messageTypes.CLOSED,
    actions: [
      ActionTypes.EDIT,
      ActionTypes.DELETE
    ]
  },
  FLASH_MESSAGE: {
    label: "Flash Message",
    value: messageTypes.FLASH,
    actions: [
      ActionTypes.EDIT,
      ActionTypes.DELETE
    ]
  },
  SKILL_GROUP: {
    label: "Default Skill Group",
    value: {
      name: "Default Skill Group",
      filter: "skillGroup",
      variable: "skillGroup"
    },
    actions: [
      ActionTypes.ADD
    ]
  }
};
export interface ActionContainerProps {
  confirmationModalOpts: ConfirmationModalOptsProps,
  tableState: TableState,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setSaveResult: (props: SaveResultProps) => void,
  setTableState: (state: TableState) => void
}

export interface SkillsContainerProps {
  tableState: TableState,
  setTableState: (tableState: TableState) => void
}

export interface SkillsExportButtonProps {
  selected: Skill[],
  label?: string
  styles?: any
}
export interface SkillsHeaderProps {
  tableState: TableState,
  setTableState: (tableState: TableState) => void,
  applications: any[],  // todo: make these better
  taskQueues: any[],
  timeOfDays: any[]
}

export interface SkillsTableProps {
  tableState: TableState,
  setTableState: (tableState: TableState) => void
}

export interface SkillFormState {
  formMode: string,
  skillFriendlyName: string,
  skillNum: string,
  applicationId: number | null,
  taskQueueSid: string,
  profileIds: any[],
  enableVirtualHold: boolean,
  vhCallTarget: {
    value: string,
    valid: boolean,
    e164: string,
    blurred: boolean
  },
  vhThreshold: string | null,
  timeOfDay: {
    sunday: number | null,
    monday: number | null,
    tuesday: number | null,
    wednesday: number | null,
    thursday: number | null,
    friday: number | null,
    saturday: number | null
  }
}

interface TimeOfDay {
  dayId: number,
  timeOfDayId: number
}

export interface AddEditSkill {
  skillFriendlyName: string,
  skillNum: string,
  applicationId: number,
  taskQueueSid: string,
  profileIds: number[],
  vhCallTarget: string | null,
  vhThreshold: number | null,
  timeOfDayIds: TimeOfDay[]
}