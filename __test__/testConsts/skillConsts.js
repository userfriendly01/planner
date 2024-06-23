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