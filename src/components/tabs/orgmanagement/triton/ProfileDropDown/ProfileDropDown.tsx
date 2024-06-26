import { Dropdown } from "components/Dropdown";
import React from "react";
import { sortProfilesById } from "utils/_sortUtils";

interface ProfileDropDownProps {
    availableProfiles: any[],
    profileId: string | number,
    updateProfile: (value: any) => void
}

export const ProfileDropDown = (props: ProfileDropDownProps) => {
  const {
    availableProfiles,
    profileId,
    updateProfile
  } = props;

  const getValue = () => {
    const profile = availableProfiles.find(p => p.profile_id === profileId);
    return profile ? {
      label: `${profile.profile_id} - ${profile.profile_name}`,
      value: profileId
    } : "";
  };

  return (
    <div>
      <Dropdown
        label={"Profile"}
        options={availableProfiles.sort(sortProfilesById).map(profile => ({
          label: `${profile.profile_id} - ${profile.profile_name}`,
          value: profile.profile_id,
          ...profile
        }))}
        updateValue={(event: any, newInput: any) => updateProfile(newInput.value)}
        value={getValue()}
      />
    </div>
  );
};