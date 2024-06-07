import Header from "../Header";
import UserCard from "../../UserCard/UserCard";
import Logo from "../../Logo/Logo";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("../../Logo/Logo", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../UserCard/UserCard", () => ({
  __esModule: true,
  default: jest.fn()
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