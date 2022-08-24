require("jest-dom/extend-expect");
require("jest-styled-components");

const { mockStore } = require("./__test__/testUtils");

beforeEach(() => {
  mockStore.reset();
});

beforeAll(() => {
  // console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

/* Services are mocked at a global level.
We did this because of a WEIRD glitch where the utils folder cant mock files within the project.
If you need to use the real file in your test, use jest.requireActual for the function you need like below

    jest.mock("services", () => ({
      FetchUserResponse: jest.requireActual("services").FetchUserResponse
    }));

*/

jest.mock("services", () => ({
  createCalabrioUser: jest.fn(),
  createCalabrioTeam: jest.fn(),
  deleteManager: jest.fn(),
  updateCalabrioUser: jest.fn(),
  getCalabrioUsers: jest.fn(),
  getCalabrioOrg: jest.fn(),
  getCalabrioRoles: jest.fn(),
  getCalabrioUser: jest.fn(),
  checkExtension: jest.fn(),
  createUser: jest.fn(),
  deleteUser: jest.fn(),
  deleteDirectory: jest.fn(),
  insertDirectory: jest.fn(),
  updateDirectory: jest.fn(),
  fetchUser: jest.fn(),
  addManager: jest.fn(),
  editManager: jest.fn(),
  getManagers: jest.fn(),
  addOffice: jest.fn(),
  getOffices: jest.fn(),
  updateUser: jest.fn()
}));