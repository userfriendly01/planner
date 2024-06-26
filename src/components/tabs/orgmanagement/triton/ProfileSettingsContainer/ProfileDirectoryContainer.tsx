import { Directory } from "orgmanagement/Directory";
import { ProfileDropDown } from "orgmanagement/ProfileDropDown";
import { useAdminState } from "context/appContext";
import { apiPaths } from "globals";
import React, { useState } from "react";
import { logger } from "utils/logger";
import { myAxios } from "utils/myAxios";
import { sortDirectoryListEntriesByName } from "utils/_sortUtils";
import {
  ProfileSettingsContainerDiv,
  ProfileSettingsMessage
} from "./ProfileSettingsContainer.Styles";

export interface InitialProfileStateProps {
  directoryList: any[],
  message: string,
  profileId?: number | string
}

const ProfileDirectoryContainer = () => {
  const initialProfileState: InitialProfileStateProps = {
    directoryList: [],
    message: "Please select a profile",
    profileId: null
  };

  const [profileSettingsState, setProfileSettingsState] = useState(initialProfileState);

  const state = useAdminState();
  const profilesFromContext = state.profileContext.profiles;

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
        updateProfile={() => "Faith"}
      />
      {
        profileId !== null && profileId !== ""
          ?
          <div>
            <Directory
              directory={directoryList}
              profileId={profileId}
              refreshProfileData={() => "Faith"}
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
