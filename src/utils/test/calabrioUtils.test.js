import {
  formatCalabrioTeams,
  formatCalabrioTenant,
  formatCalabrioGroups,
  formatCalabrioRoles,
  checkConflictingUsers
} from "utils";
import {
  getCalabrioUser,
  updateCalabrioUser
} from "services";
import {
  calabrioContext
} from "testUtils";

Date.now = jest.fn();

const orgPayload = [
  {
    name: "Group 1",
    groupLevel: "GROUP",
    users: [
      "user1",
      "user2",
      "user3"
    ]
  },
  {
    name: "Team 1",
    groupLevel: "TEAM",
    users: [
      "user1",
      "user2"
    ]
  },
  {
    name: "Team 2",
    groupLevel: "TEAM",
    users: []
  },
  {
    name: "Team 3",
    groupLevel: "TEAM"
  },
  {
    name: "Tenant",
    groupLevel: "TENANT"
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
    acdId: "WK9999666",
    email: null,
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
    acdId: "WK9999777",
    email: null,
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
    acdId: "WK9999888",
    email: null,
    firstName: "April",
    lastName: "Ludgate",
    adLogin: "LM\\n0261113",
    roles: [{
      id: 2,
      name: "Administrator"
    }],
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
    roles: [{
      id: 2,
      name: "Administrator"
    }],
    team: 213,
    scope: {
      teams: [],
      groups: []
    }
  }
];

let userResponse;

