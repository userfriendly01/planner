import ProfileDropDown from "../ProfileDropDown";
import { OutlinedSelect } from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  OutlinedSelect: jest.fn()
}));

describe("<ProfileDropDown />", () => {
  const availableProfiles = [
    {
      profile_id: 1,
      profile_nme: "First Profile"
    },
    {
      profile_id: 2,
      profile_nme: "Second Profile"
    },
    {
      profile_id: 3,
      profile_nme: "Third Profile"
    }
  ];
  const profileFromParent = {
    profileId: 2,
    dialList: []
  };
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({ OutlinedSelect });
  });
  describe("a profile is selected", () => {
    test("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        availableProfiles={availableProfiles}
        profile={profileFromParent}
      />);
      expectMockedComponent(rendered, { OutlinedSelect }, 1);
      const optionsDisplayFunc = OutlinedSelect.mock.calls[0][0].optionsDisplayFunc;
      const option = optionsDisplayFunc(availableProfiles[1]);
      expect(option).toEqual({
        display: "2 - Second Profile",
        key: 2,
        value: 2
      });
    });
  });
  describe("no profile is selected (profileID is null)", () => {
    const profile = {
      profileId: null,
      dialList: []
    };
    test("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        availableProfiles={availableProfiles}
        profile={profile}
      />);
      expectMockedComponent(rendered, { OutlinedSelect }, 1);
      expectOnlyPassedProps(OutlinedSelect, {
        noBlankValue: false
      });
    });
  });
});
