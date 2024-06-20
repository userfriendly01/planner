import { Dropdown } from "components/Dropdown";
import { ExportButton } from "callflowmanagement/ExportButton";
import { SkillEntryButton } from "callflowmanagement/SkillEntryButton";
import { SkillsHeaderProps } from "../Skills.Interfaces";
import { StyledHeader } from "../Skills.Styles";
import { SearchBox } from "components/SearchBox";
import { useAdminState } from "context/appContext";
import { formModes } from "globals";
import { TritonProfile } from "globals/interfaces";
import React from "react";

export const SkillsHeader = (props: SkillsHeaderProps) => {

  const {
    tableState,
    setTableState,
    taskQueues,
    applications,
    timeOfDays
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
      {isAdmin && <SkillEntryButton
        formMode={formModes.INSERT}
        taskQueues={taskQueues}
        applications={applications}
        timeOfDays={timeOfDays}
        isAdmin={isAdmin}
      /> }
      <ExportButton selected={tableState.selected}/>
    </StyledHeader>
  );
};