describe("calabrioUtils", () => {
  beforeEach(() => {
    jest.resetAllMocks(),
    Date.now.mockReturnValue("Right Now");
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
  describe("formatCalabrioTenant", () => {
    test("Calabrio payload is filtered as expected", () => {
      const expectedResult =
        {
          name: "Tenant",
          groupLevel: "TENANT"
        };
      const result = formatCalabrioTenant(orgPayload);
      expect(result).toStrictEqual(expectedResult);
    });
  });
  describe("formatCalabrioRoles", () => {
    const roles = [
      {
        name: "I'm a Role!",
        permissions: [
          { name: "I'm a permission!" }
        ]
      },
      {
        name: "I'm another Role!",
        permissions: [
          { name: "I'm another permission!" }
        ]
      }
    ];
    test("Calabrio payload is filtered as expected", () => {
      const expectedResult = [
        { name: "I'm a Role!" },
        { name: "I'm another Role!" }
      ];
      const result = formatCalabrioRoles(roles);
      expect(result).toStrictEqual(expectedResult);
    });
  });
  describe("checkConflictingUsers", () => {
    describe("acd Id === dupUser acd Id", () => {
      const user = {
        acdId: "WK9999888",
        email: "faith.griffin@libertymutual.com",
        firstName: "Faith",
        lastName: "Cuneo",
        adLogin: "LM\\n0260331"
      };
      test("should return", async () => {
        await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
        expect(getCalabrioUser).toBeCalledTimes(0);
        expect(updateCalabrioUser).toBeCalledTimes(0);
      });
    });
    describe("conflicting profile found with email", () => {
      const user = {
        acdId: "WK123000000",
        email: "faith.cuneo@libertymutual.com",
        firstName: "Faith",
        lastName: "Cuneo",
        adLogin: "LM\\n0260001",
        roles: [{
          id: 2,
          name: "Admin"
        }],
        team: 216,
        scope: {
          teams: [{
            id: 43,
            name: "Team Two"
          }],
          groups: []
        }
      };
      describe("getCalabrioUser fails", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[0]
            }
          };
          getCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("Error should be caught and logged", async () => {
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("1");
          expect(console.error).toBeCalledTimes(1);
          expect(console.error.mock.calls[0][0]).toContain("Error thrown trying to fetch and validate Conflicting Users");
        });
      });
      describe("updateCalabrioUser fails", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[0]
            }
          };
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("Error should be caught and logged", async () => {
          const updatedUser = {
            ...users[0],
            deactivated: "Right Now",
            email: `xx-${users[0].id}-${users[0].email}`,
            adLogin: `xx-${users[0].id}-${users[0].adLogin}`,
            acdId: `xx-${users[0].acdId}`
          };
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("1");
          expect(updateCalabrioUser).toBeCalledTimes(1);
          expect(updateCalabrioUser).toBeCalledWith("1", updatedUser);
          expect(console.error).toBeCalledTimes(1);
          expect(console.error.mock.calls[0][0]).toContain("Error thrown trying to fetch and validate Conflicting Users");
        });
      });
      describe("getCalabrioUser and updateCalabrioUser succeeds", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[0]
            }
          };
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockResolvedValue({ yay: "woot" });
        });
        test("No Error is returned and user is successfully updated", async () => {
          const updatedUser = {
            ...users[0],
            deactivated: "Right Now",
            email: `xx-${users[0].id}-${users[0].email}`,
            adLogin: `xx-${users[0].id}-${users[0].adLogin}`,
            acdId: `xx-${users[0].acdId}`
          };
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("1");
          expect(updateCalabrioUser).toBeCalledTimes(1);
          expect(updateCalabrioUser).toBeCalledWith("1", updatedUser);
          expect(console.error).toBeCalledTimes(0);
        });
        describe("Dup User has no team", () => {
          beforeEach(() => {
            userResponse = {
              data: {
                ...users[0],
                team: null
              }
            };
            getCalabrioUser.mockResolvedValue(userResponse);
          });
          test("No Error is returned and user is successfully updated", async () => {
            const updatedUser = {
              ...users[0],
              deactivated: "Right Now",
              email: `xx-${users[0].id}-${users[0].email}`,
              adLogin: `xx-${users[0].id}-${users[0].adLogin}`,
              acdId: `xx-${users[0].acdId}`,
              team: undefined
            };
            await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
            expect(getCalabrioUser).toBeCalledTimes(1);
            expect(getCalabrioUser).toBeCalledWith("1");
            expect(updateCalabrioUser).toBeCalledTimes(1);
            expect(updateCalabrioUser).toBeCalledWith("1", updatedUser);
            expect(console.error).toBeCalledTimes(0);
          });
        });
      });
    });
    describe("conflicting profile found with adLogin", () => {
      const user = {
        acdId: "WK123000000",
        email: "faith.scott@libertymutual.com",
        firstName: "Faith",
        lastName: "Cuneo",
        adLogin: "LM\\n0261114",
        roles: [{
          id: 2,
          name: "Admin"
        }],
        team: 216,
        scope: {
          teams: [{
            id: 43,
            name: "Team Two"
          }],
          groups: []
        }
      };
      describe("getCalabrioUser fails", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[4]
            }
          };
          getCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("Error should be caught and logged", async () => {
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("5");
          expect(console.error).toBeCalledTimes(1);
          expect(console.error.mock.calls[0][0]).toContain("Error thrown trying to fetch and validate Conflicting Users");
        });
      });
      describe("updateCalabrioUser fails", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[4]
            }
          };
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("Error should be caught and logged", async () => {
          const updatedUser = {
            ...users[4],
            deactivated: "Right Now",
            email: `xx-${users[4].id}-${users[4].email}`,
            adLogin: `xx-${users[4].id}-${users[4].adLogin}`,
            acdId: `xx-${users[4].acdId}`
          };
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("5");
          expect(updateCalabrioUser).toBeCalledTimes(1);
          expect(updateCalabrioUser).toBeCalledWith("5", updatedUser);
          expect(console.error).toBeCalledTimes(1);
          expect(console.error.mock.calls[0][0]).toContain("Error thrown trying to fetch and validate Conflicting Users");
        });
      });
      describe("getCalabrioUser and updateCalabrioUser succeeds", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[4]
            }
          };
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockResolvedValue({ yay: "woot" });
        });
        test("No Error is returned and user is successfully updated", async () => {
          const updatedUser = {
            ...users[4],
            deactivated: "Right Now",
            email: `xx-${users[4].id}-${users[4].email}`,
            adLogin: `xx-${users[4].id}-${users[4].adLogin}`,
            acdId: `xx-${users[4].acdId}`
          };
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("5");
          expect(updateCalabrioUser).toBeCalledTimes(1);
          expect(updateCalabrioUser).toBeCalledWith("5", updatedUser);
          expect(console.error).toBeCalledTimes(0);
        });
        describe("Dup User has no team", () => {
          beforeEach(() => {
            userResponse = {
              data: {
                ...users[4],
                team: null
              }
            };
            getCalabrioUser.mockResolvedValue(userResponse);
          });
          test("No Error is returned and user is successfully updated", async () => {
            const updatedUser = {
              ...users[4],
              deactivated: "Right Now",
              email: `xx-${users[4].id}-${users[4].email}`,
              adLogin: `xx-${users[4].id}-${users[4].adLogin}`,
              acdId: `xx-${users[4].acdId}`,
              team: undefined
            };
            await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
            expect(getCalabrioUser).toBeCalledTimes(1);
            expect(getCalabrioUser).toBeCalledWith("5");
            expect(updateCalabrioUser).toBeCalledTimes(1);
            expect(updateCalabrioUser).toBeCalledWith("5", updatedUser);
            expect(console.error).toBeCalledTimes(0);
          });
        });
        describe("Dup User has no roles", () => {
          beforeEach(() => {
            userResponse = {
              data: {
                ...users[4],
                roles: []
              }
            };
            getCalabrioUser.mockResolvedValue(userResponse);
          });
          test("No Error is returned and user is successfully updated", async () => {
            const updatedUser = {
              ...users[4],
              deactivated: "Right Now",
              email: `xx-${users[4].id}-${users[4].email}`,
              adLogin: `xx-${users[4].id}-${users[4].adLogin}`,
              acdId: `xx-${users[4].acdId}`,
              roles: []
            };
            await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
            expect(getCalabrioUser).toBeCalledTimes(1);
            expect(getCalabrioUser).toBeCalledWith("5");
            expect(updateCalabrioUser).toBeCalledTimes(1);
            expect(updateCalabrioUser).toBeCalledWith("5", updatedUser);
            expect(console.error).toBeCalledTimes(0);
          });
        });
      });
    });
    describe("conflicting profile found with First and Last Name", () => {
      const user = {
        acdId: "WK123000000",
        email: "April.Ludgate@libertymutual.com",
        firstName: "April",
        lastName: "Ludgate",
        adLogin: "LM\n0260111",
        roles: [{
          id: 2,
          name: "Admin"
        }],
        team: 216,
        scope: {
          teams: [{
            id: 43,
            name: "Team Two"
          }],
          groups: []
        }
      };
      describe("getCalabrioUser fails", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[3]
            }
          };
          getCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("Error should be caught and logged", async () => {
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("4");
          expect(console.error).toBeCalledTimes(1);
          expect(console.error.mock.calls[0][0]).toContain("Error thrown trying to fetch and validate Conflicting Users");
        });
      });
      describe("updateCalabrioUser fails", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[3]
            }
          };
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockRejectedValue({ boo: "aww" });
        });
        test("Error should be caught and logged", async () => {
          const updatedUser = {
            ...users[3],
            deactivated: "Right Now",
            email: `SHELLUSER-${users[3].id}@libertymutual.com`,
            adLogin: `SHELLUSER-${users[3].id}`,
            acdId: `SH-${users[3].acdId}`
          };
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("4");
          expect(updateCalabrioUser).toBeCalledTimes(1);
          expect(updateCalabrioUser).toBeCalledWith("4", updatedUser);
          expect(console.error).toBeCalledTimes(1);
          expect(console.error.mock.calls[0][0]).toContain("Error thrown trying to fetch and validate Conflicting Users");
        });
      });
      describe("getCalabrioUser and updateCalabrioUser succeeds", () => {
        beforeEach(() => {
          userResponse = {
            data: {
              ...users[3]
            }
          };
          getCalabrioUser.mockResolvedValue(userResponse);
          updateCalabrioUser.mockResolvedValue({ yay: "woot" });
        });
        test("No Error is returned and user is successfully updated", async () => {
          const updatedUser = {
            ...users[3],
            deactivated: "Right Now",
            email: `SHELLUSER-${users[3].id}@libertymutual.com`,
            adLogin: `SHELLUSER-${users[3].id}`,
            acdId: `SH-${users[3].acdId}`
          };
          await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
          expect(getCalabrioUser).toBeCalledTimes(1);
          expect(getCalabrioUser).toBeCalledWith("4");
          expect(updateCalabrioUser).toBeCalledTimes(1);
          expect(updateCalabrioUser).toBeCalledWith("4", updatedUser);
          expect(console.error).toBeCalledTimes(0);
        });
        describe("Dup User has no roles", () => {
          beforeEach(() => {
            userResponse = {
              data: {
                ...users[3],
                roles: []
              }
            };
            getCalabrioUser.mockResolvedValue(userResponse);
          });
          test("No Error is returned and user is successfully updated", async () => {
            const updatedUser = {
              ...users[3],
              deactivated: "Right Now",
              email: `SHELLUSER-${users[3].id}@libertymutual.com`,
              adLogin: `SHELLUSER-${users[3].id}`,
              acdId: `SH-${users[3].acdId}`,
              roles: []
            };
            await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
            expect(getCalabrioUser).toBeCalledTimes(1);
            expect(getCalabrioUser).toBeCalledWith("4");
            expect(updateCalabrioUser).toBeCalledTimes(1);
            expect(updateCalabrioUser).toBeCalledWith("4", updatedUser);
            expect(console.error).toBeCalledTimes(0);
          });
        });
        describe("Dup User has no team", () => {
          beforeEach(() => {
            userResponse = {
              data: {
                ...users[3],
                team: null
              }
            };
            getCalabrioUser.mockResolvedValue(userResponse);
          });
          test("No Error is returned and user is successfully updated", async () => {
            const updatedUser = {
              ...users[3],
              deactivated: "Right Now",
              email: `SHELLUSER-${users[3].id}@libertymutual.com`,
              adLogin: `SHELLUSER-${users[3].id}`,
              acdId: `SH-${users[3].acdId}`,
              team: undefined
            };
            await checkConflictingUsers(user, users, calabrioContext.roles, calabrioContext.teams);
            expect(getCalabrioUser).toBeCalledTimes(1);
            expect(getCalabrioUser).toBeCalledWith("4");
            expect(updateCalabrioUser).toBeCalledTimes(1);
            expect(updateCalabrioUser).toBeCalledWith("4", updatedUser);
            expect(console.error).toBeCalledTimes(0);
          });
        });
      });
    });
  });
});