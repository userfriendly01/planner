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
  adGroupPermissionMapping,
  expectMockedComponent,
  mockRunTritonStartup,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import {
  getFilteredPermissions, getWorkerProfileId
} from "authentication";
import {
  wait
} from "utils";


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

jest.mock("@azure/msal-react");

jest.useFakeTimers("modern");
// jest.setSystemTime(new Date(1704067200000).getTime(123));
Date.now = jest.fn();
// .mockImplementation(() => ({
//   getTime: jest.fn().mockReturnValue(123)
// }));


jest.mock("utils", () => ({
  myAxios: jest.requireActual("utils").myAxios,
  wait: jest.fn(), //jest.requireActual("utils").wait,
  isErrorIn400s: jest.requireActual("utils").isErrorIn400s,
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
            expiresOn: new Date()
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
          permissions
        }
      });
      expect(mockAdminDispatch).toHaveBeenCalledWith({
        type: "loadUserData",
        payload: {
          accessToken: "Access Token"
        }
      });
    });

    test("should set isAdmin, nNumber, and profileId once workers has loaded", async () => {
      useAdminState.mockReturnValue({
        userContext: {
          permissions: [],
          accessToken: "Access"
        },
        workerContext: {
          workers: [{
            attributes: {
              n_number: "n1234567"
            }
          }]
        }
      });

      const rendered = render(<App />);
      await waitFor(() => rendered.getByTestId("app-wrapper"));

      expect(mockAdminDispatch).toHaveBeenCalledWith({
        type: "loadUserData",
        payload: {
          profileId: 0,
          isAdmin: true,
          nNumber: "n1234567"
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
        errorStatus: 401
      });

      const rendered = render(<App />);
      await waitFor(() => rendered.getByTestId("error-overlay"));

      expect(rendered.container).toHaveTextContent("Popup went wrong");
      expect(rendered.container).toHaveTextContent(401);
    });
  });

  describe("tokenManager refresh", () => {
    acquireTokenPopupFunc = jest.fn();
    beforeEach(() => {
      Date.now.mockReturnValueOnce({
        getTime: jest.fn().mockReturnValue(1704067100000)
      });
      Date.now.mockReturnValue({
        getTime: jest.fn().mockReturnValue(1704067200000)
      });
      acquireTokenPopupFunc.mockReturnValue({
        accessToken: "Access Token",
        expiresOn: new Date("2024-01-01")
      });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("tokenManager should re-call acquireTokenPopup when token expires", async () => {

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

      render(<App />);

      // expect(wait.mock.calls).toBe("butts"); //.toHaveBeenCalled();

      await waitFor(() => {
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "loadUserData",
          payload: {
            accessToken: "Access Token"
          }
        });
      });

      jest.advanceTimersByTime(5000);
      // jest.runAllTimers();

      await waitFor(() => {
        expect(acquireTokenPopupFunc).toHaveBeenCalledTimes(2);
      });
    });
  });
  // Tests for token manager
});