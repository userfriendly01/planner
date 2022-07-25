import {
  formatCalabrioTeams,
  formatCalabrioGroups,
  // checkConflictingUsers,
  checkDuplicateRecords
} from "utils";
import {
  getCalabrioUser,
  updateCalabrioUser
} from "../../services/calabrio";
import {
  searchByOptions
} from "../../components/usermanagement/CallRecording/CallRecording.Interfaces";

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
  describe("checkDuplicateRecords", () => {
    const user = {
      acdId: "WK123456789",
      email: "faith.cuneo@libertymutual.com",
      firstName: "Faith",
      lastName: "Cuneo",
      adLogin: "LM\n0260000",
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
    describe("user is null", () => {
      test("Should return no conflict", async () => {
        const result = await checkDuplicateRecords(null, users);
        const expectedResult = {
          conflictFound: false
        };
        expect(result).toStrictEqual(expectedResult);
      });
    });
    describe("user is not null", () => {
      describe("user is found with email", () => {
        describe("acdId is the same", () => {
          const testUser = {
            ...user
          };
          test("should return no conflict", async () => {
            const result = await checkDuplicateRecords(testUser, users);
            const expectedResult = {
              conflictFound: false
            };
            expect(result).toStrictEqual(expectedResult);
          });
        });
        describe("acdId is not the same", () => {
          const testUser = {
            ...user,
            acdId: "not the same as the new user"
          };
          test("should return conflict scenario 3", async () => {
            const expectedResult = {
              conflictFound: true,
              duplicateUser: users[0],
              scenario: 3,
              searchBy: searchByOptions.NAME
            };
            try{
              await checkDuplicateRecords(testUser, users);
            } catch(err){
              expect(err).toStrictEqual(expectedResult);
            }
          });
        });
      });
      describe("user is found with adLogin", () => {
        describe("acdId is the same", () => {
          const testUser = {
            ...user,
            email: "not the same"
          };
          test("should return no conflict", async () => {
            const result = await checkDuplicateRecords(testUser, users);
            const expectedResult = {
              conflictFound: false
            };
            expect(result).toStrictEqual(expectedResult);
          });
        });
        describe("acdId is not the same", () => {
          describe("duplicate user first name is missing", () => {
            const testUser = {
              ...user,
              acdId: "not the same",
              email: "not the same",
              adLogin: users[2].adLogin
            };
            test("should return conflict scenario 4 with searchBy as N_NUMBER", async () => {
              const expectedResult = {
                conflictFound: true,
                duplicateUser: users[2],
                scenario: 4,
                searchBy: searchByOptions.N_NUMBER
              };
              try{
                await checkDuplicateRecords(testUser, users);
              } catch(err){
                expect(err).toStrictEqual(expectedResult);
              }
            });
          });
          describe("duplicate user last name is missing", () => {
            const testUser = {
              ...user,
              acdId: "not the same",
              email: "not the same",
              adLogin: users[1].adLogin
            };
            test("should return conflict scenario 4 with searchBy as N_NUMBER", async () => {
              const expectedResult = {
                conflictFound: true,
                duplicateUser: users[1],
                scenario: 4,
                searchBy: searchByOptions.N_NUMBER
              };
              try{
                await checkDuplicateRecords(testUser, users);
              } catch(err){
                expect(err).toStrictEqual(expectedResult);
              }
            });
          });
          describe("duplicate user first and last names are missing", () => {
            const testUser = {
              ...user,
              acdId: "not the same",
              email: "not the same",
              adLogin: users[3].adLogin
            };
            test("should return conflict scenario 4 with searchBy as N_NUMBER", async () => {
              const expectedResult = {
                conflictFound: true,
                duplicateUser: users[3],
                scenario: 4,
                searchBy: searchByOptions.NAME
              };
              try{
                await checkDuplicateRecords(testUser, users);
              } catch(err){
                expect(err).toStrictEqual(expectedResult);
              }
            });
          });
          describe("duplicate first and last names are present", () => {
            const testUser = {
              ...user,
              acdId: "not the same",
              email: "not the same",
              adLogin: users[4].adLogin
            };
            test("should return conflict scenario 4 with searchBy as N_NUMBER", async () => {
              const expectedResult = {
                conflictFound: true,
                duplicateUser: users[4],
                scenario: 4,
                searchBy: searchByOptions.N_NUMBER
              };
              try{
                await checkDuplicateRecords(testUser, users);
              } catch(err){
                expect(err).toStrictEqual(expectedResult);
              }
            });
          });
        });
      });
    });
  });
});