import { OutlinedSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const ProfileDropDown = props => {
  const {
    availableProfiles,
    profile,
    updateProfile
  } = props;

  return (
    <OutlinedSelect
      label={"Profile"}
      labelWidth={65}
      noBlankValue={profile.profileId === null ? false : true}
      optionsList={availableProfiles}
      optionsDisplayFunc={option => {
        return {
          display: `${option.profile_id} - ${option.profile_nme}`,
          key: option.profile_id,
          value: option.profile_id
        };
      }}
      updateValue={updateProfile}
      value={profile.profileId}
    />
  );
};

ProfileDropDown.propTypes = {
  availableProfiles: PropTypes.arrayOf(PropTypes.object),
  profile: PropTypes.object,
  updateProfile: PropTypes.func.isRequired
};

export default ProfileDropDown;
