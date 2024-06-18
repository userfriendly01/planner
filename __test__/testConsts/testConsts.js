export const managerList = [
  {
    manager_first_name: "John",
    manager_last_name: "Wick",
    manager_n_num: "n1234567",
    manager_id: "01",
    profile_id: 11
  },
  {
    manager_first_name: "Test",
    manager_last_name: "Manager",
    manager_n_num: "n7454853",
    manager_id: "02"
  }
];

export const mockSkills = [
  {
    skill: "aisgl1"
  }
];

export const officeMap = [
  {

    office_name: "Office 1",
    office_num: "ABC123"
  }
  ,
  {

    office_name: "Office 2",
    office_num: "0002"
  }
];

export const profileList = [
  {
    profile_nme: "test1",
    profile_id: 1,
    overflow_skill: null,
    operating_unit_sid: "operatingUnitSid1"
  },
  {
    profile_nme: "test2",
    profile_id: 2,
    overflow_skill: "whateverOverflowSkill",
    operating_unit_nme: "operatingUnitName",
    operating_unit_sid: "operatingUnitSid1",
    routing_teams: [
      {
        routing_team_nme: "licencedCSC"
      }
    ]
  },
  {
    profile_nme: "test3",
    profile_id: 3,
    overflow_skill: "anotherOverflowSkill",
    operating_unit_sid: "operatingUnitSid2"
  },
  {
    profile_nme: "test4",
    profile_id: 396,
    overflow_skill: "weirdNumberSkill",
    operating_unit_nme: "operatingUnitName",
    operating_unit_sid: "operatingUnitSid2"
  },
  {
    profile_nme: "test5",
    profile_id: 12,
    overflow_skill: "anotherOverflowSkill",
    operating_unit_sid: "operatingUnitSid2",
    operating_unit_nme: "Claims"
  }
];

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
      name: "QM Supervisor",
      permissions: [{ name: "permission 1" }]
    },
    {
      id: 2,
      name: "QM Agent",
      permissions: [{ name: "permission 2" }, { name: "permission 3" }]
    },
    {
      id: 3,
      name: "WFM_Agent_NT_Dashboards"
    },
    {
      id: 4,
      name: "No Screen"
    },
    {
      id: 5,
      name: "Supervisor-Sync Only"
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
  ],
  wfmOptions: [
    {
      Id: "123-321",
      Name: "WFM Business Unit1",
      Absences: [
        {
          Name: "Absence1",
          Id: "111"
        }
      ],
      Availabilities: [
        {
          Name: "Availability1",
          Id: "123123"
        }
      ],
      Budget_Groups: [
        {
          Name: "BudgetGroup1",
          Id: "000"
        }
      ],
      Contract_Schedules: [
        {
          Name: "ContractSchedule1",
          Id: "111"
        }
      ],
      Contracts: [
        {
          Name: "Contract1",
          Id: "111"
        }
      ],
      Optional_Columns: [
        {
          Name: "OptionalCol1",
          Id: "111"
        },
        {
          Name: "OptionalCol2",
          Id: "222"
        },
        {
          Name: "OptionalCol3",
          Id: "333"
        }
      ],
      Part_Time_Percentages: [
        {
          Name: "ParttimePercent1",
          Id: "111"
        }
      ],
      Roles: [
        {
          Name: "Role1",
          Id: "111"
        },
        {
          Name: "Role2",
          Id: "222"
        }
      ],
      Rotations: [
        {
          Name: "Rotation1",
          Id: "111"
        }
      ],
      Shift_Bags: [
        {
          Name: "ShiftBag1",
          Id: "111"
        }
      ],
      Skills: [
        {
          Name: "Skill1",
          Id: "111"
        },
        {
          Name: "Skill2",
          Id: "222"
        }
      ],
      Workflow_Control_Sets: [
        {
          Name: "WFCSet1",
          Id: "111"
        }
      ]
    },
    {
      Id: "999-999",
      Name: "Other WFM Business Unit",
      Availabilities: [
        {
          Name: "Availability2",
          Id: "222"
        }
      ],
      Absences: [
        {
          Name: "Absence1",
          Id: "111"
        }
      ],
      Budget_Groups: [],
      Contract_Schedules: [
        {
          Name: "ContractSchedule2",
          Id: "222"
        }
      ],
      Contracts: [
        {
          Name: "Contract2",
          Id: "222"
        }
      ],
      Optional_Columns: [],
      Part_Time_Percentages: [
        {
          Name: "ParttimePercent2",
          Id: "222"
        }
      ],
      Roles: [
        {
          Name: "Role3",
          Id: "333"
        },
        {
          Name: "Role4",
          Id: "444"
        }
      ],
      Rotations: [],
      Shift_Bags: [],
      Skills: [],
      Workflow_Control_Sets: []
    }
  ],
  wfmOrg: [
    {
      Id: "123-321",
      Name: "Cool WFM Business Unit",
      Teams: [
        {
          Name: "Team1",
          Id: "111",
          People: [{
            BusinessUnitId: "123-321",
            EmploymentNumber: "n1111111",
            Email: "Person@libertymutual.com",
            TeamId: "111"
          }]
        },
        {
          Name: "Team2",
          Id: "222",
          People: []
        },
        {
          Name: "Team3 No ID",
          Id: null,
          People: []
        }
      ]
    },
    {
      Id: "999-999",
      Name: "Other WFM Business Unit",
      Teams: [
        {
          Name: "Fake team",
          Id: "000",
          People: [{
            BusinessUnitId: "999-999",
            FirstName: "Faith",
            EmploymentNumber: "n8765432"
          }]
        },
        {
          Name: "Other Fake team",
          Id: "999",
          People: []
        }
      ]
    },
    {
      Id: "People_Without_Team",
      Name: "People_Without_Team",
      People: [{
        EmploymentNumber: "n0000000",
        Email: "ihavenoteam@email.com",
        TeamId: null
      }],
      Teams: []
    }
  ],
  wfmErrors: []
};

