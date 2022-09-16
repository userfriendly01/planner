import {
  ExportButton,
  Header
} from "../Skills.Styles";
import { SkillsHeaderProps } from "../Skills.Interfaces";
import { Dropdown } from "components";
import { SearchBox } from "components/tabs/usermanagement";
import { useAdminState } from "context";
import React from "react";

const SkillsHeader = (props: SkillsHeaderProps) => {

  const {
    selected,
    filteredState,
    setFilteredState
  } = props;

  const _export = React.useRef(null);
  const state = useAdminState();
  const isAdmin = state.userContext.isAdmin;

  const getProfileOptions = () => {
    return state.profileContext.profiles.map((p: any) => {
      return {
        ...p,
        label: p.profile_nme,
        value: p.profile_id
      };
    });
  };

  const handleExport = () => {
    const columns = [
      {
        field: "name",
        title: "Skill Name",
        width: "50px"
      },
      {
        field: "closedMessage",
        title: "Closed Message",
        width: "200px"
      },
      {
        field: "flashMessage",
        title: "Flash Message",
        width: "200px"
      }
    ];
    if (_export.current !== null) {
      _export.current.save(selected, columns);
    }
  };

  return (
    <Header>
      { isAdmin &&
          <Dropdown
            label="Profile Id"
            multiple={true}
            value={filteredState.profiles}
            options={getProfileOptions()}
            updateValue={(event: any, selectedProfiles: any) => setFilteredState({
              ...filteredState,
              profiles: selectedProfiles
            })}
            styles={{ width: "200px" }}
          />
      }
      <SearchBox
        key={"search-box"}
        styles={{ width: "200px" }}
        searchBy={filteredState.searchBy}
        setSearch={(value: string) => {
          setFilteredState({
            ...filteredState,
            searchBy: value
          });
        }}
      />
      <ExportButton onClick={handleExport} >Export</ExportButton>
    </Header>
  );
};

export default SkillsHeader;

