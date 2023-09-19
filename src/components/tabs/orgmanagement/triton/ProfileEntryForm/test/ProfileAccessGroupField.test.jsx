import ProfileAccessGroupField from "../ProfileAccessGroupField";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  initialTestState,
  getMockedComponentProps
} from "testUtils";
import { Dropdown } from "components";
import {
  theme
} from "globals";
import { ThemeProvider } from "styled-components";
import { Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";
import React from "react";
import { getAccessGroup } from "services";
import { act } from "react-dom/test-utils";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  Info: jest.fn()
}));

jest.mock("@mui/material", () => ({
  __esModule: true,
  Tooltip: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

getAccessGroup.mockImplementation(() => { return Promise.resolve([{
  access_group_nme: "test",
  access_group_id: 123,
  viewable_profiles: [{
    profile_id: 23,
    name: "Hello world"
  }]
},
{
  access_group_nme: "test no profile",
  access_group_id: 234,
  viewable_profiles: []
}]); });

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