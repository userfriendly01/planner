import Wrapper from "../Wrapper";
import {
  Logo,
  UserCard
} from "components";
import React from "react";
import { render } from "react-testing-library";
import {
  expectMockedComponent,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  Logo: jest.fn(),
  UserCard: jest.fn()
}));

describe("<Wrapper />", () => {

  beforeEach(() => {
    setupMockedComponents({
      Logo,
      UserCard
    });
  });

  test("the header wrapper should simply render the Logo and UserCard components.", () => {
    const rendered = render(<Wrapper />);
    expectMockedComponent(rendered, { Logo });
    expectMockedComponent(rendered, { UserCard });
  });
});