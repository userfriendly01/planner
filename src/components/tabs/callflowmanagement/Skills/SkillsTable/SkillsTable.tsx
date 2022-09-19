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
    checked,
    filteredState,
    selected,
    setChecked,
    setFilteredState,
    setSelected
  } = props;

  React.useEffect(() => {
    const skill = filteredState.filteredList.find((s: any) => s.name === selected?.name);
    if(skill && JSON.stringify(skill) !== JSON.stringify(selected)){
      console.warn("Entered state to update to new value");
      setSelected(skill);
    } else if(!skill){
      setSelected(null);
    }
  }, [filteredState]);

  const allSkillsSelected = checked.length === filteredState.filteredList.length && filteredState.filteredList.length > 0;

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

  const handleSetChecked = (skill: any, isSelected: boolean) => {
    if(isSelected){
      setChecked(checked.filter(s => s.name !== skill.name));
    } else {
      setChecked([...checked, skill ]);
    }
  };


  const handleSelectAll = () => {
    if(allSkillsSelected){
      setChecked([]);
    } else {
      setChecked(filteredState.filteredList);
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
                [messageTypes.FLASH.filter]: !filteredState[messageTypes.FLASH.filter]
              })
              }
            ><FilterWrapper active={filteredState[messageTypes.FLASH.filter]}>FLASH</FilterWrapper>
            </CustomTableHeader>
            <CustomTableHeader
              onClick={() => setFilteredState({
                ...filteredState,
                [messageTypes.CLOSED.filter]: !filteredState[messageTypes.CLOSED.filter]
              })
              }
            ><FilterWrapper active={filteredState[messageTypes.CLOSED.filter]}>CLOSED</FilterWrapper>
            </CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredState.filteredList.map((skill: Skill) => {
            const isChecked = checked.some((s: any) => s.name === skill.name);
            const isSelected = selected?.name === skill.name;
            return (
              <CustomTableRow key={skill.name}  selected={isSelected} onClick={() => setSelected(skill)}>
                <CustomTableData><TableText>
                  <Checkbox
                    onClick={() => handleSetChecked(skill, isChecked)}
                    checked={isChecked}
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