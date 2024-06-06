import { Dropdown } from "components/Dropdown";
import PropTypes from "prop-types";
import React from "react";
import { sortProfilesById } from "utils/_sortUtils";

export const ProfileDropDown = props => {
  const {
    availableProfiles,
    profileId,
    updateProfile
  } = props;

  const getValue = () => {
    const profile = availableProfiles.find(p => p.profile_id === profileId);
    return profile ? {
      label: `${profile.profile_id} - ${profile.profile_nme}`,
      value: profileId
    } : "";
  };

  return (
    <div>
      <Dropdown
        label={"Profile"}
        options={availableProfiles.sort(sortProfilesById).map(profile => ({
          label: `${profile.profile_id} - ${profile.profile_nme}`,
          value: profile.profile_id,
          ...profile
        }))}
        updateValue={(event, newInput) => updateProfile(newInput.value)}
        value={getValue()}
      />
    </div>
  );
};

ProfileDropDown.propTypes = {
  availableProfiles: PropTypes.arrayOf(PropTypes.object),
  profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateProfile: PropTypes.func.isRequired
};