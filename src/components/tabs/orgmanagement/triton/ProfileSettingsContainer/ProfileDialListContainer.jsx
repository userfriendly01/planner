import {
  DialListTable,
  ProfileDropDown
} from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import {
  logger,
  myAxios,
  sortDialListEntriesByName
} from "utils";
import {
  ProfileSettingsContainerDiv,
  ProfileSettingsMessage
} from "./ProfileSettingsContainer.Styles";

const ProfileDialListContainer = () => {
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

export default ProfileDialListContainer;
