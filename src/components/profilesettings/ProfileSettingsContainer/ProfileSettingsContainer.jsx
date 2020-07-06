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
  const [state, setState] = useState({
    profile: initialProfileState,
    message: "Please select a profile"
  });

  const profilesFromContextMinusGoP = useAdminState().profileContext.profiles.slice(1);

  const updateProfile = newProfileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(newProfileId))
      .then(res => {
        setState({
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
        setState({
          profile: initialProfileState,
          message: `Failed to get data for profile ${newProfileId}.`
        });
      });
  };

  return(
    <div>
      <ProfileDropDown
        availableProfiles={profilesFromContextMinusGoP}
        profile={state.profile}
        updateProfile={updateProfile}
      />
      {state.profile.profileId !== null ? <DialListTable dialList={state.profile.dialList} /> : null}
      <h1 data-testid="message">{state.message}</h1>
    </div>
  );
};

export default ProfileSettingsContainer;
