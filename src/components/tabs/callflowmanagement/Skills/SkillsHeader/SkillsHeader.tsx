import {
  ExportButton,
  Header
} from "../Skills.Styles";
import { SkillsHeaderProps } from "../Skills.Interfaces";
import { SkillProfile } from "../../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
import { Dropdown } from "components";
import { SearchBox } from "components/tabs/usermanagement";
import { useAdminState } from "context";
import { TritonProfile } from "globals";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const SkillsHeader = (props: SkillsHeaderProps) => {

  const {
    checked,
    tableState,
    setTableState
  } = props;

  const _export = React.useRef(null);
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
      _export.current.save(checked, columns);
    }
  };

  return (
    <Header>
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
      <ExportButton onClick={handleExport}><ExcelExport ref={_export}/>Export</ExportButton>
    </Header>
  );
};

export default SkillsHeader;

