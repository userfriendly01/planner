import {
  DialListTable,
  Directory,
  ProfileDropDown
} from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import styled from "styled-components";
import {
  myAxios,
  sortDialListEntriesByName,
  sortDirectoryListEntriesByName
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
    directoryList: [],
    message: "Please select a profile",
    profileId: null
  };
  const [profileSettingsState, setProfileSettingsState] = useState(initialProfileState);

  const profilesFromContextMinusGoP = useAdminState().profileContext.profiles.filter(({ profile_id }) => profile_id !== 0);

  const fetchProfileInformation = profileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(profileId))
      .then(res => {
        const dialList = res.data.diallist.sort(sortDialListEntriesByName);
        const directoryList = res.data.directories.sort(sortDirectoryListEntriesByName);
        setProfileSettingsState({
          dialList,
          directoryList,
          message: null,
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
          message: "Failed to fetch data for selected profile"
        });
      });
  };

  const {
    dialList,
    directoryList,
    message,
    profileId
  } = profileSettingsState;

  return(
    <ProfileSettingsContainerDiv>
      <ProfileDropDown
        availableProfiles={profilesFromContextMinusGoP}
        profileId={profileId}
        updateProfile={fetchProfileInformation}
      />
      {
        profileId !== null && profileId !== ""
          ?
          <div>
            <DialListTable
              dialList={dialList}
              profileId={profileId}
              refreshProfileData={() => fetchProfileInformation(profileId)}
            />
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

export default ProfileSettingsContainer;
