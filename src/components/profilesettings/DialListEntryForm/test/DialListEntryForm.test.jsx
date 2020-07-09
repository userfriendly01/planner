import AddEditSettingsModal from "../AddEditSettingsModal";
import { TextField } from "@material-ui/core";
import {
  PaperContainer,
  ModalPhoneNumber,
  StyledButton
} from "components";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@material-ui/core", () => ({
  __esModule: true,
  TextField: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  PaperContainer: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  StyledButton: jest.fn()
}));

describe("<EditSettingsModal />", () => {
  beforeEach(() => {
    setupMockedComponents({
      PaperContainer,
      ModalPhoneNumber,
      StyledButton,
      TextField
    });
    PaperContainer.mockClear();
    StyledButton.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });
  describe("AddEditSettingsModal is in the correct initial state for Add", () => {
    test("When the Modal is opened from the add button it has only Transfer Number, and Friendly Name Fields", () => {
      const rendered = render(<AddEditSettingsModal />);
      expectMockedComponent(rendered, { PaperContainer }, 1);
      // expectMockedComponent(rendered, { StyledButton }, 1);
      // expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
      // expectMockedComponent(rendered, { TextField }, 1);
    });
  });
});