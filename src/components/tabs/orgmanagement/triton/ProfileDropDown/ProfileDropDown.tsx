import { Dropdown } from "components/Dropdown";
import { useAdminState } from "context/appContext";
import { UMSoftphoneConfiguration } from "globals/interfaces";
import React from "react";
import { sortProfilesById } from "utils/_sortUtils";

interface ProfileDropDownProps {
    selectedProfile: number,
    setSelectedProfile: (value: number) => void
}

export const ProfileDropDown = (props: ProfileDropDownProps) => {
  const {
    selectedProfile,
    setSelectedProfile
  } = props;

  const { profiles } = useAdminState().profileContext;

  const getValue = () => {
    const profile: UMSoftphoneConfiguration = profiles.find(p => p.profile_id === selectedProfile);
    return profile ? {
      label: `${profile.profile_id} - ${profile.profile_name}`,
      value: profile.profile_id
    } : "";
  };

  return (
    <div>
      <Dropdown
        label={"Profile"}
        options={profiles.sort(sortProfilesById).map(profile => ({
          label: `${profile.profile_id} - ${profile.profile_name}`,
          value: profile.profile_id,
          ...profile
        }))}
        updateValue={(event: any, newInput: any) => setSelectedProfile(newInput.value)}
        value={getValue()}
      />
    </div>
  );
};