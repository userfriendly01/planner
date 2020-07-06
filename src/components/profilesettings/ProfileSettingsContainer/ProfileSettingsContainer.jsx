import {
  DialListTable,
  ProfileDropDown
} from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import { myAxios } from "utils";

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

  const updateProfile = newProfileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(newProfileId))
      .then(res => {
        setProfileSettingsState({
          profile: {
            profileId: newProfileId,
            dialList: res.data.contacts
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
    <div>
      <ProfileDropDown
        availableProfiles={profilesFromContextMinusGoP}
        profile={profileSettingsState.profile}
        updateProfile={updateProfile}
      />
      {profileSettingsState.profile.profileId !== null && profileSettingsState.profile.profileId !== "" ?
        <DialListTable
          profile={profileSettingsState.profile}
          setProfileSettingsState={setProfileSettingsState}
        /> : null}
      <h1 data-testid="message">{profileSettingsState.message}</h1>
    </div>
  );
};

export default ProfileSettingsContainer;
