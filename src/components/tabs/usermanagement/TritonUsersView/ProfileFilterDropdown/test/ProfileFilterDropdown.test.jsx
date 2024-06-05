import { ProfileFilterDropdown } from "../ProfileFilterDropdown";
import { Dropdown } from "components/Dropdown";
import {
  useAdminState, useAdminDispatch
} from "context/appContext";
import React from "react";
import { sortProfilesById } from "utils/skillsUtils";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState as initialState
} from "testUtils";
import { theme } from "globals/theme";
import { ThemeProvider } from "styled-components";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("utils/sortUtils", () => ({
  sortProfilesById: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

const mockAdminDispatch = jest.fn();

const mockProfileData = [
  {
    profile_nme: "test1",
    profile_id: 1,
    operating_unit_nme: "operatingUnitName1",
    operating_unit_sid: "operatingUnitSid1"
  },
  {
    profile_nme: "test3",
    profile_id: 3,
    operating_unit_nme: "operatingUnitName3",
    operating_unit_sid: "operatingUnitSid1"
  },
  {
    profile_nme: "test2",
    profile_id: 2,
    operating_unit_nme: "operatingUnitName2",
    operating_unit_sid: "operatingUnitSid2"
  },
  {
    profile_nme: "test435",
    profile_id: 435,
    operating_unit_nme: "operatingUnitName435",
    operating_unit_sid: "operatingUnitSid435"
  }
];

const sortedProfiles = [...mockProfileData].sort(sortProfilesById);

const initialTestState = {
  ...initialState,
  profileContext: { profiles: mockProfileData }
};

const renderComponent = () => render(
  <ThemeProvider theme={theme}>
    <ProfileFilterDropdown />
  </ThemeProvider>
);


describe("<ProfileDropdown />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    setupMockedComponents({
      Dropdown
    });
    jest.clearAllMocks();
  });
  test("upon initial render, should display profile Filter and all profiles should be listed in the dropdown sorted by profile id", () => {
    renderComponent();
    expect(Dropdown.mock.calls[0][0].label).toBe("Profile Dropdown");
    expect(Dropdown.mock.calls[0][0].options).toStrictEqual([
      {
        label: "Show All",
        value: "show-all"
      },
      {
        label: "divider",
        value: "divider"
      },
      ...sortedProfiles.map(profile => ({
        label: `${profile.profile_id} - ${profile.profile_nme}`,
        value: typeof profile.profile_id === "number" ? profile.profile_id.toString() : profile.profile_id
      }))
    ]);
    expect(Dropdown.mock.calls[0][0].value).toEqual([]);
  });

  test("When an option is clicked in the filter, the dispatch method is fired with the correct parameters", () => {
    const selection = [{
      label: "1 - test1",
      value: "1"
    }, {
      label: "2 - test2",
      value: "2"
    }];
    renderComponent();
    act(() => {
      Dropdown.mock.calls[0][0].updateValue(null, selection);
    });
    expect(mockAdminDispatch).toHaveBeenCalledWith({
      type: "updateProfileFilter",
      payload: selection
    });
  });
  describe("Custom Render", () => {
    describe("Non Profile Option is passed through", () => {
      test("show-all renders as expected", () => {
        const option = {
          label: "Show All",
          value: "show-all"
        };
        renderComponent();
        act(() => Dropdown.mock.calls[0][0].updateValue(null, [option]));
        expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "updateProfileFilter",
          payload: []
        });
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({ option }));
        expect(rendered.container).toHaveTextContent("Show All");
      });
      test("divider renders as expected", () => {
        const option = {
          label: "divider",
          value: "divider"
        };
        renderComponent();
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({ option }));
        act(() => Dropdown.mock.calls[0][0].updateValue(null, [option]));
        expect(mockAdminDispatch).toHaveBeenCalledTimes(0);
        expect(rendered.container).toHaveTextContent("divider");
      });
    });
  });
});