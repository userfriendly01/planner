import { ProfileDropDown } from "../ProfileDropDown";
import { Dropdown } from "components/Dropdown";
import { useAdminState } from "context/appContext";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  initialTestState,
  mockProfiles,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

const updateProfile = jest.fn();

describe("<ProfileDropDown />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({ Dropdown });
  });
  describe("a profile is selected", () => {
    test("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        selectedProfile={1}
        setSelectedProfile={updateProfile}
      />);
      expectMockedComponent(rendered, { Dropdown }, 1);
      expectOnlyPassedProps(Dropdown, {
        label: "Profile",
        value: {
          label: "1 - USRM Billing & Collections",
          value: 1
        }
      });
      const { updateValue } = getMockedComponentProps(Dropdown);
      updateValue(null, mockProfiles[1]);
      expect(updateProfile).toHaveBeenCalledTimes(1);
    });
  });
  describe("no profile is selected (profileID is null)", () => {
    test("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        selectedProfile={null}
        setSelectedProfile={updateProfile}
      />);
      expectMockedComponent(rendered, { Dropdown }, 1);
      expectOnlyPassedProps(Dropdown, {
        label: "Profile",
        value: ""
      });
    });
  });
});
