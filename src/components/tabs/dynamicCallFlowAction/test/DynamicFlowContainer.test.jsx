import React from "react";
import { render } from "testUtils";
import { DynamicCallFlowActionContainer } from "../index";
import {
  LoginInProgress,
  LoginError
} from "components";
import { useAccessToken } from "authentication";
import ActionDataGrid from "components/tabs/dynamicCallFlowAction/DataGrid/ActionDataGrid";

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

describe("<DynamicFlowContainer />", () => {
  beforeEach(()=>{
    jest.clearAllMocks();
  });

  test("Simple Render", () =>{
    useAccessToken.mockReturnValue({
      isLoading: false
    });

    render(<DynamicCallFlowActionContainer />);
    expect(ActionDataGrid.mock.calls.length).toBe(1);
  });

  test("Returns Loading Component", () =>{
    useAccessToken.mockReturnValue({
      isLoading: true
    });

    render(<DynamicCallFlowActionContainer />);
    expect(ActionDataGrid.mock.calls.length).toBe(0);
    expect(LoginInProgress.mock.calls.length).toBe(1);
  });

  test("Returns error Component", () => {
    useAccessToken.mockReturnValue({
      isLoading: false,
      error: "An error"
    });

    render(<DynamicCallFlowActionContainer />);
    expect(ActionDataGrid.mock.calls.length).toBe(0);
    expect(LoginError.mock.calls.length).toBe(1);
  });
});