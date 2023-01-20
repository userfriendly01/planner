import {
  Dropdown,
  ExportButton
} from "components";
import { SkillsHeaderProps } from "../Skills.Interfaces";
import { StyledHeader } from "../Skills.Styles";
import { getAuthenticationProfileTemplates } from "authentication";
import { SearchBox } from "components";
import { useAdminState } from "context";
import { TritonProfile } from "globals";
import React from "react";

const SkillsHeader = (props: SkillsHeaderProps) => {

  const {
    tableState,
    setTableState
  } = props;

  const state = useAdminState();
  const tritonProfile = state.userContext.authenticationProfiles.find((p: any) => p.name === getAuthenticationProfileTemplates().TRITON.name);
  const isAdmin = tritonProfile.isAdmin;

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
      <ExportButton selected={tableState.selected}/>
    </StyledHeader>
  );
};

export default SkillsHeader;

