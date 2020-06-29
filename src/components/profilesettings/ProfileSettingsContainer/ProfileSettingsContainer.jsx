import { ProfileDropDown } from "components";
import { useAdminState } from "context";
import React, { useState } from "react";

const ProfileSettingsContainer = () => {

  const [profile, setProfile] = useState({
    profileId: null,
    dialList: []
  });

  console.log("profile in state:", profile);

  const profilesFromContextMinusGoP = useAdminState().profileContext.profiles.slice(1);

  // loop thru profilesFromContextMinusGoP & get contacts for each one; add this to the state??

  const updateProfile = newProfileId => {
    const newProfile = profilesFromContextMinusGoP.find(p => p.profile_id === +newProfileId);
    setProfile({
      profileId: newProfileId,
      dialList: [
        {
          contact_id: 16,
          contact_nme: "Bo Jackson",
          contact_num: "800-123-4567"
        },
        {
          contact_id: 18,
          contact_nme: "Daryl Strawberry",
          contact_num: "800-123-4567"
        }
      ]
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