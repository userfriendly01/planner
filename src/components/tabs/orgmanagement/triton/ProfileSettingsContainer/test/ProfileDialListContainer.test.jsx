import { ProfileDialListContainer } from "../ProfileDialListContainer";
import MockAdapter from "axios-mock-adapter";
import { StyledButton } from "components/StyledButton";
import { DialListTable } from "orgmanagement/DialListTable";
import { ProfileDropDown } from "orgmanagement/ProfileDropDown";
import { apiPaths } from "globals/index";
import { useAdminState } from "context/appContext";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor,
  initialTestState as initialState
} from "testUtils";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);

jest.mock("orgmanagement/DialListTable", () => ({
  DialListTable: jest.fn()
}));

jest.mock("orgmanagement/ProfileDropDown", () => ({
  ProfileDropDown: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
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
  },
  userContext: {
    nNumber: "n1234567"
  }
};

const errorMessage = "Failed to fetch data for selected profile";

describe("<ProfileDialListContainer />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      DialListTable,
      ProfileDropDown,
      StyledButton
    });
  });

  const renderComponent = () => {
    return render(<ProfileDialListContainer />);
  };

  describe("profile.profileId is null (initial state)", () => {
    test("should render ProfileDropDown with correct props and 'Please select a profile'", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { DialListTable }, 0);
      expectMockedComponent(rendered, { ProfileDropDown }, 1);
      expectMockedComponent(rendered, { StyledButton }, 0);
      expect(rendered.container).toHaveTextContent("Please select a profile");
      expect(rendered.container).not.toHaveTextContent(errorMessage);
      expectOnlyPassedProps(ProfileDropDown, {
        availableProfiles: profileList,
        profileId: null
      });
    });
  });

  describe("profile.profileId is not null (a profile has been selected)", () => {
    const profileId = 3;
    describe("call to GET_PROFILE_DATA succeeds", () => {
      const getProfileDataResponse = {
        diallist: [
          {
            contact_id: 18,
            contact_nme: "Daryl Strawberry",
            contact_num: "800-123-4568"
          },
          {
            contact_id: 16,
            contact_nme: "Bo Jackson",
            contact_num: "800-123-4567"
          }
        ]
      };
      beforeEach(() => axiosMock.onGet(apiPaths.GET_PROFILE_DATA(profileId)).reply(200, getProfileDataResponse));
      test("should render ProfileDropDown and DialListTable with correct props", async () => {
        const rendered = renderComponent();
        const { updateProfile } = getMockedComponentProps(ProfileDropDown);
        act(() => {
          updateProfile(profileId);
        });

        const expectsAfterGettingProfileData = () => {
          expectMockedComponent(rendered, { ProfileDropDown }, 1);
          expectMockedComponent(rendered, { DialListTable }, 1);
          expectMockedComponent(rendered, { StyledButton }, 0);
          expectOnlyPassedProps(DialListTable, {
            // sorted dialList
            dialList: [
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
            ],
            profileId
          }, getLastInstanceCalled(DialListTable));
          expect(rendered.container).not.toHaveTextContent(errorMessage);
        };

        await waitFor(() => {
          expectsAfterGettingProfileData();
        });
        const { refreshProfileData } = getMockedComponentProps(DialListTable, getLastInstanceCalled(DialListTable));
        act(() => {
          refreshProfileData();
        });
        await waitFor(() => {
          expectsAfterGettingProfileData();
        });
      });
    });

    describe("call to GET_PROFILE_DATA fails", () => {
      const error = { badNews: "boooo" };
      beforeEach(() => axiosMock.onGet(apiPaths.GET_PROFILE_DATA(profileId)).reply(500, error));
      test("should display drop down & error message", async () => {
        const rendered = renderComponent();
        const { updateProfile } = getMockedComponentProps(ProfileDropDown);
        act(() => {
          updateProfile(profileId);
        });
        await waitFor(() => {
          expectMockedComponent(rendered, { ProfileDropDown }, 1);
          expectMockedComponent(rendered, { DialListTable }, 0);
          expectMockedComponent(rendered, { StyledButton }, 0);
          expect(rendered.container).toHaveTextContent(errorMessage);
        });
      });
    });
  });
});