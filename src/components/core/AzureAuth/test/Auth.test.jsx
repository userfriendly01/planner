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