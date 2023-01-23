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
      name: "Supervisor"
    },
    {
      id: 2,
      name: "QM Agent"
    },
    {
      id: 3,
      name: "WFM_QM_Agent_NT"
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
    ctmSkillId: 1,
    ctmSkillDisplayName: "lsc OB Dialer 1",
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
  },
  {
    name: "bscCbsL2",
    ctmSkillId: 4,
    ctmSkillDisplayName: "bsc Cbs L2",
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
    skills: skillsList
  },
  userContext: {
    pingIdentity: {
      sub: "n0263786",
      groups: []
    },
    authenticationProfiles: [
      {
        name: "Triton",
        permissionLevel: "read",
        isAdmin: false,
        profileId: 10,
        tabs: []
      }
    ]
  },
  workerContext: {
    workers: [
      {
        skillsDifferent: true,
        attributes: {
          full_name: "Faith Cuneo",
          n_number: "N0263786",
          extension: "1234",
          profile_id: 12
        }
      },
      {
        attributes: {
          full_name: "Gloria Sake",
          n_number: "n0000000",
          extension: "2345",
          profile_id: "12"
        }
      },
      {
        attributes: {
          full_name: "Bree Hodge",
          extension: "3456",
          n_number: "n1111111"
        }
      },
      {
        attributes: {
          full_name: "Andrew VandeKamp",
          extension: "7891",
          n_number: "n2222222",
          profile_id: 0
        }
      }
    ]
  },
  calabrioContext,
  resettingSkills: false
};