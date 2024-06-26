import { ProfileAccessGroupField } from "../ProfileAccessGroupField";
import {
  act,
  expectMockedComponent,
  render,
  setupMockedComponents,
  initialTestState,
  getMockedComponentProps
} from "testUtils";
import { Dropdown } from "components/Dropdown";
import {
  theme
} from "globals/theme";
import { ThemeProvider } from "styled-components";
import { Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";
import React from "react";

jest.mock("@mui/icons-material", () => ({
  Info: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Tooltip: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

const mockSetAccessGroupId = jest.fn();
const renderComponent = agId => render(
  <ThemeProvider theme={theme}>
    <ProfileAccessGroupField enableDropDown={true} accessGroupId={agId} setAccessGroupId={mockSetAccessGroupId} />
  </ThemeProvider>, initialTestState
);

describe("<ProfileAccessGroupField />", () => {

  beforeEach(() => {
    setupMockedComponents({
      Info,
      Dropdown,
      Tooltip
    });
  });

  describe("initial state create", () => {
    test("should render access group dropdown", () => {
      const rendered = renderComponent(null);
      expectMockedComponent(rendered, { Dropdown });
    });
  });

  describe("initial state edit", () => {
    test("should render access group dropdown with id 2 selected", () => {
      const rendered = renderComponent(123);
      expectMockedComponent(rendered, { Dropdown });
    });
  });

  describe("change dropdown value", () => {
    test("should render selected option and fire state change", () => {
      const rendered = renderComponent(null);
      expectMockedComponent(rendered, { Dropdown });
      act(() => {
        const { updateValue } = getMockedComponentProps(Dropdown);
        updateValue("", { value: 123 });
        expect(mockSetAccessGroupId).toBeCalledTimes(1);
        expect(mockSetAccessGroupId).toHaveBeenCalledWith(123);
      });
    });
  });
});