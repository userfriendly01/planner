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
import { Circle } from "@mui/icons-material";
import {
  Checkbox, Tooltip
} from "@mui/material";
import { Skill } from "callflowmanagement/Skills.Interfaces";
import React, { ReactElement } from "react";

export const SkillsTable = (props: SkillsTableProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const allSkillsSelected = tableState.selected.length === tableState.filteredList.length && tableState.filteredList.length > 0;

  // field is the key in the skills object to use  (ie, skillGroups, or profiles)
  const getItemsDisplayForSkill = (skill: Skill, field: string, id: string, displayName: string, displayId: boolean) => {
    const itemDivs: ReactElement[] = [];
    skill[field]?.map((p: any, index: number) => {
      if(index !== skill[field].length - 1){
        itemDivs.push(<div key={parseInt(p[id])}>{p[displayName]}{displayId ? ` - ${p[id]}, ` : ", "}</div>);
      } else {
        itemDivs.push(<div key={parseInt(p[id])}>{p[displayName]}{displayId ? ` - ${p[id]}` : ""}</div>);
      }
    });
    return itemDivs;
  };

  const handleSetSelected = (skill: Skill, isSelected: boolean) => {
    if(isSelected){
      setTableState({
        ...tableState,
        selected: tableState.selected.filter(s => s.name !== skill.name)
      });
    } else {
      setTableState({
        ...tableState,
        selected: [...tableState.selected, skill ]
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
        selected: tableState.filteredList
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
          </tr>
        </thead>
        <tbody>
          {tableState.filteredList.map((skill: Skill) => {
            const isSelected = tableState.selected.some((s: Skill) => s.name === skill.name);
            return (
              <CustomTableRow key={skill.name}  selected={isSelected} onClick={() => handleSetSelected(skill, isSelected)}>
                <CustomTableData><TableText>
                  <Checkbox
                    onClick={() => handleSetSelected(skill, isSelected)}
                    checked={isSelected}
                    style={{ padding: "0px" }}
                  />
                </TableText></CustomTableData>
                <CustomTableData><TableText>{skill.name}</TableText></CustomTableData>
                <CustomTableData><TableText>{getItemsDisplayForSkill(skill, "profiles", "profileId", "profileName", true).map((d: ReactElement) => d)}</TableText></CustomTableData>
                <CustomTableData><TableText>{getItemsDisplayForSkill(skill, "ctmSkillGroups", "skillGroupId", "skillGroupNme", false).map((d: ReactElement) => d)}</TableText></CustomTableData>
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
              </CustomTableRow>
            );
          })}
        </tbody>
      </CustomTable>
    </TableContainer>
  );
};