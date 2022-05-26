import { Dropdown } from "components";
import PropTypes from "prop-types";
import React from "react";

const ProfileDropDown = props => {
  const {
    availableProfiles,
    profileId,
    updateProfile
  } = props;

  console.log("Available Profiles", availableProfiles);

  return (
    <div>
      <Dropdown
        label={"Profile"}
        options={availableProfiles.map(profile => ({
          label: `${profile.profile_id} - ${profile.profile_nme}`,
          value: profile.profile_id,
          ...profile
        }))}
        updateValue={(event, newInput) => updateProfile(newInput.value)}
        value={{
          label: profileId ? profileId.toString(): "",
          value: profileId || ""
        }}
      />
    </div>
  );
};

ProfileDropDown.propTypes = {
  availableProfiles: PropTypes.arrayOf(PropTypes.object),
  profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateProfile: PropTypes.func.isRequired
};

export default ProfileDropDown;
