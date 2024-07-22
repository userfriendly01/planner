import {
  mockTaskQueues, mockSkills
} from "./skillConsts";
import {
  mockAccessGroups, mockActivities, mockScreenpops, mockCallTags,
  mockCallTagOptions
} from "./profileEntryFormConsts";
import {
  DialListNumber, DirectoryNumber
} from "globals/interfaces";

export const mockOperatingUnits = [
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

export const mockDialList: Partial<DialListNumber>[] = [
  {
    profile_id: 1,
    contact_num: "8008436446",
    contact_name: "Ohio Casualty (OCAS Legacy)",
    external_num: null,
    id: "2hTa9wuALlic3Ze2oGFBUNO3RfP"
  },
  {
    profile_id: 1,
    contact_num: "8777512640",
    contact_name: "Bond - Billing",
    external_num: null,
    id: "2hTa9xdNCFHTGaHQ60dM0VwTf8E"
  },
  {
    profile_id: 1,
    contact_num: "4122264562",
    contact_name: "Global Risk Solutions - Sales",
    external_num: "8774668029",
    id: "2hTaATqcywqLZaczIhbvrBC98Hx"
  },
  {
    profile_id: 2,
    contact_num: "4127439935",
    contact_name: "LNW Billing",
    external_num: "8005381648",
    id: "2hTa9yfOM8aEclEdQIXnbWhGaEh"
  }
];

export const mockDirectoryList: Partial<DirectoryNumber>[] = [
  {
    id: "2hTZxO1GYOzL0Ewynop4nd2d3Ng",
    directory_num: "6039709235",
    first_name: "Mike",
    last_name: "Ross",
    profile_id: 0
  },
  {
    id: "2hTZxaWxVVBut1hWII0zHvFcYxg",
    directory_num: "7158706175",
    first_name: "Billy Bob",
    last_name: "Thorton",
    profile_id: 2
  },
  {
    id: "2hTZxcHS3DOIRfZggtol2h9xyOi",
    directory_num: "6039709234",
    first_name: "Jane",
    last_name: "Catalfo",
    profile_id: 2
  }
];

export const mockProfiles = [
  {
    profile_id: 0,
    ou_sid: mockOperatingUnits[0].ou_sid,
    ou_name: mockOperatingUnits[0].ou_name,
    profile_name: "Game of Phones",
    overflow_skill: mockSkills[0].name,
    acw_option: true,
    acw_tags: true,
    agnt_asst_pay: true,
    auto_ans: true,
    edt_policy_num: true,
    edt_claim_num: true,
    call_reason: true,
    clk_to_dial: true,
    eft_auth: true,
    inbnd_rec: true,
    man_outbnd_rec: true,
    man_inbnd_rec: true,
    outbnd_rec: true,
    takes_paymnts: true,
    voice_mail_trans: true,
    backup_workers: true,
    fwd_to_num: "8665680296",
    transfer_queues: [mockTaskQueues[0].sid, mockTaskQueues[1].sid],
    access_group: mockAccessGroups[0],
    screenpops: [mockScreenpops[0]],
    activities: [mockActivities[0], mockActivities[1]],
    call_tags: mockCallTags
  },
  {
    profile_id: 1,
    ou_sid: mockOperatingUnits[1].ou_sid,
    ou_name: mockOperatingUnits[1].ou_name,
    profile_name: "USRM Billing & Collections",
    overflow_skill: null,
    acw_option: false,
    acw_tags: false,
    agnt_asst_pay: false,
    auto_ans: false,
    edt_policy_num: false,
    edt_claim_num: false,
    call_reason: false,
    clk_to_dial: false,
    eft_auth: false,
    inbnd_rec: false,
    man_outbnd_rec: false,
    man_inbnd_rec: false,
    outbnd_rec: false,
    takes_paymnts: false,
    voice_mail_trans: false,
    backup_workers: false,
    fwd_to_num: null,
    transfer_queues: [],
    access_group: null,
    screenpops: [],
    activities: [],
    call_tags: []
  },
  {
    profile_id: 2,
    ou_sid: mockOperatingUnits[1].ou_sid,
    ou_name: mockOperatingUnits[1].ou_name,
    profile_name: "GRS Casualty",
    overflow_skill: null,
    acw_option: false,
    acw_tags: false,
    agnt_asst_pay: false,
    auto_ans: false,
    edt_policy_num: false,
    edt_claim_num: false,
    call_reason: false,
    clk_to_dial: false,
    eft_auth: false,
    inbnd_rec: false,
    man_outbnd_rec: false,
    man_inbnd_rec: false,
    outbnd_rec: false,
    takes_paymnts: false,
    voice_mail_trans: false,
    backup_workers: false,
    fwd_to_num: null,
    transfer_queues: [],
    access_group: mockAccessGroups[1],
    screenpops: [],
    activities: [],
    call_tags: []
  }

];

export const calabrioContext: any = {
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

export const initialTestState: any = {
  profileContext: {
    activities: mockActivities,
    accessGroups: mockAccessGroups,
    calltags: mockCallTagOptions,
    screenpops: mockScreenpops,
    profiles: mockProfiles,
    directoryEntries: mockDirectoryList,
    dialListEntries: mockDialList
  },
  managerContext: {
    managers: managerList
  },
  userContext: {
    nNumber: "n1234567",
    profileId: 10,
    tokens: {
      msGraph: "Access Token",
      sharedGraph: "Access Token",
      calabrioService: "Access Token",
      adminService: "Access Token"
    },
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
        isConsole: true,
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
        sid: "WK66654654",
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
    loadStatus: null
  },
  calabrioContext,
  userManagementTableFilters: {
    managerFilter: null,
    profileFilterArray: [],
    ouFilterArray: []
  }
};