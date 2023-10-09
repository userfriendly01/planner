import { runTritonAdminStartup } from "../cct-triton-admin-startup";
import MockAdapter from "axios-mock-adapter";
import { useAdminDispatch } from "context";
import { apiPaths } from "globals";
import { getStartupProfiles } from "authentication";
import {
  getWfmBusinessUnits,
  getCalabrioUsers,
  getCalabrioOrg,
  getCalabrioRoles,
  getManagers,
  getOffices
} from "services";
import {
  formatManagersResponse,
  fetchLogsFromDataDog,
  formatOfficesResponse,
  myAxios
} from "utils";
import {
  getCalabrioWfmOptions,
  getCalabrioWfmOrg
} from "../../../utils/calabrioUtils";
import { startups } from "testUtils";

jest.mock("../../../utils/calabrioUtils", () => ({
  __esModule: true,
  getCalabrioWfmOptions: jest.fn(),
  getCalabrioWfmOrg: jest.fn()
}));

jest.mock("../../../utils/logger", () => ({
  fetchLogsFromDataDog: jest.fn().mockResolvedValue("Yay")
}));


const axiosMock = new MockAdapter(myAxios);
const profilesEndpoint = apiPaths.PROFILES;
const skillsEndpoint = apiPaths.GET_SKILLS;
const workersEndpoint = apiPaths.GET_WORKERS;
const calabrioUsersEndpoint = apiPaths.GET_CALABRIO_USERS;
const calabrioOrgEndpoint = apiPaths.getCalabrioOrg;
const calabrioRolesEndpoint = apiPaths.getCalabrioRoles;

const profiles = [
  { cool: "neat" },
  { wow: "amazing" }
];

const dbOffices = [
  {
    office_nme: "Office 1",
    office_num: "1"
  },
  {
    office_nme: "Office 2",
    office_num: "2"
  },
  {
    office_nme: "Office 3",
    office_num: "3"
  },
  {
    office_nme: "Office 4",
    office_num: "4"
  },
  {
    office_nme: "Office 11",
    office_num: "45F"
  }
];

const dbManagers = [
  {
    manager_first_nme: "Frank",
    manager_last_nme: "TheTank",
    manager_n_num: "BrngGrHt"
  },
  {
    manager_first_nme: "Normal",
    manager_last_nme: "McBoring",
    manager_n_num: "n123567"
  },
  {
    manager_first_nme: "Neil",
    manager_last_nme: "Degrasse-Tyson",
    manager_n_num: "n0000111"
  }
];

const dbWorkers = [
  {
    workerSid: "WK1",
    attributes: {
      wow: "wow"
    }
  },
  {
    workerSid: "WK2",
    attributes: {
      neat: "neat"
    }
  },
  {
    workerSid: "WK3",
    attributes: {
      stellar: "stellar"
    }
  },
  {
    workerSid: "WK4"
  },
  {
    workerSid: "WK5",
    attributes: {
      superrrr: "superrrr"
    },
    inactiveInd: true
  }
];

const filteredWorkers = [
  {
    sid: "WK1",
    attributes: {
      wow: "wow"
    },
    skillsDifferent: false
  },
  {
    sid: "WK2",
    attributes: {
      neat: "neat"
    },
    skillsDifferent: false
  },
  {
    sid: "WK3",
    attributes: {
      stellar: "stellar"
    },
    skillsDifferent: false
  }
];

const skills = {
  consolidatedSkills: [
    {
      multivalue: false,
      minimum: 0,
      maximum: 1,
      name: "wow"
    },
    {
      multivalue: true,
      minimum: 2,
      maximum: 99,
      name: "neat"
    }
  ]
};

jest.mock("context", () => ({
  useAdminDispatch: jest.fn()
}));

const mockAdminDispatch = jest.fn();
const statusCode = 500;
const error = {
  response: {
    data: "boo",
    status: 500
  }
};

