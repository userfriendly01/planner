import App from "../App";
import {
  CircularProgress,
  Modal
} from "@material-ui/core";
import MockAdapter from "axios-mock-adapter";
import {
  Header,
  NavTabs,
  NotificationModal
} from "components";
import {
  apiPaths,
  timeouts
} from "globals";
import React from "react";
import {
  getCalabrioOrg,
  getCalabrioRoles,
  getManagers,
  getOffices
} from "services";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  mockStore,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import {
  formatManagersResponse,
  formatOfficesResponse,
  formatTaskRouterSkills,
  myAxios
} from "utils";

const authEndpoint = apiPaths.AUTH;
const axiosMock = new MockAdapter(myAxios);
const profilesEndpoint = apiPaths.GET_PROFILES;
const skillsEndpoint = apiPaths.GET_TASKROUTER_SKILLS;
const workersEndpoint = apiPaths.GET_WORKERS;

const auth = { whatever: "lol" };

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

const taskrouterSkills = [
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
];

delete window.location;
window.location = { reload: jest.fn() };

jest.useFakeTimers();

jest.mock("@material-ui/core", () => ({
  CircularProgress: jest.fn(),
  Modal: jest.fn()
}));

jest.mock("components", () => ({
  Header: jest.fn(),
  NavTabs: jest.fn(),
  NotificationModal: jest.fn()
}));

jest.mock("services", () => ({
  getManagers: jest.fn(),
  getOffices: jest.fn(),
  getCalabrioRoles: jest.fn(),
  getCalabrioOrg: jest.fn()
}));

