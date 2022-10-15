import { formModes } from "globals";
import { authenticationProfiles } from "../src/authentication/authenticationProfiles";
import { initialState } from "context";
import {
  ExtensionSearchStatuses
} from "components/tabs/usermanagement/UserEntryForm/UserEntryForm.Interfaces";

export const fetchedUser = {
  email: "test@abc.com",
  firstName: "Frank",
  lastName: "Rizzo",
  officeName: "Springfield 012B",
  officeNumber: "ABC123",
  departmentName: "Computers",
  departmentNumber: "4848",
  manager: "Test Manager"
};

export const initialFormState = {
  alternateDid: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  defaultSkills: {},
  defaultSkillsUpdated: false,
  didUser: false,
  directDialNum: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  discrepancies: [],
  editDisabled: false,
  extension: {
    value: "",
    blurred: false,
    updated: false,
    valid: false
  },
  extensionStatus: {
    searchStatus: ExtensionSearchStatuses.Idle,
    retriesRemaining: 5,
    message: "",
    isError: false,
    originalExtension: ""
  },
  formMode: formModes.INSERT,
  inactiveForwardTo: {
    value: null,
    updated: false
  },
  manager: {
    value: "",
    blurred: false,
    updated: false
  },
  nNumber: {
    value: "n",
    blurred: false,
    updated: false
  },
  nNumberFetchedUser: null,
  outgoing: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  profileId: {
    value: "",
    blurred: false,
    updated: false
  },
  calabrioUser: {
    updated: false,
    team: null,
    timezone: {
      label: "EST",
      value: 173
    },
    roles: [],
    scope: {
      groups: [{
        name: "group1",
        groupId: 1,
        checked: true,
        partial: false
      }],
      teams: [{
        name: "team1",
        groupId: 2,
        checked: true
      }]
    }
  },
  userPreviouslyAdded: false,
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false
};

export const managerList = [
  {
    manager_first_name: "John",
    manager_last_name: "Wick",
    manager_n_number: "n1234567",
    manager_id: "01",
    profile_id: 11
  },
  {
    manager_first_name: "Test",
    manager_last_name: "Manager",
    manager_n_number: "n7454853",
    manager_id: "02"
  }
];

export const mockSkills = [
  {
    skill: "aisgl1"
  }
];

export const officeMap = new Map([
  [
    "ABC123",
    {

      office_nme: "Office 1",
      office_num: "ABC123"
    }
  ],
  [
    "0002",
    {

      office_nme: "Office 2",
      office_num: "0002"
    }
  ]
]);

export const profileList = [
  {
    profile_nme: "test1",
    profile_id: 1,
    overflow_skill: null
  },
  {
    profile_nme: "test2",
    profile_id: 2,
    overflow_skill: "whateverOverflowSkill"
  },
  {
    profile_nme: "test3",
    profile_id: 3,
    overflow_skill: "anotherOverflowSkill"
  }
];

export const validFormOptions = {
  alternateDid: {
    e164: "+18001234567",
    masked: "(800)123-4567",
    tenDig: "8001234567"
  },
  defaultSkills: {
    levels: {
      "a": 1,
      "b": 3
    },
    skills: ["a", "b", "c"]
  },
  did: "6034567890",
  didE164: "+16034567890",
  directDialNum: {
    e164: "+18002345678",
    masked: "(800)234-5678",
    tenDig: "8002345678"
  },
  discrepancies: [],
  extension: "1234",
  manager: managerList[0],
  nNumber: "n1234567",
  nNumberFetchedUser: fetchedUser,
  profileId: profileList[0].profile_id,
  calabrioUser: {
    team: null,
    timezone: {
      label: "EST",
      value: 173
    },
    roles: [],
    scope: {
      groups: [{
        name: "group1",
        groupId: 1,
        checked: true,
        partial: false
      }],
      teams: [{
        name: "team1",
        groupId: 2,
        checked: true
      }]
    }
  }
};

export const validFormState = {
  formMode: formModes.INSERT,
  defaultSkills: {
    "levels": {
      "a": 1,
      "b": 3
    },
    "skills": [
      "a",
      "b",
      "c"
    ]
  },
  defaultSkillsUpdated: true,
  didUser: false,
  discrepancies: [],
  extension: {
    value: validFormOptions.extension,
    blurred: false,
    updated: true,
    valid: true
  },
  inactiveForwardTo: {
    value: null,
    updated: false
  },
  manager: {
    value: managerList[0],
    blurred: false,
    updated: true
  },
  nNumber: {
    value: validFormOptions.nNumber,
    blurred: false,
    updated: true
  },
  nNumberFetchedUser: fetchedUser,
  outgoing: {
    value: "6038518200",
    blurred: false,
    e164: validFormOptions.didE164,
    updated: true,
    valid: true
  },
  profileId: {
    value: validFormOptions.profileId,
    blurred: false,
    updated: true
  },
  alternateDid: {
    value: "6032453160",
    blurred: false,
    e164: "+16032453160",
    updated: true,
    valid: true
  },
  directDialNum: {
    value: "6032453160",
    blurred: false,
    e164: "+16032453160",
    updated: true,
    valid: true
  },
  calabrioUser: {
    update: false,
    team: 225,
    timezone: {
      label: "EST",
      value: 173
    },
    roles: [],
    scope: {
      groups: [{
        name: "group1",
        groupId: 1,
        checked: true,
        partial: false
      }],
      teams: [{
        name: "team1",
        groupId: 2,
        checked: true
      }]
    }
  },
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
};

