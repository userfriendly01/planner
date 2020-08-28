import { OutlinedSelect } from "components";
import PropTypes from "prop-types";
import React from "react";

const ProfileDropDown = props => {
  const {
    availableProfiles,
    profileId,
    updateProfile
  } = props;

  return (
    <div>
      <OutlinedSelect
        label={"Profile"}
        labelWidth={65}
        noBlankValue={profileId === null ? false : true}
        optionsList={availableProfiles}
        optionsDisplayFunc={option => {
          return {
            display: `${option.profile_id} - ${option.profile_nme}`,
            key: option.profile_id,
            value: option.profile_id
          };
        }}
        updateValue={updateProfile}
        value={profileId}
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
