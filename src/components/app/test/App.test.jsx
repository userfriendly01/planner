import { CircularProgress } from "@material-ui/core";
import MockAdapter from "axios-mock-adapter";
import {
  Header,
  NavTabs,
  NotificationModal
} from "components";
import { apiPaths } from "globals";
import React from "react";
import {
  expectMockedComponent,
  mockStore,
  render,
  setupMockedComponents,
  waitForElement
} from "testUtils";
import {
  formatTaskRouterSkills,
  formatWorkerResponse,
  getUniqueManagerList,
  myAxios
} from "utils";
import App from "../App";

jest.useFakeTimers();

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

const workers = [
  {
    sid: "WK1",
    attributes: "wow",
    friendlyName: "n0123456"
  },
  {
    sid: "WK2",
    attributes: "neat",
    friendlyName: "n1234567"
  },
  {
    sid: "WK3",
    attributes: "stellar",
    friendlyName: "n2345678"
  }
];

const taskrouterSkills = [
  {
    multivale: false,
    minimum: 0,
    maximum: 1,
    name: "wow"
  },
  {
    multivale: true,
    minimum: 2,
    maximum: 99,
    name: "neat"
  }
];

jest.mock("@material-ui/core", () => ({
  CircularProgress: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Header: jest.fn(),
  NavTabs: jest.fn(),
  NotificationModal: jest.fn()
}));

describe("<App />", () => {
  beforeEach(() => {
    mockStore.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      CircularProgress,
      Header,
      NavTabs,
      NotificationModal
    });
  });
  describe("all service calls successful", () => {
    beforeEach(() => {
      axiosMock.onGet(authEndpoint).reply(200, auth);
      axiosMock.onGet(profilesEndpoint).reply(200, profiles);
      axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
      axiosMock.onPost(workersEndpoint).replyOnce(200, { instances: workers });
    });
    describe("initial state, page is loading", () => {
      test("should render LoadingMessage", () => {
        const rendered = render(<App />);
        expect(rendered.container).toHaveTextContent("Loading...");
        expectMockedComponent(rendered, { CircularProgress });
      });
    });
    describe("once service call is completed", () => {
      describe("auth token is good", () => {
        test("should render Header & NavTabs and dispatch appropriate actions", done => {
          const rendered = render(<App />);
          waitForElement(() => rendered.getByTestId("app-wrapper"))
            .then(() => {
              const actions = mockStore.getActions();
              expect(actions.length).toBe(5);
              expect(actions).toEqual([
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
                  payload: formatWorkerResponse(workers)
                },
                {
                  type: "loadManagers",
                  payload: getUniqueManagerList(formatWorkerResponse(workers))
                }
              ]);
              expectMockedComponent(rendered, { Header });
              expectMockedComponent(rendered, { NavTabs });
              expectMockedComponent(rendered, { NotificationModal }, 0);
              expect(rendered.container).not.toHaveTextContent("Loading...");
              done();
            });
        });
      });
      // describe("auth token has expired", () => {
      //   act(() => jest.runAllTimers());
      // });
    });
  });
  describe(authEndpoint, () => {
    describe("authentication service call returned an error in the 400's", () => {
      const statusCode = 403;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(statusCode, { ohno: "booo" });
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onPost(workersEndpoint).replyOnce(200, workers);
      });
      test("should return 'You are not authorized to view this page'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
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
        axiosMock.onPost(workersEndpoint).replyOnce(200, workers);
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
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
        axiosMock.onPost(workersEndpoint).replyOnce(200, workers);
      });
      test("should render error message 'Failed to fetch profiles from service'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("Failed to fetch profiles from service");
            done();
          });
      });
    });
  });

  describe(workersEndpoint, () => {
    describe("nextPageUrl exists in the first response but not the second", () => {
      const firstPageOfWorkers = workers.slice(0, 2);
      const secondPageOfWorkers = workers.slice(2);
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, auth);
        axiosMock.onGet(profilesEndpoint).reply(200, profiles);
        axiosMock.onGet(skillsEndpoint).reply(200, taskrouterSkills);
        axiosMock.onPost(workersEndpoint, { pageToken: "" }).replyOnce(200, {
          nextPageUrl: "http://someurl.com/path?PageToken=sometoken",
          instances: firstPageOfWorkers
        });
        axiosMock.onPost(workersEndpoint, { pageToken: "sometoken" }).replyOnce(200, {
          instances: secondPageOfWorkers
        });
      });
      test("should dispatch addWorkers twice, all other actions once", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("app-wrapper"))
          .then(() => {
            const actions = mockStore.getActions();
            expect(actions.length).toBe(6);
            expect(actions).toEqual([
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
                payload: formatWorkerResponse(firstPageOfWorkers)
              },
              {
                type: "addWorkers",
                payload: formatWorkerResponse(secondPageOfWorkers)
              },
              {
                type: "loadManagers",
                payload: getUniqueManagerList(formatWorkerResponse(workers))
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
        axiosMock.onPost(workersEndpoint).replyOnce(500, { boo: "wahhh" });
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
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
        axiosMock.onPost(workersEndpoint).replyOnce(200, workers);
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("Failed to fetch taskrouter skills from service");
            done();
          });
      });
    });
  });
});
