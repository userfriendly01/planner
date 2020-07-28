import {
  DialListTable,
  ProfileDropDown
} from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import styled from "styled-components";
import { myAxios } from "utils";

const ProfileSettingsContainerDiv = styled.div`
  height: calc(100vh - 96px);
  padding: 1%;
`;

const ProfileSettingsMessage = styled.div`
  margin-top: 25vh;
  text-align: center;
`;

const ProfileSettingsContainer = () => {

  const initialProfileState = {
    profileId: null,
    dialList: []
  };
  const initialMessage = "Please select a profile";
  const [profileSettingsState, setProfileSettingsState] = useState({
    profile: initialProfileState,
    message: initialMessage
  });

  const profilesFromContextMinusGoP = useAdminState().profileContext.profiles.slice(1);

  const fetchProfileDataFromDatabase = newProfileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(newProfileId))
      .then(res => {
        setProfileSettingsState({
          profile: {
            profileId: newProfileId,
            dialList: res.data.diallist
          },
          message: null
        });
      })
      .catch(err => {
        console.error("ProfileSettingsContainer - Failed to get profile data", {
          err,
          newProfileId
        });
        setProfileSettingsState({
          profile: initialProfileState,
          message: `Failed to get data for profile ${newProfileId}.`
        });
      });
  };

  return(
    <ProfileSettingsContainerDiv>
      <ProfileDropDown
        availableProfiles={profilesFromContextMinusGoP}
        profile={profileSettingsState.profile}
        updateProfile={fetchProfileDataFromDatabase}
      />
      {profileSettingsState.profile.profileId !== null && profileSettingsState.profile.profileId !== "" ?
        <DialListTable
          refreshProfileData={() => fetchProfileDataFromDatabase(profileSettingsState.profile.profileId)}
          profile={profileSettingsState.profile}
        />: null}
      <ProfileSettingsMessage data-testid="message">
        <h1>{profileSettingsState.message}</h1>
      </ProfileSettingsMessage>
    </ProfileSettingsContainerDiv>
  );
};

export default ProfileSettingsContainer;
