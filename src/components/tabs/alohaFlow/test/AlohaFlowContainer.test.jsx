import {
  render,
  initialTestState
} from "testUtils";
import { AlohaFlowContainer } from "../index";
import DataGridFlow from "../DataGridFlow/DataGridFlow";
import React from "react";

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