import { useMsal } from "@azure/msal-react";
import App from "../App";
import {
  CircularProgress,
  Modal
} from "@mui/material";
import {
  Header,
  NavTabs,
  NotificationModal
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
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
import { getWorkerProfileId } from "authentication/authUtils";
import { getFilteredPermissions } from "authentication/authenticationProfiles";


delete window.location;
window.location = { reload: jest.fn() };
document.getElementById = jest.fn();
jest.useFakeTimers();

jest.mock("@mui/material", () => ({
  CircularProgress: jest.fn(),
  Modal: jest.fn()
}));

jest.mock("authentication/authUtils", () => ({
  getWorkerProfileId: jest.fn()
}));

jest.mock("authentication/authenticationProfiles", () => ({
  getFilteredPermissions: jest.fn()
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

jest.mock("@azure/msal-react");

jest.mock("utils", () => ({
  wait: jest.requireActual("utils").wait,
  logger: jest.requireActual("utils").logger
}));

const mockAdminDispatch = jest.fn();
const permissions = [adGroupPermissionMapping[0]];

describe("<App />", () => {
  let acquireTokenPopupFunc;

  beforeEach(() => {
    jest.resetAllMocks();
    document.getElementById.mockReturnValue({ scrollTo: jest.fn() });
    useAdminState.mockReturnValue({
      userContext: {
        permissions: [],
        accessToken: ""
      },
      workerContext: {
        workers: []
      }
    });
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    mockRunTritonStartup.mockResolvedValue("Things went well!");
    setupMockedComponents({
      CircularProgress,
      Header,
      Modal,
      NavTabs,
      NotificationModal
    });

    getFilteredPermissions.mockReturnValue(permissions);
    getWorkerProfileId.mockReturnValue(0);

    acquireTokenPopupFunc = jest.fn().mockReturnValue({
      accessToken: "Access Token",
      expiresOn: new Date()
    });

    useMsal.mockReturnValue({
      instance: {
        getActiveAccount: jest.fn().mockReturnValue({
          idTokenClaims: {
            roles: ["Admin"],
            employeeid: "n1234567"
          }
        }),
        acquireTokenPopup: acquireTokenPopupFunc
      }
    });
  });

  describe("initial state, page is loading", () => {
    test("should render LoadingMessage", () => {
      const rendered = render(<App />);
      expect(rendered.container).toHaveTextContent("Loading...");
      expectMockedComponent(rendered, { CircularProgress });
    });

    test("should call to acquireTokenPopup and get a token", async () => {
      render(<App />);

      await waitFor(() => {
        expect(acquireTokenPopupFunc).toHaveBeenCalled();

        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "loadUserData",
          payload: {
            accessToken: "Access Token"
          }
        });
      });
    });
  });

  describe("authentication is successful and we have an account object", () => {
    beforeEach(() => {
      useAdminState.mockReturnValue({
        userContext: {
          permissions: [],
          accessToken: "Access Token"
        },
        workerContext: {
          workers: []
        }
      });

      Date.now = jest.fn();
      Date.now.mockReturnValue(1704067200000);
      getWorkerProfileId.mockResolvedValue(0);
      useMsal.mockReturnValue({
        instance: {
          getActiveAccount: jest.fn().mockReturnValue({
            idTokenClaims: {
              roles: ["Admin"],
              employeeid: "n1234567"
            }
          }),
          acquireTokenPopup: jest.fn().mockReturnValue({
            accessToken: "Access Token",
            expiresOn: new Date(1704067201000)
          })
        }
      });
    });

    test("should render Header & NavTabs, should dispatch appropriate actions, Modal should not be open", async () => {
      const rendered = render(<App />);
      await waitFor(() => rendered.getByTestId("app-wrapper"));
      expectMockedComponent(rendered, { Header });
      expectMockedComponent(rendered, { NavTabs });
      expectMockedComponent(rendered, { CircularProgress }, 0);
      expect(rendered.container).not.toHaveTextContent("Loading...");
      expect(mockRunTritonStartup).toHaveBeenCalledTimes(1);
      expect(mockRunTritonStartup).toHaveBeenCalledWith(mockAdminDispatch);
      expect(mockAdminDispatch).toHaveBeenCalledTimes(2);
      expect(mockAdminDispatch).toHaveBeenCalledWith({
        type: "loadUserData",
        payload: {
          permissions,
          isAdmin: true,
          nNumber: "n1234567",
          profileId: 0
        }
      });
      expect(mockAdminDispatch).toHaveBeenCalledWith({
        type: "loadUserData",
        payload: {
          accessToken: "Access Token"
        }
      });
    });
  });

  describe("application is set into error state", () => {
    test("User has no permissions", async () => {
      useAdminState.mockReturnValue({
        userContext: {
          accessToken: "Access Token"
        },
        workerContext: {
          workers: []
        }
      });

      getFilteredPermissions.mockReturnValue([]);
      const rendered = render(<App />);
      await waitFor(() => rendered.getByTestId("error-overlay"));

      expect(rendered.container).toHaveTextContent("You are missing required AD Groups to be able to access this application");
      expect(rendered.container).toHaveTextContent("UNAUTHORIZED");
    });

    test("Startup fails to run", async () => {
      useAdminState.mockReturnValue({
        userContext: {
          accessToken: "Access Token"
        },
        workerContext: {
          workers: []
        }
      });

      getFilteredPermissions.mockReturnValue([{
        startup: {
          function: mockRunTritonStartup
        }
      }]);
      mockRunTritonStartup.mockRejectedValue({
        response: {
          msg: "Something went wrong",
          data: { woah: "an error" },
          status: 401
        }
      });

      const rendered = render(<App />);
      await waitFor(() => rendered.getByTestId("error-overlay"));

      expect(rendered.container).toHaveTextContent("Something went wrong");
      expect(rendered.container).toHaveTextContent(401);
    });

    test("acquireTokenPopup throws an error", async () => {
      acquireTokenPopupFunc.mockRejectedValue({
        errorMessage: "Popup went wrong",
        errorCode: 401
      });

      const rendered = render(<App />);
      await waitFor(() => rendered.getByTestId("error-overlay"));

      expect(rendered.container).toHaveTextContent("Failed to get a token from Azure, try refreshing the page");
      expect(rendered.container).toHaveTextContent("Popup went wrong");
      expect(rendered.container).toHaveTextContent(401);
    });
  });

  describe("token refresh modal", () => {
    acquireTokenPopupFunc = jest.fn();

    beforeEach(() => {
      useAdminState.mockReturnValue({
        userContext: {
          permissions: [],
          accessToken: "Access Token"
        },
        workerContext: {
          workers: []
        }
      });

      Date.now = jest.fn();
      Date.now.mockReturnValue(1704067200000);
      acquireTokenPopupFunc.mockReturnValue({
        accessToken: "Access Token",
        expiresOn: new Date(1704067201000)
      });
    });

    test("should show modal when token expires", async () => {
      useMsal.mockReturnValue({
        instance: {
          getActiveAccount: jest.fn().mockReturnValue({
            idTokenClaims: {
              roles: ["Admin"],
              employeeid: "n1234567"
            }
          }),
          acquireTokenPopup: acquireTokenPopupFunc
        }
      });

      const rendered = render(<App />);

      await waitFor(() => {
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "loadUserData",
          payload: {
            accessToken: "Access Token"
          }
        });
      });

      await waitFor(() => rendered.getByTestId("app-wrapper"));

      jest.advanceTimersByTime(5000);

      const modalChildren = Modal.mock.calls[0][0].children;
      const modalChildrenRendered = render(<div>{modalChildren}</div>);
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