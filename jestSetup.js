require("@testing-library/jest-dom/extend-expect");
require("jest-styled-components");

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

jest.mock("authentication");

/* Services are mocked at a global level.
We did this because of a WEIRD glitch where the utils folder cant mock files within the project.
If you need to use the real file in your test, use jest.requireActual for the function you need like below

    jest.mock("services", () => ({
      FetchUserResponse: jest.requireActual("services").FetchUserResponse
    }));

*/

jest.mock("services", () => ({
  addFlowRule: jest.fn(),
  addManager: jest.fn(),
  addRoutingRule: jest.fn(),
  addOffice: jest.fn(),
  addSkillGroup: jest.fn(),
  addSkillGroupSkill: jest.fn(),
  checkExtension: jest.fn(),
  createCalabrioTeam: jest.fn(),
  createCalabrioUser: jest.fn(),
  createProfile: jest.fn(),
  createSkill: jest.fn(),
  createUser: jest.fn(),
  createCalabrioWFMPerson: jest.fn(),
  deleteDirectory: jest.fn(),
  deleteFlowRule: jest.fn(),
  deleteManager: jest.fn(),
  deleteRoutingRule: jest.fn(),
  deleteSkillGroup: jest.fn(),
  deleteUser: jest.fn(),
  editManager: jest.fn(),
  fetchUser: jest.fn(),
  getAggregateQueuesType: jest.fn(),
  getApplications: jest.fn(),
  getCalabrioOrg: jest.fn(),
  getCalabrioRoles: jest.fn(),
  getCalabrioUser: jest.fn(),
  getCalabrioUsers: jest.fn(),
  getOffices: jest.fn(),
  getManagers: jest.fn(),
  getTaskQueues: jest.fn(),
  getTfn: jest.fn(),
  getTimeOfDays: jest.fn(),
  getWfmOrg: jest.fn(),
  getWfmOptions: jest.fn(),
  insertDirectory: jest.fn(),
  queryFlowData: jest.fn(),
  queryRoutingData: jest.fn(),
  retrieveFlowData: jest.fn(),
  retrieveRoutingData: jest.fn(),
  updateCalabrioUser: jest.fn(),
  updateClosedMessage: jest.fn(),
  updateDirectory: jest.fn(),
  updateFlowDB: jest.fn(),
  updateFlashMessage: jest.fn(),
  updateRoutingDB: jest.fn(),
  updateSkillGroup: jest.fn(),
  updateTfn: jest.fn(),
  updateUser: jest.fn(),
  getCallTagOptions: jest.fn(),
  getCallTags: jest.fn(),
  getOperatingUnits: jest.fn(),
  getAccessGroup: jest.fn(),
  wfmActivateExternalLogon: jest.fn()
}));