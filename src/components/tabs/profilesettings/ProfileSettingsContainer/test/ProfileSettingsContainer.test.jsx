import ProfileSettingsContainer from "../ProfileSettingsContainer";
import MockAdapter from "axios-mock-adapter";
import {
  DialListTable,
  Directory,
  Dropdown,
  ProfileDropDown,
  ProfileSettingsTable,
  StyledButton,
  ProfileEntryForm
} from "components";
import { Modal } from "@mui/material";
import { initialState } from "context";
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
  waitFor
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components", () => ({
  __esModule: true,
  DialListTable: jest.fn(),
  Directory: jest.fn(),
  ProfileDropDown: jest.fn(),
  Dropdown: jest.fn(),
  ProfileSettingsTable: jest.fn(),
  StyledButton: jest.fn(),
  ProfileEntryForm: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
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
    pingIdentity: {
      sub: "n0138110"
    }
  }
};

const errorMessage = "Failed to fetch data for selected profile";

describe("<ProfileSettingsContainer />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      DialListTable,
      Directory,
      ProfileDropDown,
      Dropdown,
      ProfileSettingsTable,
      StyledButton,
      Modal,
      ProfileEntryForm
    });
  });

  describe("profile.profileId is null (initial state)", () => {
    test("should render ProfileDropDown with correct props and 'Please select a profile'", () => {
      const rendered = render(<ProfileSettingsContainer />, initialTestState);
      expectMockedComponent(rendered, { DialListTable }, 0);
      expectMockedComponent(rendered, { Directory }, 0);
      expectMockedComponent(rendered, { ProfileDropDown }, 1);
      expectMockedComponent(rendered, { Dropdown }, 1);
      expectMockedComponent(rendered, { ProfileSettingsTable }, 0);
      expectMockedComponent(rendered, { Modal }, 1);
      expectMockedComponent(rendered, { ProfileEntryForm }, 0);
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
        ],
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
        const rendered = render(<ProfileSettingsContainer />, initialTestState);
        const { updateProfile } = getMockedComponentProps(ProfileDropDown);
        act(() => {
          updateProfile(profileId);
        });

        const expectsAfterGettingProfileData = () => {
          expectMockedComponent(rendered, { ProfileDropDown }, 1);
          expectMockedComponent(rendered, { DialListTable }, 1);
          expectMockedComponent(rendered, { Directory }, 1);
          expectMockedComponent(rendered, { Dropdown }, 1);
          expectMockedComponent(rendered, { ProfileSettingsTable }, 0);
          expectMockedComponent(rendered, { Modal }, 1);
          expectMockedComponent(rendered, { ProfileEntryForm }, 0);
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
        // also test refreshProfileData passed to DialListTable
        const { refreshProfileData } = getMockedComponentProps(DialListTable, getLastInstanceCalled(DialListTable));
        act(() => {
          refreshProfileData();
        });
        await waitFor(() => {
          expectsAfterGettingProfileData();
        });
        // also test refreshProfileData passed to Directory
        const refreshAgain = getMockedComponentProps(Directory, getLastInstanceCalled(Directory)).refreshProfileData;
        act(() => {
          refreshAgain();
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
        const rendered = render(<ProfileSettingsContainer />, initialTestState);
        const { updateProfile } = getMockedComponentProps(ProfileDropDown);
        act(() => {
          updateProfile(profileId);
        });
        await waitFor(() => {
          expectMockedComponent(rendered, { ProfileDropDown }, 1);
          expectMockedComponent(rendered, { DialListTable }, 0);
          expectMockedComponent(rendered, { Directory }, 0);
          expectMockedComponent(rendered, { Dropdown }, 1);
          expectMockedComponent(rendered, { ProfileSettingsTable }, 0);
          expect(rendered.container).toHaveTextContent(errorMessage);
        });
      });
    });
  });

  describe("Profile Entry Form Modal", () => {
    test("form should not render on initial state", () => {
      const rendered = render(<ProfileSettingsContainer />, initialTestState);
      expectMockedComponent(rendered, { ProfileEntryForm }, 0);
    });
    test("add profile button is shown when dropdown is changed to PROFILE_SETTINGS", () => {
      const rendered = render(<ProfileSettingsContainer />, initialTestState);
      act(() => {
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        updateValue(null, {
          value: "PROFILE_SETTINGS",
          label: "Profile Settings"
        });
      });
      expectMockedComponent(rendered, { StyledButton }, 1);
    });
    test("When ProfileEntryForm handleClose is called, setProfileEntryFormState is set to open === false", () => {
      const rendered = render(<ProfileSettingsContainer />, initialTestState);
      expectMockedComponent(rendered, { ProfileEntryForm }, 0);
      act(() => {
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        updateValue(null, {
          value: "PROFILE_SETTINGS",
          label: "Profile Settings"
        });
      });
      expect(StyledButton.mock.calls[0][0].children).toBe("Add Profile");
      act(() => {
        const onClick = StyledButton.mock.calls[0][0].onClick;
        onClick();
      });
      render(Modal.mock.calls[0][0].children);
      expectMockedComponent(rendered, { ProfileEntryForm }, 1);
      const handleClose = ProfileEntryForm.mock.calls[0][0].handleClose;
      act(() => {
        handleClose();
      });
    });

  });
});