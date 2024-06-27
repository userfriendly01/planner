import { Dropdown } from "components/Dropdown";
import { ExportButton } from "callflowmanagement/ExportButton";
import { SkillsHeaderProps } from "../Skills.Interfaces";
import { StyledHeader } from "../Skills.Styles";
import { SearchBox } from "components/SearchBox";
import { useAdminState } from "context/appContext";
import { TritonProfile } from "globals/interfaces";
import React from "react";

export const SkillsHeader = (props: SkillsHeaderProps) => {

  const {
    tableState,
    setTableState
  } = props;

  const state = useAdminState();
  const { isAdmin } = state.userContext;

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