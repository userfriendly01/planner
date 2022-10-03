import {
  Dropdown,
  ExportButton
} from "components";
import {
  StyledHeader,
  SkillsHeaderProps
} from "../";
import { SearchBox } from "components/tabs/usermanagement";
import { useAdminState } from "context";
import { TritonProfile } from "globals";
import React from "react";

const SkillsHeader = (props: SkillsHeaderProps) => {

  const {
    checked,
    tableState,
    setTableState
  } = props;

  const state = useAdminState();
  const isAdmin = state.userContext.isAdmin;

  const getProfileOptions = () => {
    return state.profileContext.profiles.map((p: TritonProfile) => {
      return {
        ...p,
        label: p.profile_nme,
        value: p.profile_id
      };
    });
  };

  return (
    <StyledHeader>
      { isAdmin &&
          <Dropdown
            label="Profile Id"
            multiple={true}
            value={tableState.profiles}
            options={getProfileOptions()}
            updateValue={(event: any, checkedProfiles: TritonProfile[]) => setTableState({
              ...tableState,
              profiles: checkedProfiles
            })}
            styles={{ width: "300px" }}
          />
      }
      <SearchBox
        key={"search-box"}
        styles={{ width: "300px" }}
        searchBy={tableState.searchBy}
        setSearch={(value: string) => {
          setTableState({
            ...tableState,
            searchBy: value
          });
        }}
      />
      <ExportButton checked={checked}/>
    </StyledHeader>
  );
};

export default SkillsHeader;

