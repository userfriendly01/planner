import UserCard from "../UserCard";
import { AccountBox } from "@material-ui/icons";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@material-ui/icons", () => ({
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
    const rendered = render(<UserCard name="John Doe" />);
    expectMockedComponent(rendered, { AccountBox });
    expect(rendered.getByText("John Doe")).toBeInTheDocument();
  });
});