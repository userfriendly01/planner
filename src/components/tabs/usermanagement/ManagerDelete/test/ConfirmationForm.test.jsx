import {
  StyledButton
} from "components";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";
import ConfirmationForm from "../ConfirmationForm";

jest.mock("components", () => ({
  __esModule: true,
  StyledButton: jest.fn()
}));

const mockDeleteManagerClicked = jest.fn();

const managerObject = manager => {
  return { manager_n_number: manager };
};

const renderComponent = selectedManager => render(
  <ConfirmationForm selectedManager={selectedManager} deleteManagerClicked={mockDeleteManagerClicked}/>
);

describe("<ConfirmationForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      StyledButton
    });
  });

  describe("state of the form", () => {
    test("renders a form with a button", () => {
      const rendered = renderComponent(managerObject("n0263786"));
      expectMockedComponent(rendered, { StyledButton });
    });
  });
});
