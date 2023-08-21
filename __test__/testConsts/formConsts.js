import { ExtensionSearchStatuses } from "components/tabs/usermanagement/OnboardNewUser/Extension/ExtensionInput/ExtensionInput.Interfaces";
import { formModes } from "globals";
import {
  managerList,
  profileList
} from "./testConsts";

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
  formMode: formModes.INSERT,
  discrepancies: [],
  nNumber: {
    value: "n",
    blurred: false,
    updated: false,
    nNumberFetchedUser: null,
  },
  triton: {
    userFound: true,
    alternateDid: {
      value: "",
      blurred: false,
      e164: undefined,
      updated: false,
      valid: false
    },
    routing:{
      team: "",
      skills: [],
      levels: {}
    },
    callerStateAttr:{
      callerStates: [],
      skills: [],
      levels: {}
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
    extension: {
      value: "",
      blurred: false,
      updated: false,
      valid: false,
      status: {
        searchStatus: ExtensionSearchStatuses.Idle,
        retriesRemaining: 5,
        message: "",
        isError: false,
        originalExtension: ""
      }
    },
    inactiveForwardTo: {
      value: null,
      updated: false
    },
    manager: {
      value: "",
      blurred: false,
      updated: false
    },
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
    userPreviouslyAdded: false,
    zeroOutEnabled: {
      value: false,
      updated: false
    },
    selfServiceInd: {
      value: false,
      updated: false
    }
  },
  calabrio_qm: {
    userFound: false,
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
  calabrio_wfm: {
    userFound: false,
    OptionalColumns: [],
    Id: null,
    Identity: null,
    FirstName: null,
    LastName: null,
    EmploymentNumber: null,
    Email: null,
    DisplayName: null,
    TerminationDate: null,
    EmploymentStartDate: null,
    TimeZoneId: null,
    BusinessUnitId: null,
    TeamId: null,
    PersonSkills: [],
    WorkflowControlSetId: null,
    ContractId: null,
    ContractScheduleId: null,
    BudgetGroupId: null,
    PartTimePercentageId: null,
    ShiftBagId: null,
    Note: null,
    Roles: [],
    AvailabilityId: null,
    AbsenceId: null,
    RotationId: null,
    FirstDayOfWeek: null,
    ParentTeam: null
  }
};

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
  routing:{
    team:"Sample1",
    skills: [],
    levels: {}
  },
  callerStateAttr:{
    callerState: ["Test1", "Test2"],
    skills: [],
    levels: {}
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
  discrepancies: [],
  nNumber: {
    value: validFormOptions.nNumber,
    blurred: false,
    updated: true,
    nNumberFetchedUser: fetchedUser
  },
  triton: {
    userFound: true,
    defaultSkills: {
      updated: true,
      levels: {
        "a": 1,
        "b": 3
      },
      skills: [
        "a",
        "b",
        "c"
      ]
    },
    routing:{
      team: "Sample1",
      levels: {},
      skills: [],
      updated: true
    },
    callerStateAttr:{
      callerStates: ["Test1", "Test2"],
      skills: [],
      levels: {},
      updated: true
    },
    didUser: false,
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
    zeroOutEnabled: {
      value: false,
      updated: false
    },
    selfServiceInd: {
      value: false,
      updated: false
    }
  },
  calabrio_qm: {
    userFound: true,
    updated: false,
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
  calabrio_wfm: {
    userFound: false
  }
};

export const mockWorkers = [
  {
    attributes: {
      n_number: "n",
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
          "466"
        ],
        levels: {
          "466": 3
        },
        team:"Sample1"
      },
      callerStateAttr:{
        callerStates: ["Test1", "Test2"],
        updated: false
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
    selfServiceInd: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      n_number: "n",
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
          "466"
        ],
        levels: {
          "466": 3
        },
        team:"Sample1"
      },
    }
  },
  {
    // DID worker without overflow skill
    sid: "WK3",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    selfServiceInd: true,
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
         "466"
        ],
        levels: {
          "466": 3
        },
        team: "Sample1"
      }
    }
  },
  {
    sid: "WK4",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    selfServiceInd: true,
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
          "466"
        ],
        levels: {
          "466": 3
        },
        team: "Sample1"
      }
    }
  }
];