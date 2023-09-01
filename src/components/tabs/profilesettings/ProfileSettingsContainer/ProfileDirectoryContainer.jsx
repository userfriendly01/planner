import {
  Directory,
  ProfileDropDown
} from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import {
  logger,
  myAxios,
  sortDirectoryListEntriesByName
} from "utils";
import {
  ProfileSettingsContainerDiv,
  ProfileSettingsMessage
} from "./ProfileSettingsContainer.Styles";

const ProfileDirectoryContainer = () => {
  const initialProfileState = {
    directoryList: [],
    message: "Please select a profile",
    profileId: null
  };

  const [profileSettingsState, setProfileSettingsState] = useState(initialProfileState);

  const state = useAdminState();
  const profilesFromContext = state.profileContext.profiles;

  const fetchProfileInformation = profileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(profileId))
      .then(res => {
        const directoryList = res.data.directories.sort(sortDirectoryListEntriesByName);
        setProfileSettingsState({
          directoryList,
          message: null,
          profileId
        });
      })
      .catch(error => {
        logger.error(
          "Failed to fetch dial list for profile",
          {
            error,
            profileId
          },
          false
        );
        setProfileSettingsState({
          ...initialProfileState,
          message: "Failed to fetch data for selected profile"
        });
      });
  };

  const {
    directoryList,
    message,
    profileId
  } = profileSettingsState;

  return (
    <ProfileSettingsContainerDiv>
      <ProfileDropDown
        availableProfiles={profilesFromContext}
        profileId={profileId}
        updateProfile={fetchProfileInformation}
      />
      {
        profileId !== null && profileId !== ""
          ?
          <div>
            <Directory
              directory={directoryList}
              profileId={profileId}
              refreshProfileData={() => fetchProfileInformation(profileId)}
            />
          </div>
          :
          null
      }
      {
        message
          ?
          <ProfileSettingsMessage data-testid="message">
            <h1>{message}</h1>
          </ProfileSettingsMessage>
          :
          null
      }
    </ProfileSettingsContainerDiv>
  );
};

export default ProfileDirectoryContainer;
