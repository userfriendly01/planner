import {
  formatCalabrioTeams,
  formatCalabrioGroups
  // checkConflictingUsers
} from "utils";
import {
  getCalabrioUser,
  updateCalabrioUser
} from "../../services/calabrio";

jest.mock("../../services/calabrio", () => ({
  getCalabrioUser: jest.fn(),
  updateCalabrioUser: jest.fn()
}));

const orgPayload = [
  {
    name: "Group 1",
    groupLevel: "GROUP",
    agents: [
      "agent1",
      "agent2",
      "agent3"
    ]
  },
  {
    name: "Team 1",
    groupLevel: "TEAM",
    agents: [
      "agent1",
      "agent2"
    ]
  },
  {
    name: "Team 2",
    groupLevel: "TEAM",
    agents: []
  },
  {
    name: "Team 3",
    groupLevel: "TEAM"
  }
];

const users = [
  {
    id: "1",
    acdId: "WK123456789",
    email: "faith.cuneo@libertymutual.com",
    firstName: "Faith",
    lastName: "Cuneo",
    adLogin: "LM\\n0263786",
    roles: [{
      id: 2,
      name: "Administrator"
    }],
    team: 213,
    scope: {
      teams: [{
        id: 43,
        name: "Team One"
      }],
      groups: []
    }
  },
  {
    id: "2",
    acdId: "",
    email: "",
    firstName: "April",
    lastName: "",
    adLogin: "LM\\n0261111",
    roles: [],
    team: 213,
    scope: {
      teams: [],
      groups: []
    }
  },
  {
    id: "3",
    acdId: "",
    email: "",
    firstName: "",
    lastName: "Ludgate",
    adLogin: "LM\\n0261112",
    roles: [],
    team: 213,
    scope: {
      teams: [],
      groups: []
    }
  },
  {
    id: "4",
    acdId: "",
    email: "",
    firstName: "April",
    lastName: "Ludgate",
    adLogin: "LM\\n0261113",
    roles: [],
    team: 213,
    scope: {
      teams: [],
      groups: []
    }
  },
  {
    id: "5",
    acdId: "",
    email: "",
    firstName: "",
    lastName: "",
    adLogin: "LM\\n0261114",
    roles: [],
    team: 213,
    scope: {
      teams: [],
      groups: []
    }
  }
];

describe("calabrioUtils", () => {
  beforeEach(() => {
    // jest.clearAllMocks();
  });
  describe("formatCalabrioTeams", () => {
    test("Calabrio payload is filtered as expected", () => {
      const expectedResult = [
        {
          name: "Team 1",
          groupLevel: "TEAM"
        },
        {
          name: "Team 2",
          groupLevel: "TEAM"
        },
        {
          name: "Team 3",
          groupLevel: "TEAM"
        }
      ];
      const result = formatCalabrioTeams(orgPayload);
      expect(result).toStrictEqual(expectedResult);
    });
  });
  describe("formatCalabrioGroups", () => {
    test("Calabrio payload is filtered as expected", () => {
      const expectedResult = [
        {
          name: "Group 1",
          groupLevel: "GROUP"
        }
      ];
      const result = formatCalabrioGroups(orgPayload);
      expect(result).toStrictEqual(expectedResult);
    });
  });
  describe("checkConflictingUsers", () => {
    const userResponse = {
      data: {}
    };
    describe("conflicting profile found with email", () => {
      // const user = {
      //   acdId: "WK123000000",
      //   email: "faith.cuneo@libertymutual.com",
      //   firstName: "Faith",
      //   lastName: "Cuneo",
      //   adLogin: "LM\n0260000",
      //   roles: [{
      //     id: 2,
      //     name: "Admin"
      //   }],
      //   team: 216,
      //   scope: {
      //     teams: [{
      //       id: 43,
      //       name: "Team Two"
      //     }],
      //     groups: []
      //   }
      // };
      describe("getCalabrioUser fails", () => {
        beforeEach(() => {
          getCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("Error should be caught and logged", async () => {
          // await checkConflictingUsers(user, users);
          // expect(getCalabrioUser.mock.calls).toBe("screwthistest");
        });
      });
      describe("updateCalabrioUser fails", () => {
        beforeEach(() => {
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("", () => {

        });
      });
      describe("getCalabrioUser and updateCalabrioUser succeeds", () => {
        beforeEach(() => {
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockResolvedValue({ yay: "woot" });
        });
        test("", () => {

        });
      });
    });
    describe("conflicting profile found with adLogin", () => {
      describe("getCalabrioUser fails", () => {
        beforeEach(() => {
          getCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("", () => {

        });
      });
      describe("updateCalabrioUser fails", () => {
        beforeEach(() => {
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("", () => {

        });
      });
      describe("getCalabrioUser and updateCalabrioUser succeeds", () => {
        beforeEach(() => {
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockResolvedValue({ yay: "woot" });
        });
        test("", () => {

        });
      });
    });
  });
});