export const worker = {
  attributes: {
    full_name: "Faith Cuneo",
    office_location_name: "Uranus",
    profile_id: 15
  },
  sid: "WK1",
  skillsDifferent: false
};

export const calabrioContext = {
  groups: [
    {
      groupId: 100,
      name: "Hawaii 50 Group"
    },
    {
      groupId: 200,
      name: "FNOL Group"
    },
    {
      groupId: 300,
      name: "No Teams Group"
    }
  ],
  teams: [
    {
      groupId: 101,
      parentGroupId: 100,
      name: "Hawaii Team 50"
    },
    {
      groupId: 102,
      parentGroupId: 100,
      name: "Hawaii Specialty Team"
    },
    {
      groupId: 201,
      parentGroupId: 200,
      name: "FNOL Team"
    }
  ],
  roles: [
    {
      id: 1,
      name: "Administrator"
    },
    {
      id: 2,
      name: "Agent"
    },
    {
      id: 3,
      name: "QM Only"
    }
  ],
  users: [
    {
      id: 200,
      acdId: "WK1234",
      firstName: "Brittany",
      lastName: "Magee",
      groupId: 102,
      adLogin: "LM\\n0222444",
      email: "Brittany.Magee@libertymutual.com"
    },
    {
      id: 220,
      acdId: "WK5678",
      firstName: "Faith",
      lastName: "Cuneo",
      groupId: 201,
      email: "Faith.Cuneo@libertymutual.com"
    }
  ]
};

export const skillsList = [
  {
    name: "lscOBDialer1",
    profiles: [{
      profileName: "Licensed Sales Center",
      profileId: 32
    }],
    flashMessage: "",
    closedMessage: "",
    levels: [ 1, 2, 3],
    timeOfDays: [],
    vhCallTarget: null,
    vhCallerId: null,
    vhThreshold: null
  },
  {
    name: "aisgL1",
    profiles: [{
      profileName: "AISG",
      profileId: 4
    }],
    flashMessage: "",
    closedMessage: "Sorry, we're closed.",
    levels: [],
    timeOfDays: [],
    vhCallTarget: null,
    vhCallerId: null,
    vhThreshold: null
  },
  {
    name: "bscCommisssions",
    profiles: [{
      profileName: "BSC",
      profileId: 10
    }],
    flashMessage: "OH NO WE'RE EXPLODING!! ",
    closedMessage: "Sorry, we're closed.",
    levels: [1, 2, 3, 4, 5, 6, 7],
    timeOfDays: [],
    vhCallTarget: null,
    vhCallerId: null,
    vhThreshold: null
  },
  {
    name: "bscCbsL2",
    profiles: [
      {
        profileName: "BSC",
        profileId: 10
      },
      {
        profileName: "BLST Billing",
        profileId: 12
      }
    ],
    flashMessage: "",
    closedMessage: "",
    levels: [],
    timeOfDays: [],
    vhCallTarget: null,
    vhCallerId: null,
    vhThreshold: null
  },
  {
    name: "lscUSAA",
    profiles: [],
    flashMessage: "",
    closedMessage: "",
    levels: [],
    timeOfDays: [],
    vhCallTarget: null,
    vhCallerId: null,
    vhThreshold: null
  }
];

export const initialTestState = {
  ...initialState,
  officeContext: {
    offices: officeMap
  },
  profileContext: {
    profiles: profileList
  },
  managerContext: {
    managers: managerList
  },
  skillContext: {
    skills: skillsList
  },
  userContext: {
    pingIdentity: {
      sub: "n0263786"
    },
    authenticationProfiles: [
      {
        ...authenticationProfiles.TRITON,
        profileId: 10
      }
    ]
  },
  workerContext: {
    workers: [
      {
        attributes: {
          n_number: "N0263786",
          profile_id: 12
        }
      },
      {
        attributes: {
          n_number: "n0000000",
          profile_id: "12"
        }
      },
      {
        attributes: {
          n_number: "n1111111"
        }
      }
    ]
  },
  calabrioContext
};

export const mockWorkers = [
  {
    attributes: {
      default_skills: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      },
      full_name: "Test 1",
      office_location_name: "Neptune",
      routing: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      },
      profile_id: 15
    },
    sid: "WK0",
    skillsDifferent: false
  },
  {
    attributes: {
      full_name: "Test 2",
      office_location_name: "Uranus",
      profile_id: 15
    },
    sid: "WK1",
    skillsDifferent: false
  },
  {
    // DID worker with overflow skill
    sid: "WK2",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      did: validFormOptions.didE164,
      extension: validFormOptions.extension,
      full_name: "Test 3",
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Jupiter",
      profile_id: profileList[1].profile_id,
      routing: {
        skills: [
          profileList[1].overflow_skill,
          "whatever"
        ],
        levels: {
          "whatever": 1
        }
      }
    }
  },
  {
    // DID worker without overflow skill
    sid: "WK3",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      did: validFormOptions.didE164,
      extension: validFormOptions.extension,
      full_name: "Test 4",
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Pluto",
      profile_id: profileList[1].profile_id,
      routing: {
        skills: [
          "payinBills"
        ],
        levels: {
          "payinBills": 1
        }
      }
    }
  },
  {
    sid: "WK4",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      did: validFormOptions.didE164,
      extension: validFormOptions.extension,
      full_name: "Test 4",
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Pluto",
      profile_id: profileList[1].profile_id,
      routing: {
        skills: [
          "payinBills"
        ],
        levels: {
          "payinBills": 1
        }
      }
    }
  }
];
