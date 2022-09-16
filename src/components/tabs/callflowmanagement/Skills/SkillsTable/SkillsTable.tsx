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
import { messageTypes } from "../../ClosedFlashMessage/ClosedFlashMessage.Interfaces";
import { Checkbox } from "@mui/material";
import {
  Block,
  FlashOn
} from "@mui/icons-material";
import { Skill } from "globals";
import React from "react";

const SkillsTable = (props: SkillsTableProps) => {
  const {
    filteredState,
    selected,
    setSelected,
    setFilteredState
  } = props;

  const allSkillsSelected = selected.length === filteredState.filteredList.length && filteredState.filteredList.length > 0;

  const getProfilesForSkill = (skill: any) => {
    const profileDivs: any = [];
    skill.profiles?.map((p: any, index: number) => {
      if(index !== filteredState.filteredList.length - 1){
        profileDivs.push(<div>{p.profileName} - {p.profileId}</div>);
      } else {
        profileDivs.push(<div>{p.profileName} - {p.profileId},</div>);
      }
    });
    return profileDivs;
  };

  const handleSetSelected = (skill: any, isSelected: boolean) => {
    if(isSelected){
      setSelected(selected.filter(s => s.name !== skill.name));
    } else {
      setSelected([...selected, skill ]);
    }
  };

  const handleSelectAll = () => {
    if(allSkillsSelected){
      setSelected([]);
    } else {
      setSelected(filteredState.filteredList);
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
              onClick={() => setFilteredState({
                ...filteredState,
                [messageTypes.FLASH.variable]: !messageTypes.FLASH.variable
              })
              }
            ><FilterWrapper active={filteredState[messageTypes.FLASH.variable]}>FLASH</FilterWrapper>
            </CustomTableHeader>
            <CustomTableHeader
              onClick={() => setFilteredState({
                ...filteredState,
                [messageTypes.CLOSED.variable]: !filteredState[messageTypes.CLOSED.variable]
              })
              }
            ><FilterWrapper active={filteredState[messageTypes.CLOSED.variable]}>CLOSED</FilterWrapper>
            </CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredState.filteredList.map((skill: Skill) => {
            const isSelected = selected.some(s => s.name === skill.name);
            return (
              <CustomTableRow key={skill.name} onClick={() => handleSetSelected(skill, isSelected)} selected={isSelected} data-testid="table-row">
                <CustomTableData><TableText>
                  <Checkbox
                    checked={isSelected}
                    style={{ padding: "0px" }}
                  />
                </TableText></CustomTableData>
                <CustomTableData><TableText>{skill.name}</TableText></CustomTableData>
                <CustomTableData><TableText>{getProfilesForSkill(skill).map((d: any) => d)}</TableText></CustomTableData>
                <CustomTableData><TableIcon>{skill.flashMessage && <FlashOn/>}</TableIcon></CustomTableData>
                <CustomTableData><TableIcon>{skill.closedMessage && <Block/>}</TableIcon></CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
      </CustomTable>
    </TableContainer>
  );
};

export default SkillsTable;