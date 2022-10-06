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
import { Checkbox } from "@mui/material";
import { Circle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Skill } from "globals";
import React, { ReactElement } from "react";

const SkillsTable = (props: SkillsTableProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const allSkillsSelected = tableState.selected.length === tableState.filteredList.length && tableState.filteredList.length > 0;

  const getProfilesForSkill = (skill: Skill) => {
    const profileDivs: ReactElement[] = [];
    skill.profiles?.map((p: any, index: number) => {
      if(index !== skill.profiles.length - 1){
        profileDivs.push(<div>{p.profileName} - {p.profileId}, </div>);
      } else {
        profileDivs.push(<div>{p.profileName} - {p.profileId}</div>);
      }
    });
    return profileDivs;
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
                <CustomTableData><TableText>{getProfilesForSkill(skill).map((d: ReactElement) => d)}</TableText></CustomTableData>
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

export default SkillsTable;