import { act, render, setupMockedComponents, initialFormState } from "testUtils";
import {
  Accordion
} from "@mui/material";
import React from "react";
import { default as RoutingAttributes } from "../RoutingAttributes";
import {
  useFormDispatch,
  useFormState
} from "context";
jest.mock("@mui/material", () => {
  return{
    __esModule: true,
    Accordion: jest.fn()
  };
});

jest.mock("components", () => {
  return{
    __esModule: true,
    SelectContainer: jest.fn()
  };
});

jest.mock("context", () => ({
  __esModule: true,
  useFormState: jest.fn(),
  useAdminState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

describe("<RoutingAttributes />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(jest.fn());
    useFormState.mockReturnValue(initialFormState);
  });
  setupMockedComponents({
    Accordion
  });
  const renderComponent = () => {
    return render(
      <RoutingAttributes />
    );
  };
  test("Simulate Routing Team Component", ()=>{
    const eventOnChange={
      target: {
        name: "routing Team",
        value: "sample1"
      }
    }
    const valueChanged ={
      label: "sample1",
      value: "sample1"
    }
    renderComponent();
    const teamChange = Accordion.mock.calls[0][0];
    const routingTeamChange = Accordion.mock.calls[0][0].children[1].props.children.props.updateValue;
    act(()=>{
      routingTeamChange(eventOnChange,valueChanged);
    })
    expect(routingTeamChange).toBeTruthy();
  });
});