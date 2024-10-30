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

export const propertyOptions: any = {
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
  },
  SKILLS: {
    label: "Skills",
    value: {
      name: "Skills",
      filter: "skills",
      variable: "skills"
    },
    actions: [
      ActionTypes.ADD,
      ActionTypes.EDIT,
      ActionTypes.DELETE
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
  setTableState: (tableState: TableState) => void
}

export interface SkillsTableProps {
  tableState: TableState,
  setTableState: (tableState: TableState) => void
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
  levels: {
    min: any,
    max: any
  },
  timeOfDays: TimeOfDayRequestObject[],
  vhThreshold?: number | string,
  vhCallTarget: string,
}

export interface TwilioQueue {
  sid: string,
  url?: string,
  isNew: boolean,
  friendly_name: string,
  target_workers: string, //ie '(skills HAS "support") AND (languages HAS "english")'
  operating_unit_sid: null //this can only be accesses using axios, the twilioClient does not have access to OUs
}

export interface TimeOfDay {
  dayOfWeekId?: number,
  timeOfDayId: number,
  openTime: string,
  closeTime: string
}

export interface TimeOfDayRequestObject {
  dayOfWeekId: number,
  timeOfDayId: number,
  vhTimeOfDayId?: number
}

export interface ConsolidatedSkill {
  discrepancies: string[];
  name: string;
  levels: number[];
  profileIds: number[];
  taskQueueSid?: string;
  taskQueueName?: string;
  skillGroupIds: string[];
  applicationId: number;
  closedMessage: string;
  flashMessage: string;
  timeOfDays: TimeOfDay[];
  vhCallTarget: string | null;
  vhThreshold?: number | string | null;
}

export interface Skill {
  [key: string]: any,
  discrepancies: string[],
  name: string,
  levels: number[],
  profileIds: number[],
  taskQueueSid: string,
  taskQueueName: string,
  skillGroupIds: string[]
  applicationId: number,
  closedMessage: string,
  flashMessage: string,
  timeOfDays: any[],
  vhCallTarget: string,
  vhThreshold?: number | string
}

export interface SkillGroup {
  pk: string,
  sk: string,
  id: string,
  skill_group_name: string,
  skills?: Skill[],
}