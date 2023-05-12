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
import React, { useState } from "react";
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
        // styles= {{ width: 325 }}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}

        multiple={true}
        value= {filterBy}
        // value= {filterBy ? options.find((option: DropdownOption) => {
        //   if(option.value === filterBy){
        //     return option.label;
        //   }
        // }) : ""}
        updateValue={(event: any, optionsArray: any[]) => {
          if(optionsArray.find( (o: any) => o.value === "show-all")){
            setFilter([]);
          } else if(optionsArray.find( (o: any) => o.value !== "divider")) {
            console.log("NewInput!", optionsArray);
            setFilter(optionsArray);
          }
        }}
        CustomRender={DropdownOption}
      />
    </Wrapper>
  );
};

export default ProfileFilterDropdown;