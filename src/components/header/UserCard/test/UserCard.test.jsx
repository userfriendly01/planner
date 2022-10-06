import UserCard from "../UserCard";
import { AccountBox } from "@mui/icons-material";
import React from "react";
import {
  expectMockedComponent,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  AccountBox: jest.fn()
}));

describe("<UserCard />", () => {

  beforeEach(() => {
    setupMockedComponents({
      AccountBox
    });
  });

  test("should render a div with correct name and Account Box icon.", () => {
    const state = initialTestState;
    state.userContext.pingIdentity.displayName = "John Doe";
    const rendered = render(<UserCard />, state);
    expectMockedComponent(rendered, { AccountBox });
    expect(rendered.getByText("John Doe")).toBeInTheDocument();
  });
});