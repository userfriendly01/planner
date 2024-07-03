import { ProfileDropDown } from "../ProfileDropDown";
import { Dropdown } from "components/Dropdown";
import { useAdminState } from "context/appContext";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  initialTestState,
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

  const availableProfiles = [
    {
      profile_id: 1,
      profile_name: "First Profile",
      value: 1,
      label: "First Profile"

    },
    {
      profile_id: 2,
      profile_name: "Second Profile",
      value: 2,
      label: "Second Profile"
    },
    {
      profile_id: 3,
      profile_name: "Third Profile",
      value: 3,
      label: "Third Profile"
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({ Dropdown });
  });
  describe("a profile is selected", () => {
    test("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        availableProfiles={availableProfiles}
        profileId={availableProfiles[0].profile_id}
        updateProfile={updateProfile}
      />);
      expectMockedComponent(rendered, { Dropdown }, 1);
      expectOnlyPassedProps(Dropdown, {
        label: "Profile",
        value: {
          label: "1 - First Profile",
          value: 1
        }
      });
      const { updateValue } = getMockedComponentProps(Dropdown);
      updateValue(null, availableProfiles[1]);
      expect(updateProfile).toHaveBeenCalledWith(availableProfiles[1].value);
    });
  });
  describe("no profile is selected (profileID is null)", () => {
    test.only("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        availableProfiles={availableProfiles}
        profileId={null}
        updateProfile={updateProfile}
      />);
      expectMockedComponent(rendered, { Dropdown }, 1);
      expectOnlyPassedProps(Dropdown, {
        label: "Profile",
        value: ""
      });
    });
  });
});
