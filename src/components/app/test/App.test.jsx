import App from "../App";
import {
  CircularProgress,
  Modal
} from "@mui/material";
import MockAdapter from "axios-mock-adapter";
import {
  Header,
  NavTabs,
  NotificationModal
} from "components";
import {
  useAdminDispatch
} from "context";
import {
  apiPaths,
  timeouts
} from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import {
  getStartups,
  myAxios
} from "utils";

const authEndpoint = apiPaths.AUTH;
const axiosMock = new MockAdapter(myAxios);

const auth = { whatever: "lol" };

delete window.location;
window.location = { reload: jest.fn() };

jest.useFakeTimers();

jest.mock("@mui/material", () => ({
  CircularProgress: jest.fn(),
  Modal: jest.fn()
}));

jest.mock("components", () => ({
  Header: jest.fn(),
  NavTabs: jest.fn(),
  NotificationModal: jest.fn()
}));

jest.mock("context", () => ({
  useAdminDispatch: jest.fn()
}));

jest.mock("utils", () => ({
  getAuthenticationProfiles: jest.fn(),
  getPermissions: jest.fn(),
  getStartups: jest.fn(),
  myAxios: jest.requireActual("utils").myAxios,
  wait: jest.requireActual("utils").wait,
  isErrorIn400s: jest.requireActual("utils").isErrorIn400s
}));

const mockAdminDispatch = jest.fn();

describe("<App />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    axiosMock.onGet(authEndpoint).reply(200, auth);
    getStartups.mockReturnValue([]);
    setupMockedComponents({
      CircularProgress,
      Header,
      Modal,
      NavTabs,
      NotificationModal
    });
  });

  describe("authenticationAndStartup are successful", () => {
    beforeEach(() => {
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
            expectMockedComponent(rendered, { Header });
            expectMockedComponent(rendered, { NavTabs });
            expectMockedComponent(rendered, { Modal });
            expectOnlyPassedProps(Modal, {
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
});