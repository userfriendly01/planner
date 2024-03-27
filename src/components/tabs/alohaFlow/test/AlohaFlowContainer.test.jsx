import React from "react";
import { render } from "testUtils";
import { AlohaFlowContainer } from "../index";
import {
  LoginInProgress,
  LoginError
} from "components";
import { useAccessToken } from "authentication";
import DataGridFlow from "../DataGridFlow/DataGridFlow";

jest.mock("components", () => ({
  __esModule: true,
  LoginInProgress: jest.fn(),
  LoginError: jest.fn()
}));

jest.mock("../DataGridFlow/DataGridFlow", () => {
  const originalModule = jest.requireActual("../DataGridFlow/DataGridFlow");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn()
  };
});

describe("<AlohaFlowContainer />", () => {
  beforeEach(()=>{
    jest.clearAllMocks();
  });

  test("Simple Render", () =>{
    useAccessToken.mockReturnValue({
      isLoading: false
    });

    render(<AlohaFlowContainer />);
    expect(DataGridFlow.mock.calls.length).toBe(1);
  });

  test("Returns Loading Component", () =>{
    useAccessToken.mockReturnValue({
      isLoading: true
    });

    render(<AlohaFlowContainer />);
    expect(DataGridFlow.mock.calls.length).toBe(0);
    expect(LoginInProgress.mock.calls.length).toBe(1);
  });

  test("Returns error Component", () => {
    useAccessToken.mockReturnValue({
      isLoading: false,
      error: "An error"
    });

    render(<AlohaFlowContainer />);
    expect(DataGridFlow.mock.calls.length).toBe(0);
    expect(LoginError.mock.calls.length).toBe(1);
  });
});