export const skillsList = [
  {
    name: "lscOBDialer1",
    ctmSkillId: 1,
    ctmSkillDisplayName: "lsc OB Dialer 1",
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
    profiles: [{
      profileName: "Licensed Sales Center",
      profileId: 32
    }],
    flashMessage: "",
    closedMessage: "",
    levels: [1, 2, 3],
    timeOfDays: [],
    vhCallTarget: null,
    vhCallerId: null,
    vhThreshold: null
  },
  {
    name: "aisgL1",
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
    ctmSkillId: 3,
    ctmSkillDisplayName: "bsc Commisssions",
    skillGroups: [],
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
    ctmSkillId: 4,
    ctmSkillDisplayName: "bsc Cbs L2",
    skillGroups: [],
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
    ctmSkillId: 5,
    ctmSkillDisplayName: "lsc USAA",
    skillGroups: [],
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

export const skillGroups = [
  {
    skillGroupId: 1,
    skillGroupNme: "skillgroup1",
    skills: [{
      name: "lscOBDialer1",
      ctmSkillId: 1,
      ctmSkillDisplayName: "lsc OB Dialer 1",
      profiles: [{
        profileName: "Licensed Sales Center",
        profileId: 32
      }],
      flashMessage: "",
      closedMessage: "",
      levels: [1, 2, 3],
      timeOfDays: [],
      vhCallTarget: null,
      vhCallerId: null,
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
      ctmSkillId: 3,
      ctmSkillDisplayName: "bsc Commisssions",
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
    }]
  }
];

export const mockActivities = [
  {
    activity_id: 1,
    activity_sid: "WA98fb57313627153d707a17f549566046",
    workspace_sid: "WSde21cfcdde7bcb69cd82f1c060e5dba0",
    activity_nme: "Offline",
    activity_cde: "OFFLINE",
    available_i: {
      type: "Buffer",
      data: [
        0
      ]
    },
    wfm_cde: "10",
    row_crtn_dtm: "2019-10-24T12:58:48.000Z",
    row_updt_dtm: "2019-10-24T12:58:48.000Z"
  },
  {
    activity_id: 2,
    activity_sid: "WA82a8ca5773657c4d20f9fc20d909b14e",
    workspace_sid: "WSde21cfcdde7bcb69cd82f1c060e5dba0",
    activity_nme: "Available",
    activity_cde: "AVAILABLE",
    available_i: {
      type: "Buffer",
      data: [
        1
      ]
    },
    wfm_cde: "20",
    row_crtn_dtm: "2019-10-24T12:58:48.000Z",
    row_updt_dtm: "2019-10-24T12:58:48.000Z"
  }
];

export const mockCallTags = [
  {
    wrkr_tsk_info_id: 1,
    wrkr_tsk_info_nme: "call_type"
  },
  {
    wrkr_tsk_info_id: 2,
    wrkr_tsk_info_nme: "claim_number"
  },
  {
    wrkr_tsk_info_id: 3,
    wrkr_tsk_info_nme: "negotiation_type"
  },
  {
    wrkr_tsk_info_id: 4,
    wrkr_tsk_info_nme: "claimant_name"
  },
  {
    wrkr_tsk_info_id: 5,
    wrkr_tsk_info_nme: "event_number"
  },
  {
    wrkr_tsk_info_id: 6,
    wrkr_tsk_info_nme: "aces_claim_number"
  },
  {
    wrkr_tsk_info_id: 7,
    wrkr_tsk_info_nme: "claim_id"
  },
  {
    wrkr_tsk_info_id: 8,
    wrkr_tsk_info_nme: "notes"
  }
];

export const mockCallTagOptions = [
  {
    options_id: 1,
    options: "[\"Info Exchange\", \"Bargaining\", \"Closing\", \"N/A\", \"Offer\"]"
  },
  {
    options_id: 2,
    options: "[\"Recorded Interview\", \"Injured Worker\", \"Provider\", \"Customer\", \"Other\"]"
  }
];

export const mockAggregateQueues = [
  {
    aggregate_queues_id: 4,
    aggregate_queues_nme: "Licensed Sales Center",
    aggregate_queues_type: "aggregate",
    owner_type: "profile",
    worker_sid: null,
    row_crtn_dtm: "",
    row_updt_dtm: null
  }
];

export const initialTestState = {
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
    skills: skillsList,
    skillGroups: skillGroups
  },
  userContext: {
    nNumber: "n1234567",
    profileId: 10,
    accessToken: "blaahahh",
    isAdmin: false,
    permissions: [
      {
        roles: [
          {
            name: "Admin",
            permissionLevel: "write"
          }
        ],
        authenticationProfile: {
          name: "Triton",
          permissionLevel: "read",
          tabs: []
        }
      }
    ]
  },
  workerContext: {
    workers: [
      {
        skillsDifferent: true,
        sid: "wk049358",
        attributes: {
          full_name: "Faith Cuneo",
          emp_first_name: "Faith",
          emp_last_name: "Cuneo",
          n_number: "N0263786",
          extension: "1234",
          profile_id: 12,
          manager_n_number: "n023356"
        }
      },
      {
        attributes: {
          full_name: "Gloria Sake",
          emp_first_name: "Gloria",
          emp_last_name: "Sake",
          n_number: "n0000000",
          extension: "2345",
          profile_id: "12",
          manager_n_number: "n0263786"
        },
        sid: "WK1234"
      },
      {
        attributes: {
          full_name: "Bree Hodge",
          emp_first_name: "Bree",
          emp_last_name: "Hodge",
          extension: "3456",
          n_number: "n1111111",
          manager_n_number: "n0263512"
        }
      },
      {
        attributes: {
          full_name: "Andrew VandeKamp",
          emp_first_name: "Andrew",
          emp_last_name: "VandeKamp",
          extension: "7891",
          n_number: "n2222222",
          profile_id: 0,
          manager_n_number: "n0260000"
        }
      },
      {
        attributes: {
          full_name: "Susan Delfino",
          emp_first_name: "Susan",
          emp_last_name: "Delfino",
          extension: "7833",
          n_number: "n222354",
          profile_id: 0,
          manager_n_number: "n0260000"
        }
      },
      {
        attributes: {
          full_name: "Snowball Jones",
          emp_first_name: "Snowball",
          emp_last_name: "Jones",
          extension: "7891",
          n_number: "n2223333",
          email: "snowball.jones@libertymutual.com",
          profile_id: 2,
          manager_n_number: "n0260000"
        }
      },
      {
        attributes: {
          full_name: "Worker McGee",
          emp_first_name: "Worker",
          emp_last_name: "McGee",
          extension: "9872",
          n_number: "n1234568",
          email: "worker.mcgee@libertymutual.com",
          profile_id: 10,
          didUser: false
        },
        sid: "WK1234"
      }
    ],
    isLoading: false
  },
  calabrioContext,
  resettingSkills: false,
  userManagementTableFilters: {
    managerFilter: null,
    profileFilterArray: [],
    ouFilterArray: []
  }
};

export const mockOperatingUnits = [
  {
    ou_name: "testname",
    ou_sid: "testsid"
  },
  {
    ou_name: "testname1",
    ou_sid: "testsid1"
  }
];
