import {
  DropdownOption,
  ProfileDropDownProps
} from "./ProfileDropdown.Interfaces";
import {
  Label,
  IconWrapper,
  Wrapper
} from "../ManagerDropdown/ManagerDropdown.Styles"; // TODO: chnage to local style file
import {
  // ManagerModal,
  // ManagerDelete,
  Dropdown
} from "components";
import { useAdminState } from "context";
import React, { useState } from "react";
import { sortProfilesById } from "utils";
import {
  Edit,
  Delete
} from "@mui/icons-material";
import { Modal } from "@mui/material";

const ProfileDropdown = (props: ProfileDropDownProps) => {
  const {
    filterBy,
    setFilter
  } = props;

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const sortedProfiles = [ ...profiles ].sort(sortProfilesById);
  //   const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  //   const [isManagerDeleteOpen, setIsManagerDeleteOpen] = useState(false);
  const [ selectedProfile, setSelectedProfile ] = useState(null);
  console.log("Profile dropdown filterBy!", filterBy);

  //   const handleOpenManager = () => {
  //     setIsManagerModalOpen(true);
  //   };

  //   const handleEditManager = async (option: DropdownOption) => {
  //     setFilter(option.value);
  //     setSelectedManager(managers.find(manager => manager.manager_n_number === option.value));
  //     setIsManagerModalOpen(true);
  //   };

  //   const handleOpenDeleteManager = async (option: DropdownOption) => {
  //     setFilter(option.value);
  //     setSelectedManager(managers.find(manager => manager.manager_n_number === option.value));
  //     setIsManagerDeleteOpen(true);
  //   };

  //   const handleCloseManager = () => {
  //     setSelectedManager(null);
  //     setFilter(null);
  //     setIsManagerModalOpen(false);
  //     setIsManagerDeleteOpen(false);
  //   };

  //   const handleCloseManagerDelete = () => {
  //     setSelectedManager(null);
  //     setFilter(null);
  //     setIsManagerDeleteOpen(false);
  //   };

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
      value: profile.profile_nme,
      ...profile
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
        value={options.find((option: DropdownOption) => option.value === filterBy)}
        updateValue={(event: any, newInputValue: any) => {
          console.log("here!", newInputValue);
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

export default ProfileDropdown;