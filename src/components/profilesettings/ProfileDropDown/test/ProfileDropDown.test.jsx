import ProfileDropDown from "../ProfileDropDown";
import { OutlinedSelect } from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  OutlinedSelect: jest.fn()
}));

const updateProfile = jest.fn();

describe("<ProfileDropDown />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
  const profileId = "2";

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({ OutlinedSelect });
  });
  describe("a profile is selected", () => {
    test("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        availableProfiles={availableProfiles}
        profileId={profileId}
        updateProfile={updateProfile}
      />);
      expectMockedComponent(rendered, { OutlinedSelect }, 1);
      const optionsDisplayFunc = OutlinedSelect.mock.calls[0][0].optionsDisplayFunc;
      const option = optionsDisplayFunc(availableProfiles[1]);
      expect(option).toEqual({
        display: "2 - Second Profile",
        key: 2,
        value: 2
      });
      const { updateValue } = getMockedComponentProps(OutlinedSelect);
      updateValue(profileId);
      expect(updateProfile).toHaveBeenCalledWith(profileId);
    });
  });
  describe("no profile is selected (profileID is null)", () => {
    test("should render OutlinedSelect with correct props", () => {
      const rendered = render(<ProfileDropDown
        availableProfiles={availableProfiles}
        profileId={null}
        updateProfile={updateProfile}
      />);
      expectMockedComponent(rendered, { OutlinedSelect }, 1);
      expectOnlyPassedProps(OutlinedSelect, {
        noBlankValue: false
      });
    });
  });
});
