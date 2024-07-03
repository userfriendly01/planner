import { runTritonAdminStartup } from "../cct-triton-admin-startup";
import MockAdapter from "axios-mock-adapter";
import { useAdminDispatch } from "context/appContext";
import { apiPaths } from "globals";
import { getStartupProfiles } from "authentication/authenticationProfiles";
import {
  getWfmBusinessUnits,
  getCalabrioUsers,
  getCalabrioRoles,
  getCalabrioOrg
} from "services/calabrio";
import { listUMManagers } from "services/manager";
import { listUMUsers } from "services/user";
import { loadConsolidatedSkills } from "services/skill";
import {
  myAxios
} from "utils/myAxios";
import {
  getCalabrioWfmOptions
} from "utils/calabrioUtils";
import { startups } from "testUtils";

jest.mock("utils/calabrioUtils", () => ({
  getCalabrioWfmOptions: jest.fn(),
  getCalabrioWfmOrg: jest.fn()
}));

jest.mock("authentication/authenticationProfiles", () => ({
  getStartupProfiles: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminDispatch: jest.fn()
}));

jest.mock("services/calabrio", () => ({
  getWfmBusinessUnits: jest.fn(),
  getCalabrioUsers: jest.fn(),
  getCalabrioRoles: jest.fn(),
  getCalabrioOrg: jest.fn()
}));

jest.mock("services/manager", () => ({
  listUMManagers: jest.fn()
}));

jest.mock("services/user", () => ({
  listUMUsers: jest.fn()
}));

jest.mock("services/profile", () => ({
  listUMSoftphoneConfigs: jest.fn()
}));
jest.mock("services/skill", () => ({
  loadConsolidatedSkills: jest.fn()
}));


const axiosMock = new MockAdapter(myAxios);
const profilesEndpoint = apiPaths.PROFILES;
const skillsEndpoint = apiPaths.GET_SKILLS;
const calabrioUsersEndpoint = apiPaths.GET_CALABRIO_USERS;
const calabrioOrgEndpoint = apiPaths.getCalabrioOrg;
const calabrioRolesEndpoint = apiPaths.getCalabrioRoles;

const profiles = [
  { cool: "neat" },
  { wow: "amazing" }
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
    listUMUsers.mockResolvedValue();
    listUMManagers.mockResolvedValue();
    loadConsolidatedSkills.mockResolvedValue();
  });

  describe("runTritonAdminStartup", () => {
    beforeEach(() => {
      axiosMock.onGet(profilesEndpoint).reply(200, profiles);
      axiosMock.onGet(skillsEndpoint).reply(200, skills);
      getCalabrioUsers.mockResolvedValue({ data: []});
      getCalabrioOrg.mockResolvedValue({ data: []});
      getCalabrioRoles.mockResolvedValue({ data: []});
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
      test("**MUST RETURN STARTUP NAME FIRST**", async () => {
        const result = await runTritonAdminStartup(mockAdminDispatch);
        const firstResponse = result[0];
        expect(firstResponse).toStrictEqual(startups.TRITON.name);
      });
      describe("auth token is good (page loaded less than one hour ago)", () => {
        test(
          "should render Header & NavTabs, should dispatch appropriate actions, Modal should not be open",
          async () => {
            await runTritonAdminStartup(mockAdminDispatch);
            expect(mockAdminDispatch).toHaveBeenCalledTimes(4);
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
            listUMManagers.mockRejectedValue(error);
          });
          test("should return 'An error occurred while logging in.'", async () => {
            try {
              await runTritonAdminStartup(mockAdminDispatch);
            } catch (err) {
              expect(err).toBe(error);
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
            expect(mockAdminDispatch).toHaveBeenCalledTimes(3);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioOrg",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioRoles",
              payload: []
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
            expect(mockAdminDispatch).toHaveBeenCalledTimes(3);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioUsers",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioRoles",
              payload: []
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
            expect(mockAdminDispatch).toHaveBeenCalledTimes(3);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioUsers",
              payload: []
            });
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadCalabrioOrg",
              payload: []
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
            expect(mockAdminDispatch).toHaveBeenCalledTimes(4);
            expect(getCalabrioWfmOptions).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});