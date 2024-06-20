import { TableState } from "callflowmanagement/CallFlowManagement.Interfaces";
import { messageTypes } from "callflowmanagement/ClosedFlashMessage.Interfaces";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "callflowmanagement/CallFlowConfirmationModal.Interfaces";
import { OperatingUnit } from "globals/interfaces";

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
  name: string,
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

export interface Day {
  id: number,
  label: string
}

export interface DayOfWeek {
  [day: string]: Day
}

export interface SkillState {
  skills: Skill[],
  skillGroups: SkillGroup[],
  applications: Application[],
  daysOfWeek: DayOfWeek,
  timeOfDays: TimeOfDay[],
  taskQueues: TwilioQueue[],
  operatingUnits: OperatingUnit[],
  skillForm: SkillFormState
}

export interface SkillFormState {
  [key: string]: any,
  formMode: string,
  name: string,
  applicationId: number,
  taskQueue: TwilioQueue,
  profileIds: number[],
  timeOfDays: TimeOfDayRequestObject[],
  vhThreshold?: string,
  vhCallTarget: string,
  vhCallerId: {
    value: string,
    valid: boolean,
    e164: string,
    blurred: boolean
  }
}

export interface TwilioQueue {
  sid: string,
  url?: string,
  isNew: boolean,
  friendly_name: string,
  target_workers: string, //ie '(skills HAS "support") AND (languages HAS "english")'
  operating_unit_sid: null //this can only be accesses using axios, the twilioClient does not have access to OUs
}

export interface TwilioQueueRequest {
  taskQueueSid?: string,
  url?: string,
  friendlyName: string,
  targetWorkers: string, //ie '(skills HAS "support") AND (languages HAS "english")'
  operatingUnitSid: null //this can only be accesses using axios, the twilioClient does not have access to OUs
}
/*
  These attributes are on the payload from the callflow api but after inspection of the DB, there are no "vh" versions of these fields.
  the vhTimeOfDayId on the TimeOfDayRequestObject represents a general timeOfDayId 
      * vhTimeOfDayId: number,
      * vhOpenTime: string,
      * vhCloseTime: string,
*/

export interface TimeOfDay {
  timeOfDayId: number,
  openTime: string,
  closeTime: string
}

export interface TimeOfDayRequestObject {
  dayOfWeekId: number,
  timeOfDayId: number,
  vhTimeOfDayId?: number
}

export interface TwilioSkill {
  name: string,
  multivalue: boolean,
  minimum: number,
  maximum: number
}

export interface CallflowSkill {
  skillName: string,
  closedMessage: string,
  flashMessage: string,
  applicationId: number,
  vhThreshold: number,
  vhCallTarget: string,
  vhCallerId: string,
  timeOfDays: TimeOfDay[],
  updatedBy?: string
}

export interface CtmSkill {
  skill_num: string,
  skill_id: number,
  profile_id: number,
  skill_group_id: number,
  skill_group_nme: string,
}

export interface CallFlowTimeOfDay {
  timeOfDayId: number,
  dayId: number,
  vhTimeOfDayId?: number
}

export interface UMSkill {
  skillId: number,
  taskQueueSid: string,
  taskQueueName: string,
  levels: any[]
}

export interface Skill {
  [key: string]: any,
  discrepancies: string[],
  name: string,
  levels: number[],
  profiles: number[],
  taskQueueSid: string,
  taskQueueName: string,
  skillGroups: SkillGroup[],
  ctmSkillId: number,
  applicationId: number,
  closedMessage: string,
  flashMessage: string,
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