import { waitFor } from "@testing-library/react";
import {
  authWrapper, PERMISSIONS
} from "../Auth";
import { LoginError } from "../LoginError";
import React from "react";
import {
  render,
  initialTestState
} from "testUtils";

const loginError = "Something unexpected happened!";
const errorToUser = loginError;
jest.useFakeTimers();

jest.mock("msal", () => ({
  __esModule: true,
  UserAgentApplication: jest.fn().mockImplementation(() => {
    return {
      acquireTokenPopup: jest.fn()
        .mockRejectedValue(new Error(loginError)),
      handleRedirectCallback: jest.fn((success, err) => err("mock error")),
      isCallback: jest.fn().mockReturnValue(false),
      getAccount: jest.fn().mockReturnValue(true),
      loginRedirect: jest.fn()
    };
  })
}));

jest.mock("../LoginError", () => ({
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

window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

const Component = "Component";
const renderComponent = () => {
  const Auth = authWrapper(<Component azureClientId="azureId123" />);
  return render(
    <Auth />,
    initialTestState
  );
};

describe("<Auth />", () => {
  describe("Error", () => {
    beforeEach(() => {
    });
    it("renders", async () => {
      renderComponent();
      await waitFor(() => {
        jest.runAllTimers();
        expect(LoginError.mock.calls[1][0].message).toBe(errorToUser);
      });
    });
  });
});
