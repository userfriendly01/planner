require("@testing-library/jest-dom/extend-expect");
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

jest.mock("authentication");

/* Services are mocked at a global level.
We did this because of a WEIRD glitch where the utils folder cant mock files within the project.
If you need to use the real file in your test, use jest.requireActual for the function you need like below

    jest.mock("services", () => ({
      FetchUserResponse: jest.requireActual("services").FetchUserResponse
    }));

*/

jest.mock("services", () => ({
  addManager: jest.fn(),
  addOffice: jest.fn(),
  checkExtension: jest.fn(),
  createCalabrioTeam: jest.fn(),
  createCalabrioUser: jest.fn(),
  createUser: jest.fn(),
  deleteDirectory: jest.fn(),
  deleteManager: jest.fn(),
  deleteUser: jest.fn(),
  editManager: jest.fn(),
  fetchUser: jest.fn(),
  getCalabrioOrg: jest.fn(),
  getCalabrioRoles: jest.fn(),
  getCalabrioUser: jest.fn(),
  getCalabrioUsers: jest.fn(),
  getOffices: jest.fn(),
  getManagers: jest.fn(),
  insertDirectory: jest.fn(),
  updateCalabrioUser: jest.fn(),
  updateClosedMessage: jest.fn(),
  updateDirectory: jest.fn(),
  updateFlashMessage: jest.fn(),
  updateUser: jest.fn()
}));