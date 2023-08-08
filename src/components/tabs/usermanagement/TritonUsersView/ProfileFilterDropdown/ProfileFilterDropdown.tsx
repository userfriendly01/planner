import {
  Label,
  Wrapper
} from "./ProfileFilterDropdown.Styles";
import {
  Dropdown
} from "components";
import {
  useAdminState, useAdminDispatch
} from "context";
import React from "react";
import { sortProfilesById } from "utils";

export interface DropdownOption {
  label: string,
  value: any
}

const ProfileFilterDropdown = () => {
  const state = useAdminState();
  const filterBy = state.userManagementTableFilters.profileFilterArray;
  const dispatch = useAdminDispatch();
  const profiles = state.profileContext.profiles;
  const sortedProfiles = [ ...profiles ].sort(sortProfilesById);

  const options: DropdownOption[] = [
    {
      label: "Show All",
      value: "show-all"
    },
    {
      label: "divider",
      value: "divider"
    },
    ...sortedProfiles.map(profile => ({
      label: `${profile.profile_id} - ${profile.profile_nme}`,
      value: typeof profile.profile_id === "number" ? profile.profile_id.toString() : profile.profile_id
    }))
  ];

  const DropdownOption = (props: any) => {
    const {
      option
    } = props;

    return (
      <Wrapper>
        { option.label === "Show All" || option.label === "divider"
          ? option.label
          : <Wrapper>
            <Label>
              {option.label}
            </Label>
          </Wrapper>
        }
      </Wrapper>
    );
  };

  return (
    <Wrapper>
      <Dropdown
        label="Profile Dropdown"
        options={options}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}
        multiple={true}
        value= {filterBy}
        updateValue={(event: any, optionsArray: any[]) => {
          if (optionsArray.length === 0 || optionsArray.find( (o: any) => o.value === "show-all")) {
            dispatch({
              type: "updateProfileFilter",
              payload: []
            });
          } else if (optionsArray.find( (o: any) => o.value !== "divider")) {
            dispatch({
              type: "updateProfileFilter",
              payload: optionsArray
            });
          }
        }}
        CustomRender={DropdownOption}
      />
    </Wrapper>
  );
};

export default ProfileFilterDropdown;