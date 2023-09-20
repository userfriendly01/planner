import {
  addWorkerToOrg,
  findMatchingQmProfiles,
  formatCalabrioTeams,
  formatCalabrioTenant,
  formatCalabrioGroups,
  formatCalabrioRoles,
  checkConflictingUsers,
  getCalabrioWfmOptions,
  getCalabrioWfmOrg,
  getWfmBusinessUnits,
  getWfmTeams,
  getWfmPeople,
  getWfmOptions as getWfmOptionsUtil
} from "utils";
import {
  getCalabrioUser,
  updateCalabrioUser,
  getWfmOptions,
  getWfmOrg
} from "services";
import { calabrioContext, initialTestState } from "testUtils";
import zlib from "zlib";

Date.now = jest.fn();

jest.mock("zlib", () => ({
  inflate: jest.fn()
}));

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

const mockDispatch = jest.fn();
const mockSetForm = jest.fn();

let userResponse;

describe("calabrioUtils", () => {
  beforeEach(() => {
    jest.resetAllMocks(),
      jest.clearAllMocks(),
      Date.now.mockReturnValue("Right Now");
  });

  describe("addWorkerToOrg", () => {
    test("team is null - should add to People_Without_Team", () => {
      const user = { BusinessUnitId: "123-321" };
      const result = addWorkerToOrg(user, { ...initialTestState });
      const pwt = initialTestState.calabrioContext.wfmOrg.find(bu => bu.Id === "People_Without_Team");
      const org = initialTestState.calabrioContext.wfmOrg.filter(bu => bu.Id !== "People_Without_Team");
      expect(result).toStrictEqual([
        ...org,
        {
          ...pwt,
          People: [
            ...pwt.People,
            user
          ]
        }
      ]);
    });
    test("team is populated - should add to appropriate BU", () => {
      const user = { BusinessUnitId: "123-321", TeamId: "111" };
      const result = addWorkerToOrg(user, { ...initialTestState });
      const org = initialTestState.calabrioContext.wfmOrg.filter(bu => bu.Id !== user.BusinessUnitId);
      const bu = initialTestState.calabrioContext.wfmOrg.find(bu => bu.Id === user.BusinessUnitId);
      const team = bu.Teams.find(t => t.Id === user.TeamId);
      const teams = bu.Teams.filter(t => t.Id !== user.TeamId);
      expect(result).toStrictEqual([
        {
          ...bu,
          Teams: [
            ...teams,
            {
              ...team,
              People: [
                ...team.People,
                user
              ]
            }
          ]
        },
        ...org,
      ]);
    });
  });
  describe("getWfmBusinessUnits", () => {
    test("lost souls === true - returns list of Business units containing Name and Id", () => {
      const result = getWfmBusinessUnits({ calabrioContext }, true);
      expect(result).toEqual([{
        Name: "Cool WFM Business Unit",
        Id: "123-321"
      }, {
        Name: "Other WFM Business Unit",
        Id: "999-999"
      },
      {
        Name: "People_Without_Team",
        Id: "People_Without_Team"
      }]);
    });
    test("lost souls === false - returns list of Business units containing Name and Id", () => {
      const result = getWfmBusinessUnits({ calabrioContext }, false);
      expect(result).toEqual([{
        Name: "Cool WFM Business Unit",
        Id: "123-321"
      }, {
        Name: "Other WFM Business Unit",
        Id: "999-999"
      }
      ]);
    });
  });
  describe("getWfmTeams", () => {
    describe("Business Unit id is provided", () => {
      describe("includeLostSouls is true", () => {
        test("should return teams from the provided bu", () => {
          const result = getWfmTeams({ calabrioContext }, "999-999");
          expect(result).toEqual([
            {
              Name: "Fake team",
              Id: "000",
              People: [{
                BusinessUnitId: "999-999",
                FirstName: "Faith",
                EmploymentNumber: "n8765432",
              }]
            },
            {
              Name: "Other Fake team",
              Id: "999",
              People: []
            }
          ]);
        });
      });
    });
    describe("Business Unit id is NOT provided", () => {
      describe("includeLostSouls is true", () => {
        test("should return teams from all BUs and will include teams without ids", () => {
          const result = getWfmTeams({ calabrioContext }, null, true);
          expect(result).toEqual([
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
            },
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
          ]);
        });
      });
      describe("includeLostSouls is false", () => {
        test("should return a list of teams from all BUs, not including teams without ids", () => {
          const result = getWfmTeams({ calabrioContext }, null, false);
          expect(result).toEqual([
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
          ]);
        });
      });
    });
  });
  describe("getWfmPeople", () => {
    test("returns all WFM People in wfmOrg and adds team.id as ParentTeam on each person", () => {
      const result = getWfmPeople({ calabrioContext });
      expect(result).toEqual([
        {
          EmploymentNumber: "n0000000",
          Email: "ihavenoteam@email.com",
          TeamId: null
        },
        {
          BusinessUnitId: "123-321",
          EmploymentNumber: "n1111111",
          Email: "Person@libertymutual.com",
          ParentTeam: "111",
          TeamId: "111"
        },
        {
          BusinessUnitId: "999-999",
          FirstName: "Faith",
          EmploymentNumber: "n8765432",
          ParentTeam: "000"
        }
      ]);
    });
  });
  describe("getWfmOptions", () => {
    describe("busniess unit id is passed to function", () => {
      test("returns list of options for the specified Business unit", () => {
        const result = getWfmOptionsUtil({ calabrioContext }, "123-321");
        expect(result).toEqual({
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
        })
      });
      test("returns list of options for all Business units", () => {
        const result = getWfmOptionsUtil({ calabrioContext });
        expect(result).toEqual({
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
            },
            {
              Name: "Availability2",
              Id: "222"
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
            },
            {
              Name: "ContractSchedule2",
              Id: "222"
            }
          ],
          Contracts: [
            {
              Name: "Contract1",
              Id: "111"
            },
            {
              Name: "Contract2",
              Id: "222"
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
            }
          ],
          Part_Time_Percentages: [
            {
              Name: "ParttimePercent1",
              Id: "111"
            },
            {
              Name: "ParttimePercent2",
              Id: "222"
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
            },
            {
              Name: "Role3",
              Id: "333"
            },
            {
              Name: "Role4",
              Id: "444"
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
        });
      });
    });
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
        { name: "I'm a Role!", permissions: [{ name: "I'm a permission!" }] },
        { name: "I'm another Role!", permissions: [{ name: "I'm another permission!" }] }
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
  describe("findMatchingQmProfiles", () => {
    const users = [
      {
        acdId: "",
        adLogin: "",
        email: "Roy.Anderson@libertymutual.com"
      },
      {
        acdId: "WK123456",
        adLogin: "Lm\\n3582215",
        email: "Roy.Anderson@libertymutual.com"
      }
    ]
    describe("Error is thrown", () => {
      test("empty array is returned", () => {
        const result = findMatchingQmProfiles(null, [], mockSetForm);
        expect(result).toStrictEqual([]);
        expect(console.error.mock.calls[0][0]).toContain("Error thrown trying to find QM profiles");
      });
    });
    describe("Triton User is passed through", () => {
      describe("user found with matching ACD Id & additional profile", () => {
        test("should be first in the array of matching profiles", () => {
          const tritonUser = {
            sid: "WK123456",
            attributes: {
              email: "Roy.Anderson@libertymutual.com",
              n_number: ""
            }
          };
          const result = findMatchingQmProfiles(tritonUser, users, mockSetForm);
          expect(result[0]).toBe(users[1]);
        });
      });
      describe("user found with duplicate email", () => {
        test("should return in matching profiles array", () => {
          const tritonUser = {
            sid: "WK123456",
            attributes: {
              email: "Roy.Anderson@libertymutual.com",
              n_number: ""
            }
          };
          const result = findMatchingQmProfiles(tritonUser, users, mockSetForm);
          expect(result.length).toBe(2);
          expect(result).toStrictEqual([users[1], users[0]]);
        });
      });
      describe("user found with duplicate ad Login", () => {
        test("should return in matching profiles array", () => {
          const tritonUser = {
            sid: "WK994832",
            attributes: {
              email: "",
              n_number: "n3582215"
            }
          };
          const result = findMatchingQmProfiles(tritonUser, users, mockSetForm);
          expect(result.length).toBe(1);
          expect(result).toStrictEqual([users[1]]);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: "SET_DISCREPANCIES",
            payload: {
              type: "Calabrio QM",
              message: "Calabrio QM Record found for user where the ACD ID does not match the Triton Worker. This will require manual review/correction. Search Calabrio for a record (active or inactive) where the ACD equals wk994832, make that the primary user and deactivate all other users."
            }
          });
        });
      });
      describe("no Acd Id was passed through", () => {
        test("should set no Triton User discrepency", () => {
          const tritonUser = {
            sid: "",
            attributes: {
              email: "",
              n_number: "n3582215"
            }
          };
          const result = findMatchingQmProfiles(tritonUser, users, mockSetForm);
          expect(result.length).toBe(1);
          expect(result).toStrictEqual([users[1]]);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: "SET_DISCREPANCIES",
            payload: {
              type: "Calabrio QM",
              message: "Triton Worker Record not found but is required for Calabrio QM. This will require manual review/correction."
            }
          });
        });
      })
    });
    describe("form.nNumber is passed through", () => {
      test("should set no Triton User discrepency", () => {
        const nNumber = {
          nNumberFetchedUser: {
            email: ""
          },
          value: "n3582215"
        };
        const result = findMatchingQmProfiles(nNumber, users, mockSetForm);
        expect(result.length).toBe(1);
        expect(result).toStrictEqual([users[1]]);
        expect(mockSetForm).toHaveBeenCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "SET_DISCREPANCIES",
          payload: {
            type: "Calabrio QM",
            message: "Triton Worker Record not found but is required for Calabrio QM. This will require manual review/correction."
          }
        });
      });
    });
  });
  describe("getCalabrioWfmOptions", () => {
    test("getWFMOptions succeeds, decompress succeeds, dispatches and returns true", async () => {
      const data = Buffer.from(JSON.stringify({ businessUnits: [{ Id: "123" }, { Id: "456" }] }));
      getWfmOptions.mockResolvedValueOnce({ data: { organization: "eJyrVkoqLc7MSy0uDs3LLClWsoquVvJMUbJSMjQyVqrVgXJMTM2UamNrAVp8Dd0=" } });

      zlib.inflate.mockImplementationOnce((buffer, callback) => {
        callback(null, data);
      });
      const result = await getCalabrioWfmOptions(mockDispatch);
      expect(getWfmOptions).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenLastCalledWith({
        type: "loadWfmOptions",
        payload: [{ Id: "123" }, { Id: "456" }]
      });
      expect(result).toBe(true);
    });
    test("getWFMOptions succeeds, decompress has an error, does not dispatch, returns false", async () => {
      getWfmOptions.mockResolvedValueOnce({ data: { organization: "eJyrVkoqLc7MSy0uDs3LLClWsoquVvJMUbJSMjQyVqrVgXJMTM2UamNrAVp8Dd0=" } });
      zlib.inflate.mockImplementationOnce(() => {
        throw new Error("boo");
      });
      const result = await getCalabrioWfmOptions(mockDispatch);
      expect(getWfmOptions).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
      expect(result).toBe(false);
    });
    test("getWFMOptions call fails, does not dispatch, returns false", async () => {
      getWfmOptions.mockRejectedValueOnce({
        response: {
          data: "boo",
          status: 500
        }
      });
      const result = await getCalabrioWfmOptions(mockDispatch);
      expect(getWfmOptions).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
      expect(result).toBe(false);
    });
  });
  describe("getCalabrioWfmOrg", () => {
    test("BU already exists in the state - should return", async () => {
      await getCalabrioWfmOrg("123-321", initialTestState, mockDispatch);
      expect(getWfmOrg).toHaveBeenCalledTimes(0);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
    });
    test("getWfmOrg succeeds, decompress succeeds, dispatches and returns true", async () => {
      const newBU = {
        Id: "newid",
        Teams: [{
          Id: "new team",
          BusinessUnitId: "newid"
        }]
      }
      getWfmOrg.mockResolvedValueOnce({
        data: newBU,
        errors: []
      });

      const result = await getCalabrioWfmOrg("newid", {
        ...initialTestState,
        calabrioContext: {
          ...initialTestState.calabrioContext,
          wfmOrg: [
            ...initialTestState.calabrioContext.wfmOrg,
            {
              Id: "newid"
            }
          ]
        }
      }, mockDispatch);
      expect(getWfmOrg).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenLastCalledWith({
        type: "updateWfmOrg",
        payload: {
          org: [...initialTestState.calabrioContext.wfmOrg, newBU],
          errors: []
        }
      });
      expect(result).toStrictEqual({
        ...initialTestState,
        calabrioContext: {
          ...initialTestState.calabrioContext,
          wfmOrg: [...initialTestState.calabrioContext.wfmOrg, newBU]
        }
      });
    });
    test("getWfmOrg call fails, does not dispatch, returns false", async () => {
      getWfmOrg.mockRejectedValueOnce({
        response: {
          data: "boo",
          status: 500
        }
      });
      try {
        await getCalabrioWfmOrg("", initialTestState, mockDispatch);
      } catch (err) {
        expect(getWfmOrg).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(err).toStrictEqual({ response: { "data": "boo", "status": 500 } });
      }
    });
  });
});