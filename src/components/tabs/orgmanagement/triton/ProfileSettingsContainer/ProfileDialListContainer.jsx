import { DialListTable } from "orgmanagement/DialListTable";
import { ProfileDropDown } from "orgmanagement/ProfileDropDown";
import { useAdminState } from "context/appContext";
import { apiPaths } from "globals/index";
import React, { useState } from "react";
import { sortDialListEntriesByName } from "utils/_sortUtils";
import { myAxios } from "utils/myAxios";
import { logger } from "utils/logger";
import {
  ProfileSettingsContainerDiv,
  ProfileSettingsMessage
} from "./ProfileSettingsContainer.Styles";

export const ProfileDialListContainer = () => {
  const initialProfileState = {
    dialList: [],
    message: "Please select a profile",
    profileId: null
  };

  const [profileSettingsState, setProfileSettingsState] = useState(initialProfileState);

  const state = useAdminState();
  const profilesFromContext = state.profileContext.profiles;

  const fetchProfileInformation = profileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(profileId))
      .then(res => {
        const dialList = res.data.diallist.sort(sortDialListEntriesByName);
        setProfileSettingsState({
          dialList,
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
    dialList,
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
          <DialListTable
            dialList={dialList}
            profileId={profileId}
            refreshProfileData={() => fetchProfileInformation(profileId)}
          />
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