describe("<App />", () => {

  beforeEach(() => {
    mockStore.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      CircularProgress,
      Header,
      Modal,
      NavTabs,
      NotificationModal
    });
  });

  describe("all service calls successful", () => {
    beforeEach(() => {
      axiosMock.onGet(authEndpoint).reply(200, auth);
      axiosMock.onGet(profilesEndpoint).reply(200, profiles);
      axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
      axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
      getManagers.mockResolvedValue(dbManagers);
      getOffices.mockResolvedValue(dbOffices);
      getCalabrioOrg.mockResolvedValue({ data: []});
      getCalabrioRoles.mockResolvedValue({ data: []});
    });
    describe("initial state, page is loading", () => {
      test("should render LoadingMessage", () => {
        const rendered = render(<App />);
        expect(rendered.container).toHaveTextContent("Loading...");
        expectMockedComponent(rendered, { CircularProgress });
      });
    });
    describe("service calls are complete", () => {
      describe("auth token is good (page loaded less than one hour ago)", () => {
        test(
          "should render Header & NavTabs, should dispatch appropriate actions, Modal should not be open",
          async () => {
            const rendered = render(<App />);
            await waitFor(() => rendered.getByTestId("app-wrapper"));
            const actions = mockStore.getActions();
            expect(actions.length).toBe(8);
            expect(actions).toEqual([
              {
                type: "loadManagers",
                payload: formatManagersResponse(dbManagers)
              },
              {
                type: "loadOffices",
                payload: formatOfficesResponse(dbOffices)
              },
              {
                type: "loadCalabrioOrg",
                payload: []
              },
              {
                type: "loadCalabrioRoles",
                payload: []
              },
              {
                type: "loadUserData",
                payload: { pingIdentity: auth }
              },
              {
                type: "loadProfiles",
                payload: profiles
              },
              {
                type: "loadSkills",
                payload: formatTaskRouterSkills(taskrouterSkills)
              },
              {
                type: "addWorkers",
                payload: filteredWorkers
              }
            ]);
            expectMockedComponent(rendered, { Header });
            expectMockedComponent(rendered, { NavTabs });
            expectMockedComponent(rendered, { Modal });
            expectOnlyPassedProps(Modal, {
              disableBackdropClick: true,
              open: false
            });
            expectMockedComponent(rendered, { CircularProgress }, 0);
            expect(rendered.container).not.toHaveTextContent("Loading...");
          });
      });
      describe("auth token has expired (page loaded more than one hour ago", () => {
        test("should render NotificationModal", async () => {
          const rendered = render(<App />);
          await waitFor(() => rendered.getByTestId("app-wrapper"));
          const modalChildren = Modal.mock.calls[0][0].children;
          const modalChildrenRendered = render(<div>{modalChildren}</div>);
          await act(() => jest.advanceTimersByTime(timeouts.AUTH));
          expectOnlyPassedProps(Modal, {
            disableBackdropClick: true,
            open: true
          });
          expectMockedComponent(modalChildrenRendered, { NotificationModal });
          expectOnlyPassedProps(NotificationModal, {
            buttonText: "Reload",
            text: "Your session has expired. Please reload the page."
          });
          // testing handleClick for code coverage
          const handleClick = NotificationModal.mock.calls[0][0].handleClick;
          act(() => handleClick());
          expect(window.location.reload).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe(authEndpoint, () => {
    describe("authentication service call returned an error in the 400's", () => {
      const statusCode = 403;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(statusCode, { ohno: "booo" });
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
      });
      test("should return 'You are not authorized to view this page'", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("You are not authorized to view this page");
            done();
          });
      });
    });
    describe("authentication service call returned an error not in the 400's", () => {
      const statusCode = 500;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(statusCode, { wahhh: "nooo" });
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("An error occurred when trying to authenticate");
            done();
          });
      });
    });
  });

  describe(profilesEndpoint, () => {
    describe("profiles service call returned an error", () => {
      const statusCode = 500;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(statusCode, { wahhhh: "oh noooo" });
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
      });
      test("should render error message 'Failed to fetch profiles from service'", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("Failed to fetch profiles from service");
            done();
          });
      });
    });
  });

  describe(workersEndpoint, () => {
    describe("successful worker fetch", () => {
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint, { pageToken: "" }).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
      });
      test("should dispatch all actions and filter workers with inactiveInd: true and no attributes", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("app-wrapper"))
          .then(() => {
            const actions = mockStore.getActions();
            expect(actions.length).toBe(8);
            expect(actions).toEqual([
              {
                type: "loadManagers",
                payload: formatManagersResponse(dbManagers)
              },
              {
                type: "loadOffices",
                payload: formatOfficesResponse(dbOffices)
              },
              {
                type: "loadCalabrioOrg",
                payload: []
              },
              {
                type: "loadCalabrioRoles",
                payload: []
              },
              {
                type: "loadUserData",
                payload: { pingIdentity: auth }
              },
              {
                type: "loadProfiles",
                payload: profiles
              },
              {
                type: "loadSkills",
                payload: formatTaskRouterSkills(taskrouterSkills)
              },
              {
                type: "addWorkers",
                payload: filteredWorkers
              }
            ]);
            expectMockedComponent(rendered, { Header });
            expectMockedComponent(rendered, { NavTabs });
            expect(rendered.container).not.toHaveTextContent("Loading...");
            done();
          });
      });
    });
    describe("workers service call returned an error", () => {
      const statusCode = 500;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(500, { boo: "wahhh" });
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("Failed to fetch workers from service");
            done();
          });
      });
    });
  });

  describe(skillsEndpoint, () => {
    describe("skills service call returned an error", () => {
      const statusCode = 500;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(500, { fail: "oh the horror" });
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("Failed to fetch taskrouter skills from service");
            done();
          });
      });
    });
  });

  describe(apiPaths.MANAGERS, () => {
    describe("managers service call returned an error", () => {
      const error = {
        response: {
          data: "boo",
          status: 500
        }
      };
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockRejectedValue(error);
        getOffices.mockResolvedValue(dbOffices);
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(error.response.status);
            expect(rendered.container).toHaveTextContent(`${error.response.status}Failed to fetch managers from service"${error.response.data}"`);
            done();
          });
      });
    });
  });

  describe(apiPaths.OFFICES, () => {
    describe("offices service call returned an error", () => {
      const error = {
        response: {
          data: "boo",
          status: 500
        }
      };
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockRejectedValue(error);
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(error.response.status);
            expect(rendered.container).toHaveTextContent(`${error.response.status}Failed to fetch offices from service"${error.response.data}"`);
            done();
          });
      });
    });
  });
  describe("Calabrio Org", () => {
    describe("Calabrio org service call returned an error", () => {
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
        getCalabrioOrg.mockRejectedValue("aww");
        getCalabrioRoles.mockResolvedValue({ data: []});
      });
      test("should still load triton admin", async done => {
        const rendered = render(<App />);
        await waitFor(() => rendered.getByTestId("app-wrapper"));
        const actions = mockStore.getActions();
        expect(actions.length).toBe(7);
        expect(actions).toEqual([
          {
            type: "loadManagers",
            payload: formatManagersResponse(dbManagers)
          },
          {
            type: "loadOffices",
            payload: formatOfficesResponse(dbOffices)
          },
          {
            type: "loadCalabrioRoles",
            payload: []
          },
          {
            type: "loadUserData",
            payload: { pingIdentity: auth }
          },
          {
            type: "loadProfiles",
            payload: profiles
          },
          {
            type: "loadSkills",
            payload: formatTaskRouterSkills(taskrouterSkills)
          },
          {
            type: "addWorkers",
            payload: filteredWorkers
          }
        ]);
        expectMockedComponent(rendered, { Header });
        expectMockedComponent(rendered, { NavTabs });
        expectMockedComponent(rendered, { Modal });
        expectOnlyPassedProps(Modal, {
          disableBackdropClick: true,
          open: false
        });
        expectMockedComponent(rendered, { CircularProgress }, 0);
        expect(rendered.container).not.toHaveTextContent("Loading...");
        done();
      });
    });
  });
  describe("Calabrio Roles", () => {
    describe("Calabrio roles service call returned an error", () => {
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onGet(workersEndpoint).replyOnce(200, dbWorkers);
        getManagers.mockResolvedValue(dbManagers);
        getOffices.mockResolvedValue(dbOffices);
        getCalabrioOrg.mockResolvedValue({ data: []});
        getCalabrioRoles.mockRejectedValue("aww");
      });
      test("should still load triton admin", async done => {
        const rendered = render(<App />);
        await waitFor(() => rendered.getByTestId("app-wrapper"));
        const actions = mockStore.getActions();
        expect(actions.length).toBe(7);
        expect(actions).toEqual([
          {
            type: "loadManagers",
            payload: formatManagersResponse(dbManagers)
          },
          {
            type: "loadOffices",
            payload: formatOfficesResponse(dbOffices)
          },
          {
            type: "loadCalabrioOrg",
            payload: []
          },
          {
            type: "loadUserData",
            payload: { pingIdentity: auth }
          },
          {
            type: "loadProfiles",
            payload: profiles
          },
          {
            type: "loadSkills",
            payload: formatTaskRouterSkills(taskrouterSkills)
          },
          {
            type: "addWorkers",
            payload: filteredWorkers
          }
        ]);
        expectMockedComponent(rendered, { Header });
        expectMockedComponent(rendered, { NavTabs });
        expectMockedComponent(rendered, { Modal });
        expectOnlyPassedProps(Modal, {
          disableBackdropClick: true,
          open: false
        });
        expectMockedComponent(rendered, { CircularProgress }, 0);
        expect(rendered.container).not.toHaveTextContent("Loading...");
        done();
      });
    });
  });
});
