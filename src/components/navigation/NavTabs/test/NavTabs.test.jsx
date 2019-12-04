import NavTabs from "../NavTabs";
import {
  FlashMessageContainer,
  ManagementWrapper
} from "components";
import React from "react";
import {
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  FlashMessageContainer: jest.fn(),
  ManagementWrapper: jest.fn()
}));

describe("<NavTabs />", () => {

  beforeEach(() => {
    setupMockedComponents({
      FlashMessageContainer,
      ManagementWrapper
    });
  });

  test("we should load the two links, as well as default to showing the Management Pane", () => {
    const rendered = render(<NavTabs />);
    expect(rendered.getByText("User Management", { selector: "span" })).toBeInTheDocument();
    // expect(rendered.getByText("Settings", { selector: "span" })).toBeInTheDocument();
    expectMockedComponent(rendered, { ManagementWrapper });
    expectMockedComponent(rendered, { FlashMessageContainer });
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getByText("FlashMessageContainer")).not.toBeVisible();
  });

  test("when we click on the 'Flash Message' link, FlashMessageContainer should be visible, not management", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Flash Message", { selector: "span" }));
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getByText("FlashMessageContainer")).toBeVisible();
  });

  test("when we click on the already clicked link, nothing should change", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("User Management", { selector: "span" }));
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getByText("FlashMessageContainer")).not.toBeVisible();
  });
});