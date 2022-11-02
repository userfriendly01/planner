import {
  DialListTable,
  Directory,
  Dropdown,
  ProfileDropDown,
  ProfileSettingsTable
} from "components";
import {
  useAdminState,
  ProfileEntryFormStateProvider
} from "context";
import { apiPaths } from "globals";
import { Modal } from "@mui/material";
import React, { useState } from "react";
import {
  myAxios,
  sortDialListEntriesByName,
  sortDirectoryListEntriesByName,
  profileSettingsViews,
  checkIfPO
} from "utils";
import {
  ProfileSettingsDropdownWrapper,
  ProfileSettingsContainerDiv,
  ProfileSettingsMessage,
  SettingsContainer,
  ControlsWrapper,
  ControlItem,
  AddProfileButton
} from "./ProfileSettingsContainer.Styles";
import { ProfileEntryForm } from "components";

const ProfileSettingsContainer = () => {
  const [ view, setView ] = React.useState(profileSettingsViews[0]);

  const initialProfileState = {
    dialList: [],
    directoryList: [],
    message: "Please select a profile",
    profileId: null
  };
  
  const initialProfileModalState = {
    open: false
  };

  const [profileSettingsState, setProfileSettingsState] = useState(initialProfileState);
  const [profileModalState, setProfileModalState] = useState(initialProfileModalState);

  const profilesFromContextMinusGoP = useAdminState().profileContext.profiles.filter(({ profile_id }) => profile_id !== 0);
  const loggedInRepNNumber = useAdminState().userContext.pingIdentity.sub;

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

  const addProfileOnClick = () => setProfileModalState({
    open: true
  });

  return(
    <ProfileEntryFormStateProvider>
      <ProfileSettingsContainerDiv>
        <Modal onClose={() => { return; }} open={profileModalState.open}>
          <ProfileEntryForm
            handleClose={() => setProfileModalState(initialProfileModalState)}
          />
        </Modal>
        <ProfileSettingsDropdownWrapper>
          <Dropdown
            label="What would you like to do?"
            value={view}
            options={profileSettingsViews}
            updateValue={(event, view) => setView(view)}
            styles={{
              margin: "40 0 60 0",
              width: "500px"
            }}
          />
        </ProfileSettingsDropdownWrapper>
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
              <SettingsContainer>
                {
                  checkIfPO(loggedInRepNNumber) ?
                    <ControlsWrapper>
                      <ControlItem>
                        <AddProfileButton onClick={addProfileOnClick} data-testid={"add-profile-button"}>
                          Add Profile
                        </AddProfileButton>
                      </ControlItem>
                    </ControlsWrapper>
                  : null
                }
                <ProfileSettingsTable
                  profileList={profilesFromContextMinusGoP}
                  loggedInRep={loggedInRepNNumber}
                  setProfileModalState={setProfileModalState}
                />
              </SettingsContainer>
        }
      </ProfileSettingsContainerDiv>
    </ProfileEntryFormStateProvider>
  );
};

export default ProfileSettingsContainer;
