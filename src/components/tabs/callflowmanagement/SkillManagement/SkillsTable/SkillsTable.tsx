import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  FilterWrapper,
  TableContainer,
  TableText,
  TableIcon
} from "../Skills.Styles";
import { SkillsTableProps } from "../Skills.Interfaces";
import { messageTypes } from "../ClosedFlashMessage/ClosedFlashMessage.Interfaces";
import {
  Circle, ReportProblemOutlined
} from "@mui/icons-material";
import {
  Checkbox, Tooltip
} from "@mui/material";
import { Skill } from "callflowmanagement/Skills.Interfaces";
import React, { ReactElement } from "react";
import {
  useAdminState,
  useSkillState
} from "context/appContext";

export const SkillsTable = (props: SkillsTableProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const allSkillsSelected = tableState.selected.length === tableState.filteredList.length && tableState.filteredList.length > 0;

  // field is the key in the skills object to use  (ie, skillGroups, or profiles)
  const getProfilesDisplayForSkill = (skill: Skill) => {
    const { profiles } = useAdminState().profileContext;

    const itemDivs: ReactElement[] = [];
    skill.profileIds?.map((p: number, index: number) => {
      const profile = profiles.find(pr => pr.profile_id === p) || { profile_name: "Unknown" };
      if(index !== skill.profileIds.length - 1){
        itemDivs.push(<div key={p}>{profile.profile_name}{` - ${p}, `}</div>);
      } else {
        itemDivs.push(<div key={p}>{profile.profile_name}{` - ${p}`}</div>);
      }
    });
    return itemDivs;
  };

  const getSkillGroupDisplayForSkill = (skill: Skill) => {
    const { skillGroups } = useSkillState();

    const itemDivs: ReactElement[] = [];
    skill.skillGroupIds?.map((g: string, index: number) => {
      const skillGroup = skillGroups.find(sg => sg.id === g) || { skill_group_name: "Unknown" };
      if(index !== skill.skillGroupIds.length - 1){
        itemDivs.push(<div key={g}>{skillGroup.skill_group_name}{", "}</div>);
      } else {
        itemDivs.push(<div key={g}>{skillGroup.skill_group_name}{""}</div>);
      }
    });
    return itemDivs;
  };

  const handleSetSelected = (skill: Skill, isSelected: boolean) => {
    if(isSelected){
      setTableState({
        ...tableState,
        selected: tableState.selected.filter(s => s !== skill.name)
      });
    } else {
      setTableState({
        ...tableState,
        selected: [...tableState.selected, skill.name ]
      });
    }
  };


  const handleSelectAll = () => {
    if(allSkillsSelected){
      setTableState({
        ...tableState,
        selected: []
      });
    } else {
      setTableState({
        ...tableState,
        selected: tableState.filteredList.map((s: Skill) => s.name)
      });
    }
  };

  return (
    <TableContainer>
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>
              <Checkbox
                checked={allSkillsSelected}
                onChange={handleSelectAll}
                style={{ padding: "0px" }}
              />
            </CustomTableHeader>
            <CustomTableHeader>SKILL NAME</CustomTableHeader>
            <CustomTableHeader>PROFILES</CustomTableHeader>
            <CustomTableHeader>SKILL GROUP</CustomTableHeader>
            <CustomTableHeader
              onClick={() => setTableState({
                ...tableState,
                [messageTypes.FLASH.filter]: !tableState[messageTypes.FLASH.filter]
              })
              }
            ><FilterWrapper active={tableState[messageTypes.FLASH.filter]}>FLASH</FilterWrapper>
            </CustomTableHeader>
            <CustomTableHeader
              onClick={() => setTableState({
                ...tableState,
                [messageTypes.CLOSED.filter]: !tableState[messageTypes.CLOSED.filter]
              })
              }
            ><FilterWrapper active={tableState[messageTypes.CLOSED.filter]}>CLOSED</FilterWrapper>
            </CustomTableHeader>
            <CustomTableHeader
              onClick={() => setTableState({
                ...tableState,
                discrepancyFilter: !tableState.discrepancyFilter
              })
              }
            ><FilterWrapper active={tableState.discrepancyFilter}>PROBLEMS</FilterWrapper>
            </CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {tableState.filteredList.map((skill: Skill) => {
            const isSelected = tableState.selected.some((s: string) => s === skill.name);
            return (
              <CustomTableRow key={skill.name} selected={isSelected} onClick={() => handleSetSelected(skill, isSelected)}>
                <CustomTableData><TableText>
                  <Checkbox
                    onClick={() => handleSetSelected(skill, isSelected)}
                    checked={isSelected}
                    style={{ padding: "0px" }}
                  />
                </TableText></CustomTableData>
                <CustomTableData><TableText>{skill.name}</TableText></CustomTableData>
                <CustomTableData><TableText>{getProfilesDisplayForSkill(skill).map((d: ReactElement) => d)}</TableText></CustomTableData>
                <CustomTableData><TableText>{getSkillGroupDisplayForSkill(skill).map((d: ReactElement) => d)}</TableText></CustomTableData>
                <CustomTableData>
                  {skill.flashMessage &&
                    <Tooltip
                      placement="right"
                      title={<h1 style={{ fontSize: "15px" }}>{skill.flashMessage}</h1>}>
                      <TableIcon><Circle fontSize="small"/></TableIcon>
                    </Tooltip>
                  }
                </CustomTableData>
                <CustomTableData>
                  {skill.closedMessage &&
                    <Tooltip
                      placement="right"
                      title={<h1 style={{ fontSize: "15px" }}>{skill.closedMessage}</h1>}>
                      <TableIcon><Circle fontSize="small"/></TableIcon>
                    </Tooltip>
                  }
                </CustomTableData>
                <CustomTableData>
                  {skill.discrepancies.length > 0 &&
                    <Tooltip
                      placement="right"
                      title={<h1 style={{ fontSize: "15px" }}>{skill.discrepancies.toString()}</h1>}>
                      <TableIcon><ReportProblemOutlined fontSize="small"/></TableIcon>
                    </Tooltip>
                  }
                </CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
      </CustomTable>
    </TableContainer>
  );
};