import {
  DialListTable,
  ProfileDropDown
} from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import styled from "styled-components";
import {
  myAxios,
  sortDialListEntriesByName
} from "utils";

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
    dialList: [],
    message: "Please select a profile",
    profileId: null
  };
  const [profileSettingsState, setProfileSettingsState] = useState(initialProfileState);

  const profilesFromContextMinusGoP = useAdminState().profileContext.profiles.slice(1);

  const fetchDialListForProfile = profileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(profileId))
      .then(res => {
        const dialList = [...res.data.diallist].sort(sortDialListEntriesByName);
        setProfileSettingsState({
          dialList,
          message: null,
          profileId
        });
        console.log("Fetched dial list for profile", {
          dialList,
          profileId
        });
      })
      .catch(err => {
        console.error("Failed to fetch dial list for profile", {
          err,
          profileId
        });
        setProfileSettingsState({
          ...initialProfileState,
          message: `Failed to fetch data for selected profile with ID: ${profileId}`
        });
      });
  };

  const {
    dialList,
    message,
    profileId
  } = profileSettingsState;

  return(
    <ProfileSettingsContainerDiv>
      <ProfileDropDown
        availableProfiles={profilesFromContextMinusGoP}
        profileId={profileId}
        updateProfile={fetchDialListForProfile}
      />
      {profileId !== null && profileId !== "" ?
        <DialListTable
          refreshProfileData={() => fetchDialListForProfile(profileId)}
          dialList={dialList}
          profileId={profileId}
        />: null}
      <ProfileSettingsMessage data-testid="message">
        <h1>{message}</h1>
      </ProfileSettingsMessage>
    </ProfileSettingsContainerDiv>
  );
};

export default ProfileSettingsContainer;
