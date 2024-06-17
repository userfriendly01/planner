import { TableState } from "callflowmanagement/CallFlowManagement.Interfaces";
import { messageTypes } from "callflowmanagement/ClosedFlashMessage.Interfaces";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "callflowmanagement/CallFlowConfirmationModal.Interfaces";

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
      ActionTypes.ADD,
      ActionTypes.DELETE,
      ActionTypes.EDIT
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
  applications: any[],
  taskQueues: any[],
  timeOfDays: any[]
}

export interface SkillEntryFormModalProps {
  closeModal: () => void,
  setSaveResult: (saveResult: SaveResultProps) => void,
  saveResult: SaveResultProps,
  isAdmin: boolean
}

export interface SkillsTableProps {
  tableState: TableState,
  setTableState: (tableState: TableState) => void
}

export interface AddEditSkillGroupBody {
  skill_group_nme: string,
  skillIds?: number[]
}

export interface AddEditSkill {
  skillFriendlyName: string,
  skillNum: string,
  applicationId: number,
  taskQueueSid: string,
  profileIds: number[],
  vhCallTarget: string | null,
  vhThreshold: number | null,
  updatedBy: string,
  timeOfDayIds: TimeOfDayRequestObject[]
}

export interface Application {
  applicationId: number,
  applicationName: string
}

export enum DayOfWeek {
  sunday = 1,
  monday = 2,
  tuesday = 3,
  wednesday = 4,
  thursday = 5,
  friday = 6,
  saturday = 7
}
export interface SkillState {
  discrepancies: string[],
  skills: Skill[],
  skillGroups: SkillGroup[],
  applications: Application[],
  daysOfWeek: typeof DayOfWeek,
  timeOfDays: TimeOfDay[],
  taskQueues: TwilioQueue[],
  skillForm: SkillFormState
}

export interface SkillFormState {
  formMode: string,
  skillFriendlyName: string,
  skillNum: string,
  applicationId: number | null, // FAITH does this need to be | null?
  taskQueueSid: string,
  profileIds: number[],
  enableVirtualHold: boolean,
  vhCallTarget: {
    value: string,
    valid: boolean,
    e164: string,
    blurred: boolean
  },
  vhThreshold?: string,
  timeOfDays: TimeOfDayRequestObject[]
}

export interface TwilioQueue {
  account_sid?: string,
  taskQueueSid?: string,
  url?: string,
  friendlyName: string,
  maxReservedWorkers: number,
  targetWorkers: string, //ie '(skills HAS "support") AND (languages HAS "english")'
  operatingUnitSid: null //this is missing from the Twilio docs
}

export interface TwilioSkill {
  name: string,
  multivalue: boolean,
  minimum: number,
  maximum: number
}

export interface TimeOfDay {
  timeOfDayId: number,
  openTime: string,
  closeTime: string,
}

export interface TimeOfDayRequestObject {
  dayOfWeekId: number,
  timeOfDayId: number,
  vhTimeOfDayId?: number
}

export interface CallflowSkill {
  skillId: string,
  applicationId: number,
  vhThreshold: string,
  vhCallTarget: string,
  timeOfDayIds: number[],
  updatedBy: string
}

export interface CallFlowTimeOfDay {
  timeOfDayId: number,
  dayId: number,
  vhTimeOfDayId?: number
}

export interface UMSkill {
  timeOfDayId: number,
  dayId: number,
  vhTimeOfDayId?: number
}

export interface Skill {
  [key: string]: any
  ctmSkillId: number,
  ctmSkillDisplayName: string,
  ctmSkillGroups: SkillGroup[],
  name: string,
  profiles: any[],
  closedMessage: string,
  flashMessage: string,
  levels: any[],
  timeOfDays: any[],
  vhCallTarget: string,
  vhCallerId: string,
  vhThreshold: number
}

export interface SkillGroup {
  skillGroupId: number,
  skillGroupNme: string,
  skills: Skill[],
}