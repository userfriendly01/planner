import {
  Skill, SkillFormState, SkillGroup
} from "callflowmanagement/Skills.Interfaces";
import { formModes } from "globals/index";
// import { mockOperatingUnits } from "testUtils"; // This imports as undefined... wth?

export const mockSkillOperatingUnits = [
  {
    ou_name: "Claims",
    ou_sid: "OUe98d4f81e49ccf1ae16b29f8611d1b6c"
  },
  {
    ou_name: "Service",
    ou_sid: "OU94b0ff770f6278386fec5ef0b51fd021"
  },
  {
    ou_name: "Direct Distribution",
    ou_sid: "OU7e7b999348156438ba9cc09731276775"
  }
];

export const mockTimeOfDays = [
  {
    "timeOfDayId": 1,
    "dayOfWeekId": 0,
    "vhTimeOfDayId": 0,
    "openTime": "08:00:00",
    "closeTime": "17:00:00"
  },
  {
    "timeOfDayId": 2,
    "dayOfWeekId": 0,
    "vhTimeOfDayId": 0,
    "openTime": "00:00:00",
    "closeTime": "00:00:00"
  },
  {
    "timeOfDayId": 3,
    "dayOfWeekId": 0,
    "vhTimeOfDayId": 0,
    "openTime": "08:00:00",
    "closeTime": "19:15:00"
  }
];

export const mockApplications = [
  {
    "applicationId": 0,
    "applicationName": "default-callflow"
  },
  {
    "applicationId": 1,
    "applicationName": "cicct-callflow-aisg"
  },
  {
    "applicationId": 2,
    "applicationName": "cicct-callflow-pal"
  }
];

export const mockTaskQueues = [
  {
    "target_workers": "routing.skills HAS \"466\"",
    "sid": "WQda5066ddff9e0eebf2f168e40d98cc19",
    "friendly_name": "NI Billing & Collections",
    "url": "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/TaskQueues/WQda5066ddff9e0eebf2f168e40d98cc19",
    "operating_unit_sid": "OU64bd089e13818331f359af3ba668ac3c"
  },
  {
    "target_workers": "routing.skills HAS \"psu-l1\"",
    "sid": "WQ9e7f40c067bb9006022f43266122a257",
    "friendly_name": "PSU Claims - Level 1",
    "url": "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/TaskQueues/WQ9e7f40c067bb9006022f43266122a257",
    "operating_unit_sid": "OU30903fb05b21aeee60df5891c77aa74f"
  },
  {
    "target_workers": "routing.skills HAS \"psu-l2\"",
    "sid": "WQc05a238f8c3a603b04ace6c2b1b2299f",
    "friendly_name": "PSU Claims - Level 2",
    "url": "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/TaskQueues/WQc05a238f8c3a603b04ace6c2b1b2299f",
    "operating_unit_sid": "OU30903fb05b21aeee60df5891c77aa74f"
  },
  {
    "target_workers": "routing.skills HAS \"bscCbsL2\"",
    "sid": "WQ6a319ba98220d95cae470f878bc0f4fe",
    "friendly_name": "BSC - CBS L2",
    "reservation_activity_sid": "WA4843f5096a845cdf818aec4e2676c832",
    "url": "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/TaskQueues/WQ6a319ba98220d95cae470f878bc0f4fe",
    "operating_unit_sid": "OU64bd089e13818331f359af3ba668ac3c"
  }
];

export const mockSkillFormState = {
  formMode: formModes.INSERT,
  name: "testskill",
  applicationId: 1,
  taskQueue: {
    sid: "",
    isNew: true,
    friendly_name: "test",
    target_workers: "",
    operating_unit_sid: "ou123"
  },
  profileIds: [0],
  levels: {
    min: {
      value: 1
    },
    max: {
      value: 3
    }
  },
  timeOfDays: [
    {
      dayOfWeekId: 1,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 2,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 3,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 4,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 5,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 6,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 7,
      timeOfDayId: 1
    }
  ],
  vhThreshold: "",
  vhCallTarget: ""
};

export const initialSkillFormState: SkillFormState = {
  formMode: "insert",
  name: "",
  levels: {
    min: null,
    max: null
  },
  applicationId: null,
  taskQueue: {
    isNew: false,
    target_workers: null,
    sid: "",
    friendly_name: null,
    operating_unit_sid: null
  },
  profileIds: [],
  vhCallTarget: "",
  vhThreshold: "",
  timeOfDays: []
};

