import UserCard from "../UserCard";
import { AccountBox } from "@mui/icons-material";
import { initialState } from "context";
import React from "react";
import {
  expectMockedComponent,
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
    const state = initialState;
    state.userContext.pingIdentity.displayName = "John Doe";
    const rendered = render(<UserCard />, state);
    expectMockedComponent(rendered, { AccountBox });
    expect(rendered.getByText("John Doe")).toBeInTheDocument();
  });
});