import Header from "../Header";
import {
  Logo,
  UserCard
} from "components";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  Logo: jest.fn(),
  UserCard: jest.fn()
}));

describe("<Header />", () => {
  beforeEach(() => {
    setupMockedComponents({
      Logo,
      UserCard
    });
  });
  test("the header should simply render the Logo and UserCard components.", () => {
    const rendered = render(<Header />);
    expectMockedComponent(rendered, { Logo });
    expectMockedComponent(rendered, { UserCard });
  });
});