export const mockSkills: Partial<Skill>[] = [
  {
    name: "lscOBDialer1",
    discrepancies: [],
    applicationId: 0,
    skillGroupIds: ["1","2"],
    profileIds: [32],
    flashMessage: "",
    closedMessage: "",
    levels: [1, 2, 3],
    taskQueueSid: "",
    taskQueueName: "",
    timeOfDays: [],
    vhCallTarget: null,
    vhThreshold: null
  },
  {
    name: "aisgL1",
    applicationId: 2,
    discrepancies: ["I dont match!"],
    taskQueueSid: "",
    taskQueueName: "aisg L1",
    skillGroupIds: ["1"],
    profileIds: [4],
    flashMessage: "",
    closedMessage: "Sorry, we're closed.",
    levels: [],
    timeOfDays: [],
    vhCallTarget: null,
    vhThreshold: null
  },
  {
    name: "bscCommisssions",
    applicationId: 1,
    discrepancies: [],
    taskQueueSid: "",
    taskQueueName: "bsc Commisssions",
    skillGroupIds: [],
    profileIds: [10],
    flashMessage: "OH NO WE'RE EXPLODING!! ",
    closedMessage: "Sorry, we're closed.",
    levels: [1, 2, 3, 4, 5, 6, 7],
    timeOfDays: [],
    vhCallTarget: null,
    vhThreshold: null
  },
  {
    name: "bscCbsL2",
    applicationId: 4,
    discrepancies: [],
    taskQueueSid: "",
    taskQueueName: "bsc Cbs L2",
    skillGroupIds: [],
    profileIds: [10,12],
    flashMessage: "",
    closedMessage: "",
    levels: [],
    timeOfDays: [],
    vhCallTarget: null,
    vhThreshold: null
  },
  {
    name: "lscUSAA",
    discrepancies: [],
    applicationId: 1,
    taskQueueSid: "1",
    taskQueueName: "lsc USAA",
    skillGroupIds: [],
    profileIds: [],
    flashMessage: "",
    closedMessage: "",
    levels: [],
    timeOfDays: [],
    vhCallTarget: null,
    vhThreshold: null
  }
];

export const mockSkillGroups: Partial<SkillGroup>[] = [
  {
    id: "1",
    skill_group_name: "skillgroup1"
  },
  {
    id: "2",
    skill_group_name: "skillgroup2",
    skills: [{
      name: "aisgL1",
      applicationId: 2,
      discrepancies: ["I dont match!"],
      taskQueueSid: "",
      taskQueueName: "aisg L1",
      skillGroupIds: ["1"],
      profileIds: [4],
      flashMessage: "",
      closedMessage: "Sorry, we're closed.",
      levels: [],
      timeOfDays: [],
      vhCallTarget: null,
      vhThreshold: null
    },
    {
      name: "bscCommisssions",
      applicationId: 1,
      discrepancies: [],
      taskQueueSid: "",
      taskQueueName: "bsc Commisssions",
      skillGroupIds: [],
      profileIds: [10],
      flashMessage: "OH NO WE'RE EXPLODING!! ",
      closedMessage: "Sorry, we're closed.",
      levels: [1, 2, 3, 4, 5, 6, 7],
      timeOfDays: [],
      vhCallTarget: null,
      vhThreshold: null
    }]
  }
];

export const initialSkillState = {
  skills: mockSkills,
  skillGroups: mockSkillGroups,
  taskQueues: mockTaskQueues,
  timeOfDays: mockTimeOfDays,
  applications: mockApplications,
  operatingUnits: mockSkillOperatingUnits,
  skillForm: initialSkillFormState,
  daysOfWeek: {
    sunday: {
      label: "Sunday",
      id: 1
    },
    monday: {
      label: "Monday",
      id: 2
    },
    tuesday: {
      label: "Tuesday",
      id: 3
    },
    wednesday: {
      label: "Wednesday",
      id: 4
    },
    thursday: {
      label: "Thursday",
      id: 5
    },
    friday: {
      label: "Friday",
      id: 6
    },
    saturday: {
      label: "Saturday",
      id: 7
    }
  }
};