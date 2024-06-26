import ProfileDirectoryContainer from "../ProfileDirectoryContainer";
import MockAdapter from "axios-mock-adapter";
import { StyledButton } from "components/StyledButton";
import { Directory } from "orgmanagement/Directory";
import { ProfileDropDown } from "orgmanagement/ProfileDropDown";
import { useAdminState } from "context/appContext";
import { apiPaths } from "globals";
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

jest.mock("orgmanagement/Directory", () => ({
  Directory: jest.fn()
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
    profile_name: "test1",
    profile_id: 1
  },
  {
    profile_name: "test2",
    profile_id: 2
  },
  {
    profile_name: "test3",
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

describe("<ProfileDirectoryContainer />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Directory,
      ProfileDropDown,
      StyledButton
    });
  });

  const renderComponent = () => {
    return render(<ProfileDirectoryContainer />);
  };

  describe("profile.profileId is null (initial state)", () => {
    test("should render ProfileDropDown with correct props and 'Please select a profile'", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { Directory }, 0);
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
        directories: [
          {
            directory_id: 42,
            first_nme: "Mo",
            last_nme: "Vaugh",
            phone_num: "800-123-4568"
          },
          {
            directory_id: 6,
            first_nme: "Johnny",
            last_nme: "Pesky",
            phone_num: "800-123-4568"
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
          expectMockedComponent(rendered, { Directory }, 1);
          expectMockedComponent(rendered, { StyledButton }, 0);
          expectOnlyPassedProps(Directory, {
            // sorted directory
            directory: [
              {
                directory_id: 6,
                first_nme: "Johnny",
                last_nme: "Pesky",
                phone_num: "800-123-4568"
              },
              {
                directory_id: 42,
                first_nme: "Mo",
                last_nme: "Vaugh",
                phone_num: "800-123-4568"
              }
            ],
            profileId
          }, getLastInstanceCalled(Directory));
          expect(rendered.container).not.toHaveTextContent(errorMessage);
        };

        await waitFor(() => {
          expectsAfterGettingProfileData();
        });

        const refreshProfileData = getMockedComponentProps(Directory, getLastInstanceCalled(Directory)).refreshProfileData;
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
          expectMockedComponent(rendered, { Directory }, 0);
          expect(rendered.container).toHaveTextContent(errorMessage);
        });
      });
    });
  });
});