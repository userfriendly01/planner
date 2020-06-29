import { ProfileDropDown } from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import { myAxios } from "utils";

const ProfileSettingsContainer = () => {

  const [profile, setProfile] = useState({
    profileId: null,
    dialList: []
  });

  console.log("profile in state:", profile);

  const profilesFromContextMinusGoP = useAdminState().profileContext.profiles.slice(1);

  const updateProfile = newProfileId => {
    myAxios.get(apiPaths.GET_PROFILE_DATA(newProfileId))
      .then(res => {
        setProfile({
          profileId: newProfileId,
          dialList: res.data.contacts
        });
      });
    return profile;
  };

  const listContacts = profile.dialList.map(contact => <li key={contact.contact_id}>{contact.contact_nme}: {contact.contact_num}</li>);

  return(
    <div>
      <ProfileDropDown
        availableProfiles={profilesFromContextMinusGoP}
        profile={profile}
        updateProfile={updateProfile}
      />
      {profile.profileId === null ? <h1>Please select a profile</h1> : <ul>{listContacts}</ul>}
    </div>
  );
};

export default ProfileSettingsContainer;
