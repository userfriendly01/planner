import React from "react";
import { Dropdown } from "components/Dropdown";
import { getAccessGroup } from "services/accessGroup";
import { AccessGroup } from "globals/interfaces";
import {
  AccessGroupDropdownRowItem,
  IconButtonWrapper,
  ProfileDropdownRow
} from "./ProfileEntryForm.Styles";
import { Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";
import { ProfileAccessGroupFieldProps } from "./ProfileEntryForm.Interfaces";

export const ProfileAccessGroupField = (props: ProfileAccessGroupFieldProps) => {

  const {
    enableDropDown,
    accessGroupId,
    setAccessGroupId
  } = props;

  const [accessGroupDropDownOptions, setAccessGroupDropDownOptions] = React.useState([]);
  const [accessGroupList, setAccessGroupList] = React.useState([]);
  const [selectedAccessGroup, setSelectedAccessGroup] = React.useState({
    value: -1,
    label: ""
  });

  React.useEffect(() => {
    getAccessGroup().then((agList: AccessGroup[]) => {
      setAccessGroupList(agList);
      setAccessGroupDropDownOptions(getAccessGroupOptions(agList));
      if(accessGroupId){
        const ag: AccessGroup = agList.find(accessGroup => accessGroup.access_group_id === accessGroupId);
        setSelectedAccessGroup({
          label: ag?.access_group_nme,
          value: ag?.access_group_id
        });
      }
    });
  }, []);

  React.useEffect(() => {
    if(!accessGroupId) {
      setSelectedAccessGroup({
        value: -1,
        label: ""
      });
    }
  }, [accessGroupId, enableDropDown]);

  const getAccessGroupOptions = (optionsList: AccessGroup[]) => {
    return optionsList.map(ag => ({
      label: ag.access_group_nme,
      value: ag.access_group_id
    }));
  };

  const updateSelectedAccessGroup = (event: any, selectedOption: { label: string; value: number; }) => {
    setSelectedAccessGroup(selectedOption);
    setAccessGroupId(selectedOption.value);
  };

  return (
    <ProfileDropdownRow>
      <AccessGroupDropdownRowItem>
        <Dropdown
          label="Access Groups *"
          disabled={!enableDropDown}
          styles={{
            "width": "385px",
            "margin": "5px 0"
          }}
          multiple={false}
          value={selectedAccessGroup}
          options={accessGroupDropDownOptions}
          updateValue={updateSelectedAccessGroup}
        />
      </AccessGroupDropdownRowItem>
      <AccessGroupDropdownRowItem>
        <IconButtonWrapper data-testid="tooltip-profileAccessGroup-button">
          <Tooltip key={"accessGroupTooltip"} placement="top" title={<span style={{ whiteSpace: "pre-line" }}>{ accessGroupList.map(ag => `${ag.access_group_nme} [${ag.viewable_profiles?.map((v: any) => v.profile_id+" - "+v.name).join(", ") || "NO PROFILES ADDED"}]\n\n`) }</span>}>
            <Info fontSize={"inherit"} />
          </Tooltip>
        </IconButtonWrapper>
      </AccessGroupDropdownRowItem>
    </ProfileDropdownRow>
  );
};