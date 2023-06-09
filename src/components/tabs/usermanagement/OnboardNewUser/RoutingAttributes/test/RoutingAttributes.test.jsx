import { act, render, setupMockedComponents } from "testUtils";
import {
  Accordion
} from "@mui/material";
import React from "react";
import { default as RoutingAttributes } from "../RoutingAttributes";

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
describe("<RoutingAttributes />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  setupMockedComponents({
    Accordion
  });
  const renderComponent = () => {
    return render(
      <RoutingAttributes />
    );
  };
  test("Simulate Component", ()=>{
    renderComponent();
    const upcomingAttributes = Accordion.mock.calls[0][0].children[2].props.children;
    expect(upcomingAttributes).toBe('Upcoming Routing Attributes');
  });
  test("Simulate Routing Team Component", ()=>{
    const eventOnChange={
      target: {
        name: "routing Team",
        value: "sample1"
      }
    }
    renderComponent();
    const routingTeamChange = Accordion.mock.calls[0][0].children[1].props.children.props.onChange;
    act(()=>{
      routingTeamChange(eventOnChange);
    })
    expect(routingTeamChange).toBeTruthy();
  });
});