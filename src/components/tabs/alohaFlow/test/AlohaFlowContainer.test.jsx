import React from "react";
import {
  render,
  initialTestState
} from "testUtils";
import { useAdminState } from "context";
import { AlohaFlowContainer } from "../index";
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
    expect(DataGridFlow).toBeCalledTimes(1);

  });
});