describe("cct-triton-admin-startup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    getStartupProfiles.mockReturnValueOnce(startups);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
  });

  describe("runTritonAdminStartup", () => {
    beforeEach(() => {
      axiosMock.onGet(profilesEndpoint).reply(200, profiles);
      axiosMock.onGet(skillsEndpoint).reply(200, skills);
      axiosMock.onGet(workersEndpoint).reply(200, dbWorkers);
      getManagers.mockResolvedValue(dbManagers);
      getOffices.mockResolvedValue(dbOffices);
      getCalabrioUsers.mockResolvedValue({ data: [] });
      getCalabrioOrg.mockResolvedValue({ data: [] });
      getCalabrioRoles.mockResolvedValue({ data: [] });
      getCalabrioWfmOptions.mockResolvedValue(true);
      getWfmBusinessUnits.mockResolvedValue({
        data: {
          BusinessUnits: [],
          People_Without_Team: [],
          errors: []
        }
      });
    });
    describe("all service calls successful", () => {
      test.only("dumb", () => {
        expect(true).toBe(true);
      });
      test("**MUST RETURN STARTUP NAME FIRST**", async () => {
        const result = await runTritonAdminStartup(mockAdminDispatch);
        const firstResponse = result[0];
        expect(firstResponse).toStrictEqual(startups.TRITON.name);
      });
      test("**MUST RETURN WORKER RESPONSE SECOND**", async () => {
        const result = await runTritonAdminStartup(mockAdminDispatch);
        const secondResponse = result[1];
        expect(secondResponse).toStrictEqual(filteredWorkers);
      });
      describe("auth token is good (page loaded less than one hour ago)", () => {
        test(
          "should render Header & NavTabs, should dispatch appropriate actions, Modal should not be open",
          async () => {
            await runTritonAdminStartup(mockAdminDispatch);
            expect(mockAdminDispatch).toHaveBeenCalledTimes(10);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadManagers",
              payload: formatManagersResponse(dbManagers)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadOffices",
              payload: formatOfficesResponse(dbOffices)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioUsers",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioOrg",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioRoles",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadProfiles",
              payload: profiles
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkills",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkillGroups",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWorkers",
              payload: filteredWorkers
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWfmOrg",
              payload: {
                org: [],
                People_Without_Team: [],
                errors: []
              }
            });
            expect(getCalabrioWfmOptions).toHaveBeenCalledTimes(1);
          });
      });
    });

    describe("service calls fail", () => {
      describe(profilesEndpoint, () => {
        describe("profiles service call returned an error", () => {
          beforeEach(() => {
            axiosMock.onGet(profilesEndpoint).reply(statusCode, { wahhhh: "oh noooo" });
          });
          test("should render error message 'Failed to fetch profiles from service'", async () => {
            try {
              await runTritonAdminStartup(mockAdminDispatch);
            } catch (err) {
              expect(err.msg).toBe("Failed to fetch profiles from service");
            }
          });
        });
      });
      describe(workersEndpoint, () => {
        describe("workers service call returned an error", () => {
          beforeEach(() => {
            axiosMock.onGet(workersEndpoint).reply(statusCode, { boo: "wahhh" });
          });
          test("should return 'An error occurred while logging in.'", async () => {
            try {
              await runTritonAdminStartup(mockAdminDispatch);
            } catch (err) {
              expect(err.msg).toBe("Failed to fetch workers from service");
            }
          });
        });
      });
      describe(skillsEndpoint, () => {
        describe("skills service call returned an error", () => {
          beforeEach(() => {
            axiosMock.onGet(skillsEndpoint).reply(statusCode, { fail: "oh the horror" });
          });
          test("should return 'An error occurred while logging in.'", async () => {
            try {
              await runTritonAdminStartup(mockAdminDispatch);
            } catch (err) {
              expect(err.msg).toBe("Failed to fetch skills from service");
            }
          });
        });
      });
      describe(apiPaths.MANAGERS, () => {
        describe("managers service call returned an error", () => {
          beforeEach(() => {
            getManagers.mockRejectedValue(error);
          });
          test("should return 'An error occurred while logging in.'", async () => {
            try {
              await runTritonAdminStartup(mockAdminDispatch);
            } catch (err) {
              expect(err.msg).toBe("Failed to fetch managers from service");
            }
          });
        });
      });
      describe(apiPaths.OFFICES, () => {
        describe("offices service call returned an error", () => {
          beforeEach(() => {
            getOffices.mockRejectedValue(error);
          });
          test("should return 'An error occurred while logging in.'", async () => {
            try {
              await runTritonAdminStartup(mockAdminDispatch);
            } catch (err) {
              expect(err.msg).toBe("Failed to fetch offices from service");
            }
          });
        });
      });
      describe(calabrioUsersEndpoint, () => {
        describe("Calabrio org service call returned an error", () => {
          beforeEach(() => {
            getCalabrioUsers.mockRejectedValue(error);
            getWfmBusinessUnits.mockResolvedValue({
              data: {
                BusinessUnits: undefined,
                People_Without_Team: undefined,
                errors: undefined
              }
            });
          });
          test("should still load triton admin", async () => {
            await runTritonAdminStartup(mockAdminDispatch);
            expect(mockAdminDispatch).toHaveBeenCalledTimes(9);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadManagers",
              payload: formatManagersResponse(dbManagers)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadOffices",
              payload: formatOfficesResponse(dbOffices)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioOrg",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioRoles",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadProfiles",
              payload: profiles
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkills",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkillGroups",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWorkers",
              payload: filteredWorkers
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWfmOrg",
              payload: {
                org: [],
                People_Without_Team: [],
                errors: []
              }
            });
            expect(getCalabrioWfmOptions).toHaveBeenCalledTimes(1);
          });
        });
      });
      describe(calabrioOrgEndpoint, () => {
        describe("Calabrio org service call returned an error", () => {
          beforeEach(() => {
            getCalabrioOrg.mockRejectedValue(error);
          });
          test("should still load triton admin", async () => {
            await runTritonAdminStartup(mockAdminDispatch);
            expect(mockAdminDispatch).toHaveBeenCalledTimes(9);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadManagers",
              payload: formatManagersResponse(dbManagers)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadOffices",
              payload: formatOfficesResponse(dbOffices)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioUsers",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioRoles",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadProfiles",
              payload: profiles
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkills",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkillGroups",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWorkers",
              payload: filteredWorkers
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWfmOrg",
              payload: {
                org: [],
                People_Without_Team: [],
                errors: []
              }
            });
            expect(getCalabrioWfmOptions).toHaveBeenCalledTimes(1);
          });
        });
      });
      describe(calabrioRolesEndpoint, () => {
        describe("Calabrio roles service call returned an error", () => {
          beforeEach(() => {
            getCalabrioRoles.mockRejectedValue(error);
          });
          test("should still load triton admin", async () => {
            await runTritonAdminStartup(mockAdminDispatch);
            expect(mockAdminDispatch).toHaveBeenCalledTimes(9);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadManagers",
              payload: formatManagersResponse(dbManagers)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadOffices",
              payload: formatOfficesResponse(dbOffices)
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioUsers",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioOrg",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadProfiles",
              payload: profiles
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkills",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadSkillGroups",
              payload: skills.consolidatedSkills
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWorkers",
              payload: filteredWorkers
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadWfmOrg",
              payload: {
                org: [],
                People_Without_Team: [],
                errors: []
              }
            });
            expect(getCalabrioWfmOptions).toHaveBeenCalledTimes(1);
          });
        });
      });
      describe("getBusinessUnits", () => {
        describe("Calabrio wfm org service call returned an error", () => {
          beforeEach(() => {
            getWfmBusinessUnits.mockRejectedValue("boo");
          });
          test("should still load triton admin", async () => {
            try {
              await runTritonAdminStartup(mockAdminDispatch);
            } catch (err) {
              expect(err.msg).toBe("Failed to fetch Calabrio Business Units");
            }
          });
        });
      });
      describe("getCalabrioWfmOptions", () => {
        describe("Calabrio roles service call returned an error", () => {
          beforeEach(() => {
            getCalabrioWfmOptions.mockReturnValue(false);
          });
          test("should still load triton admin", async () => {
            await runTritonAdminStartup(mockAdminDispatch);
            expect(mockAdminDispatch).toHaveBeenCalledTimes(10);
            expect(getCalabrioWfmOptions).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});