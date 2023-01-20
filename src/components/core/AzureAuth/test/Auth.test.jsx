import { authWrapper, PERMISSIONS } from "../Auth";
import { LoginInProgress } from "../LoginInProgress";
import React from "react";
import {
  render,
  initialTestState
} from "testUtils";

jest.mock("../LoginInProgress", () => ({
  __esModule: true,
  LoginInProgress: jest.fn()
}));

// jest.mock("msal", () => ({
//   __esModule: true,
//   UserAgentApplication: jest.fn().mockImplementation(() => {
//     return {
//       acquireTokenPopup: jest.fn().mockResolvedValue({
//         accessToken: "mockt-test-token-1234"
//       }),
//       handleRedirectCallback: jest.fn((success, error)=> {}),
//       isCallback: jest.fn().mockReturnValue(false),
//       getAccount: jest.fn().mockReturnValue(true),
//       loginRedirect: jest.fn()
//     };
//   })
// }));
const xhrMockClass = () => ({
  open: jest.fn(),
  send: jest.fn().mockReturnValue({value: [
    {
      displayName: PERMISSIONS.READ_GROUP_FLOW
    }
  ]}),
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

  it("renders", () => {
    renderComponent();
    expect(LoginInProgress.mock.calls.length).toBe(1);
  });
});