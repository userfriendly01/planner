import { useAccessToken } from "authentication";
import AlohaRoutingContainer from "../AlohaRoutingContainer";
import { DataGridRouting } from "../DataGridRouting";
import React from "react";
import {
  render,
  setupMockedComponents
} from "testUtils";
import {
  LoginError, LoginInProgress
} from "components";

jest.mock("../DataGridRouting",()=>({
  __esModule: true,
  DataGridRouting: jest.fn()
}));

jest.mock("authentication", () => ({
  useAccessToken: jest.fn()
}));

jest.mock("components", () => ({
  LoginInProgress: jest.fn(),
  LoginError: jest.fn()
}));

describe("<AlohaRoutingContainer />", ()=>{
  beforeEach(()=>{
    setupMockedComponents({
      DataGridRouting,
      LoginError,
      LoginInProgress
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  test("Simple Render", () =>{
    useAccessToken.mockReturnValue({
      isLoading: false
    });

    render(<AlohaRoutingContainer />);
    expect(DataGridRouting.mock.calls.length).toBe(1);
  });

  test("Returns Loading Component", () =>{
    useAccessToken.mockReturnValue({
      isLoading: true
    });

    render(<AlohaRoutingContainer />);
    expect(DataGridRouting.mock.calls.length).toBe(0);
    expect(LoginInProgress.mock.calls.length).toBe(1);
  });

  test("Returns error Component", () => {
    useAccessToken.mockReturnValue({
      isLoading: false,
      error: "An error"
    });

    render(<AlohaRoutingContainer />);
    expect(DataGridRouting.mock.calls.length).toBe(0);
    expect(LoginError.mock.calls.length).toBe(1);
  });
});
