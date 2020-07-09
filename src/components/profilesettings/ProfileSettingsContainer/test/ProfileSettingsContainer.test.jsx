import ProfileSettingsContainer from "../ProfileSettingsContainer";
import MockAdapter from "axios-mock-adapter";
import {
  DialListTable,
  ProfileDropDown
} from "components";
import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components", () => ({
  __esModule: true,
  DialListTable: jest.fn(),
  ProfileDropDown: jest.fn()
}));

const profileList = [
  {
    profile_nme: "test1",
    profile_id: 1
  },
  {
    profile_nme: "test2",
    profile_id: 2
  },
  {
    profile_nme: "test3",
    profile_id: 3
  }
];

const initialTestState = {
  ...initialState,
  profileContext: {
    profiles: profileList
  }
};

const initialProfileState = {
  profileId: null,
  dialList: []
};

const axiosErrorMessage = "Failed to get data for profile";

describe("<ProfileSettingsContainer />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      DialListTable,
      ProfileDropDown
    });
  });

  describe("profile.profileId is null (initial state)", () => {
    test("should render ProfileDropDown with correct props and 'Please select a profile'", () => {
      const rendered = render(<ProfileSettingsContainer />, initialTestState);
      expectMockedComponent(rendered, { DialListTable }, 0);
      expectMockedComponent(rendered, { ProfileDropDown }, 1);
      expect(rendered.container).toHaveTextContent("Please select a profile");
      expect(rendered.container).not.toHaveTextContent(axiosErrorMessage);
      const profileDropDownProps = getMockedComponentProps(ProfileDropDown);
      expect(profileDropDownProps.availableProfiles).toEqual(profileList.slice(1));
      expect(profileDropDownProps.profile).toEqual(initialProfileState);
    });
  });

  describe("profile.profileId is not null (a profile has been selected)", () => {
    const profileId = 3;
    describe("call to GET_PROFILE_DATA succeeds", () => {
      const getProfileDataResponse = {
        contacts: [
          {
            contact_id: 16,
            contact_nme: "Bo Jackson",
            contact_num: "800-123-4567"
          },
          {
            contact_id: 18,
            contact_nme: "Daryl Strawberry",
            contact_num: "800-123-4568"
          }
        ]
      };
      beforeEach(() => axiosMock.onGet(apiPaths.GET_PROFILE_DATA(profileId)).reply(200, getProfileDataResponse));
      test("should render ProfileDropDown and DialListTable with correct props", done => {
        const rendered = render(<ProfileSettingsContainer />, initialTestState);
        const dropDownProps = getMockedComponentProps(ProfileDropDown);
        act(() => {
          dropDownProps.updateProfile(profileId);
          return Promise.resolve();
        })
          .then(() => {
            expectMockedComponent(rendered, { ProfileDropDown }, 1);
            expectMockedComponent(rendered, { DialListTable }, 1);
            expectOnlyPassedProps(DialListTable, {
              profile: {
                profileId,
                dialList: getProfileDataResponse.contacts
              }
            });
            expect(rendered.container).not.toHaveTextContent(axiosErrorMessage);
            done();
          });
      });
    });

    describe("call to GET_PROFILE_DATA fails", () => {
      const error = { badNews: "boooo" };
      beforeEach(() => axiosMock.onGet(apiPaths.GET_PROFILE_DATA(profileId)).reply(500, error));
      test("should display drop down & error message", done => {
        const rendered = render(<ProfileSettingsContainer />, initialTestState);
        const dropDownProps = getMockedComponentProps(ProfileDropDown);
        act(() => {
          dropDownProps.updateProfile(profileId);
          return Promise.resolve();
        })
          .then(() => {
            expectMockedComponent(rendered, { ProfileDropDown }, 1);
            expectMockedComponent(rendered, { DialListTable }, 0);
            expect(rendered.container).toHaveTextContent(`${axiosErrorMessage} ${profileId}`);
            done();
          });
      });
    });
  });
});
