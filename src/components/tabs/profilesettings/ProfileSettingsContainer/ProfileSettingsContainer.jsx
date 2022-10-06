import {
  DialListTable,
  Directory,
  Dropdown,
  ProfileDropDown,
  ProfileSettingsTable
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

const views = [
  {
    value: "PROFILE_DIRECTORY",
    label: "Profile Directory"
  },
  {
    value: "PROFILE_SETTINGS",
    label: "Profile Settings"
  }
]

const ProfileSettingsContainerDiv = styled.div`
  height: calc(100vh - 96px);
  padding: 1%;
`;

const ProfileSettingsMessage = styled.div`
  margin-top: 25vh;
  text-align: center;
`;

const CallflowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`;

const ProfileSettingsContainer = () => {
  const [ view, setView ] = React.useState(views[0]);

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
      <CallflowWrapper>
        <Dropdown
          label="What would you like to do?"
          value={view}
          options={views}
          updateValue={(event, view) => setView(view)}
          styles={{
            margin: "40 0 60 0",
            width: "500px"
          }}
        />
      </CallflowWrapper>
      {
        view.value === "PROFILE_DIRECTORY"
          ?
          <div>
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
          </div>
          :
          <ProfileSettingsTable 
            profileList={profilesFromContextMinusGoP}
          />
      }
    </ProfileSettingsContainerDiv>
  );
};

export default ProfileSettingsContainer;
