import React from "react";
import {
  initialTestState, render
} from "testUtils";
import { AlohaFlowContainer } from "../index";
import DataGridFlow from "../DataGridFlow/DataGridFlow";
import { useAdminState } from "context";

jest.mock("context", () => ({
  useAdminState: jest.fn()
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
    useAdminState.mockReturnValue(initialTestState);
  });

  test("Simple Render", () =>{
    render(<AlohaFlowContainer />);
    expect(DataGridFlow.mock.calls.length).toBe(1);
  });
});