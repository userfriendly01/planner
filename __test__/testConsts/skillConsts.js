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

export const operatingUnits = [
  {
    "ou_name": "Claims",
    "ou_sid": "OUe98d4f81e49ccf1ae16b29f8611d1b6c"
  },
  {
    "ou_name": "Service",
    "ou_sid": "OU94b0ff770f6278386fec5ef0b51fd021"
  },
  {
    "ou_name": "Direct Distribution",
    "ou_sid": "OU7e7b999348156438ba9cc09731276775"
  }
];

export const mockSkillFormState = {
  name: "testskill",
  applicationId: 1,
  taskQueue: {
    sid: "",
    isNew: true,
    friendly_name: "test",
    target_workers: "",
    operating_unit_sid: "ou123"
  },
  profileIds: 0,
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
  vhThreshold: "123",
  vhCallTarget: "hi"
};

export const skillsList = [
  {
    name: "lscOBDialer1",
    discrepancies: [],
    applicationId: 0,
    ctmSkillId: 1,
    skillGroups: [{
      skillGroupId: 1,
      skillGroupNme: "skillgroup1",
      skills: [{
        name: "lscOBDialer1",
        ctmSkillId: 1
      }, {
        name: "aisgL1",
        ctmSkillId: 2
      }]
    },
    {
      skillGroupId: 2,
      skillGroupNme: "skillgroup2"
    }],
    profiles: [32],
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
    discrepancies: ["I dont match!"],
    ctmSkillId: 2,
    ctmSkillDisplayName: "aisg L1",
    skillGroups: [{
      skillGroupId: 1,
      skillGroupNme: "skillgroup1",
      skills: [{
        name: "lscOBDialer1",
        ctmSkillId: 1
      }, {
        name: "aisgL1",
        ctmSkillId: 2
      }]
    }],
    profiles: [4],
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
    ctmSkillId: 3,
    taskQueueSid: "",
    taskQueueName: "bsc Commisssions",
    skillGroups: [],
    profiles: [10],
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
    ctmSkillId: 4,
    taskQueueSid: "",
    taskQueueName: "bsc Cbs L2",
    skillGroups: [],
    profiles: [10,12],
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
    ctmSkillId: 5,
    taskQueueSid: 1,
    taskQueueName: "lsc USAA",
    skillGroups: [],
    profiles: [],
    flashMessage: "",
    closedMessage: "",
    levels: [],
    timeOfDays: [],
    vhCallTarget: null,
    vhThreshold: null
  }
];

export const skillGroups = [
  {
    skillGroupId: 1,
    skillGroupNme: "skillgroup1",
    skills: [{
      name: "lscOBDialer1",
      ctmSkillId: 1,
      ctmSkillDisplayName: "lsc OB Dialer 1",
      profiles: [32],
      flashMessage: "",
      closedMessage: "",
      levels: [1, 2, 3],
      timeOfDays: [],
      vhCallTarget: null,
      vhThreshold: null
    }]
  },
  {
    skillGroupId: 2,
    skillGroupNme: "skillgroup2",
    skills: [{
      name: "aisgL1",
      ctmSkillId: 2,
      ctmSkillDisplayName: "aisg L1",
      profiles: [4],
      flashMessage: "",
      closedMessage: "Sorry, we're closed.",
      levels: [],
      timeOfDays: [],
      vhCallTarget: null,
      vhThreshold: null
    },
    {
      name: "bscCommisssions",
      ctmSkillId: 3,
      ctmSkillDisplayName: "bsc Commisssions",
      profiles: [10],
      flashMessage: "OH NO WE'RE EXPLODING!! ",
      closedMessage: "Sorry, we're closed.",
      levels: [1, 2, 3, 4, 5, 6, 7],
      timeOfDays: [],
      vhCallTarget: null,
      vhThreshold: null
    }]
  }
];