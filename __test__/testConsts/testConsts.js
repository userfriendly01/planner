import { initialState } from "context";

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
      },
      {
        attributes: {
          n_number: "n2222222",
          profile_id: 0
        }
      }
    ]
  },
  calabrioContext
};