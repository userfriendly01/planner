import {
  authWrapper, PERMISSIONS
} from "../Auth";
import { LoginInProgress } from "../LoginInProgress";
import { LoginError } from "../LoginError";
import React from "react";
import {
  render,
  initialTestState
} from "testUtils";

jest.mock("../LoginInProgress", () => ({
  __esModule: true,
  LoginInProgress: jest.fn()
}));

jest.mock("../LoginError", () => ({
  __esModule: true,
  LoginError: jest.fn()
}));

const xhrMockClass = () => ({
  open: jest.fn(),
  send: jest.fn().mockReturnValue({
    value: [
      {
        displayName: PERMISSIONS.READ_GROUP_FLOW
      }
    ]
  }),
  setRequestHeader: jest.fn()
});

const xhrMockClassUnauthenticated = () => ({
  open: jest.fn(),
  send: jest.fn().mockReturnValue({
    value: []
  }),
  setRequestHeader: jest.fn()
});
window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

const Component = "Component";
const Auth = authWrapper(<Component azureClientId="azureId123" />);
const renderComponent = () => render(
  <Auth />,
  initialTestState
);

describe("<Auth />", () => {
  describe("Success", () => {
    it("renders", () => {
      renderComponent();
      expect(LoginInProgress.mock.calls.length).toBe(1);
    });
  });
  describe("Error", () => {
    beforeEach(() => {
      jest.mock("msal", () => ({
        __esModule: true,
        UserAgentApplication: jest.fn().mockImplementation(() => {
          return {
            acquireTokenSilent: jest.fn()
              .mockRejectedValueOnce(new Error("login is already in progress"))
              .mockRejectedValueOnce(new Error("bad error")),
            handleRedirectCallback: jest.fn((success, err) => err("mock error")),
            isCallback: jest.fn().mockReturnValue(false),
            getAccount: jest.fn().mockReturnValue(true),
            loginRedirect: jest.fn()
          };
        })
      }));
    });
    it("renders", () => {
      renderComponent();
      expect(LoginError.mock.calls.length).toBe(1);
    });
  });
  describe("Error No Auth", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClassUnauthenticated);
    });
    afterEach(() => {
      window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
    });
    it("renders", () => {
      renderComponent();
      expect(LoginInProgress.mock.calls.length).toBe(1);
    });
  });
});