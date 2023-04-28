import {
  DropdownOption,
  OuFilterDropdownProps
} from "./OuFilterDropdown.Interfaces";
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
import { getOperatingUnits } from "services";
import { OperatingUnit } from "globals";
//import { sortProfilesById } from "utils";
import {
  Edit,
  Delete
} from "@mui/icons-material";
import { Modal } from "@mui/material";

const OuFilterDropdown = (props: OuFilterDropdownProps) => {
  const {
    filterBy,
    setFilter
  } = props;

  const [operatingUnitList, setOperatingUnitList] = React.useState([]);

  if(!operatingUnitList.length) {
    getOperatingUnits().then((allOUs: OperatingUnit[])  => {
      setOperatingUnitList(allOUs);
    }).catch(error => console.error(error.msg));
  }

  const options: DropdownOption[] = [
    {
      label: "Show All",
      value: "show-all"
    },
    {
      label: "divider",
      value: "divider"
    },
    ...operatingUnitList.map(ou => ({
      label: ou.ou_name,
      value: ou.ou_name
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
        label="OU Dropdown"
        options={options}
        styles= {{ width: 325 }}
        value={options.find((option: DropdownOption) => option.value === filterBy)}
        updateValue={(event: any, newInputValue: any) => {
          if(newInputValue.value === "show-all") {
            setFilter(null);
          } else if(newInputValue.value !== "divider") {
            setFilter(newInputValue.value.toLowerCase());
          }
        }}
        CustomRender={DropdownOption}
      />
    </Wrapper>
  );
};

export default OuFilterDropdown;