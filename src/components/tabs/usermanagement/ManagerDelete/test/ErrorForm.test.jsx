import {
  StyledButton
} from "components";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";
import ErrorForm from "../ErrorForm";

jest.mock("components", () => ({
  __esModule: true,
  StyledButton: jest.fn()
}));

const mockHandleClose = jest.fn();

const renderComponent = teamMembers => render(
  <ErrorForm TeamMembers = {teamMembers} HandleClose={mockHandleClose}/>
);

describe("<ErrorForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      StyledButton
    });
  });

  describe("state of the form", () => {
    test("renders a form with a button", () => {
      const rendered = renderComponent("Bob, Carol, Ted, Alice");
      expectMockedComponent(rendered, { StyledButton });
    });
  });
});
