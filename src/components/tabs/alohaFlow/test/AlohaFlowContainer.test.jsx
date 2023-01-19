import {
  render,
  initialTestState
} from "testUtils";
import { AlohaFlowContainer } from "../index";
import DataGridFlow from "../DataGridFlow/DataGridFlow";
import React from "react";

jest.mock("msal",()=>({
  __esModule: true,
  UserAgentApplication: jest.fn().mockImplementation(() => { return {
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

jest.mock("../DataGridFlow/DataGridFlow", () => {
  const originalModule = jest.requireActual("../DataGridFlow/DataGridFlow");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn()
  };
});

const renderComponent = () => render(
  <AlohaFlowContainer />,
  initialTestState
);

describe("<AlohaFlowContainer />", () => {
  it("renders", () => {
    renderComponent();
    expect(DataGridFlow).toBeCalledTimes(1);

  });
});