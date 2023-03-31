import React from "react";
import {
  render,
  initialTestState
} from "testUtils";
import { useAdminState } from "context";
import { AlohaFlowContainer } from "../index";
import { LoginInProgress } from "../../../core/AzureAuth/LoginInProgress";

jest.mock("../../../core/AzureAuth/LoginInProgress", () => ({
  __esModule: true,
  LoginInProgress: jest.fn()
}));

jest.mock("msal", () => ({
  __esModule: true,
  UserAgentApplication: jest.fn().mockImplementation(() => {
    return {
      acquireTokenPopup: jest.fn().mockResolvedValue({
        accessToken: "mockt-test-token-1234"
      }),
      handleRedirectCallback: jest.fn(),
      isCallback: jest.fn().mockReturnValue(false),
      getAccount: jest.fn().mockReturnValue(true),
      loginRedirect: jest.fn()
    };
  })
}));

const xhrMockClass = () => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn()
});

window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
import DataGridFlow from "../DataGridFlow/DataGridFlow";


jest.mock("../DataGridFlow/DataGridFlow", () => {
  const originalModule = jest.requireActual("../DataGridFlow/DataGridFlow");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn()
  };
});

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const renderComponent = () => render(
  <AlohaFlowContainer />,
  initialTestState
);

describe("<AlohaFlowContainer />", () => {
  beforeEach(()=>{
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
  });
  it("renders", () => {
    renderComponent();
    expect(LoginInProgress.mock.calls.length).toBe(1);
  });
});