import {
  DropdownOption,
  ProfileFilterDropDownProps
} from "./ProfileFilterDropdown.Interfaces";
import {
  Label,
  Wrapper
} from "./ProfileFilterDropdown.Styles";
import {
  Dropdown
} from "components";
import { useAdminState } from "context";
import React from "react";
import { sortProfilesById } from "utils";

const ProfileFilterDropdown = (props: ProfileFilterDropDownProps) => {
  const {
    filterBy,
    setFilter
  } = props;

  const state = useAdminState();
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
      value: typeof profile.profile_id === "number" ? profile.profile_id.toString() : profile.profile_id,
      ...profile  //TODO - do we need this
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
        styles= {{ width: 325 }}
        value= {filterBy ? options.find((option: DropdownOption) => {
          if(option.value === filterBy){
            return option.label;
          }
        }) : ""}
        updateValue={(event: any, newInputValue: any) => {
          if(newInputValue.value === "show-all") {
            setFilter(null);
          } else if(newInputValue.value !== "divider") {
            setFilter(newInputValue.value);
          }
        }}
        CustomRender={DropdownOption}
      />
    </Wrapper>
  );
};

export default ProfileFilterDropdown;