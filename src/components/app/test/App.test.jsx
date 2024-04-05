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
  useAdminDispatch,
  useAdminState
} from "context";
import {
  apiPaths,
  timeouts
} from "globals";
import React from "react";
import {
  act,
  adGroupPermissionMapping,
  expectMockedComponent,
  expectOnlyPassedProps,
  mockRunTritonStartup,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { myAxios } from "utils";

jest.useFakeTimers();

const authEndpoint = apiPaths.AUTH;
const axiosMock = new MockAdapter(myAxios);

const auth = {
  nNumber: "n1234567",
  profileId: 10,
  isAdmin: false,
  accessToken: "jasdkjfahk"
};

delete window.location;
window.location = { reload: jest.fn() };
document.getElementById = jest.fn();


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
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("utils", () => ({
  myAxios: jest.requireActual("utils").myAxios,
  wait: jest.requireActual("utils").wait,
  isErrorIn400s: jest.requireActual("utils").isErrorIn400s,
  logger: jest.requireActual("utils").logger
}));

const mockAdminDispatch = jest.fn();
const mockHome = jest.fn();
const permissions = [adGroupPermissionMapping[0]];

describe("<App />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    document.getElementById.mockReturnValue({ scrollTo: jest.fn() });
    useAdminState.mockReturnValue({});
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    axiosMock.onGet(authEndpoint).reply(200, auth);
    mockRunTritonStartup.mockResolvedValue("Things went well!");
    setupMockedComponents({
      CircularProgress,
      Header,
      Modal,
      NavTabs,
      NotificationModal
    });
  });

  describe("authenticationAndStartup is successful", () => {
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
            expect(mockRunTritonStartup).toHaveBeenCalledTimes(1);
            expect(mockRunTritonStartup).toHaveBeenCalledWith(mockAdminDispatch);
            expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
            expect(mockAdminDispatch).toHaveBeenCalledWith({
              type: "loadUserData",
              payload: {
                permissions
              }
            });
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
        describe("onClose is called for modal", () => {
          test("modal does not close", async () => {
            const rendered = render(<App />);
            await waitFor(() => rendered.getByTestId("app-wrapper"));
            expect(Modal.mock.calls.length).toBe(1);
            await act(() => jest.advanceTimersByTime(timeouts.AUTH));
            expect(Modal.mock.calls.length).toBe(2);
            expectOnlyPassedProps(Modal, {
              open: true
            });
            // testing handleClose for code coverage
            const handleClose = Modal.mock.calls[0][0].onClose;
            act(() => handleClose());
            expect(Modal.mock.calls.length).toBe(2);
            expect(Modal.mock.calls[1][0].open).toBe(true);
          });
        });
      });
    });
  });

  describe("authenticationAndStartup fails", () => {
    describe("startup file fails", () => {
      const statusCode = 500;
      beforeEach(() => {
        mockRunTritonStartup.mockRejectedValue({
          response: {
            status: statusCode
          }
        });
      });
      test("should throw error up the stack", done => {
        const rendered = render(<App />);
        waitFor(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("An error occurred on startup");
            done();
          });
      });
    });
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