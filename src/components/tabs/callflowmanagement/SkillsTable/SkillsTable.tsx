import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  DeltaWrapper,
  IconWrapper,
  TableContainer,
  StyledCheckBox,
  TableText
} from "./SkillsTable.Styles";
import {
  Modal,
  Checkbox
} from "@mui/material";
import { ModalOverlay } from "components";
import {
  useAdminDispatch,
  useAdminState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  modalOverlayStatuses,
  Skill
} from "globals";
import {
  Block,
  FilterAlt,
  FlashOn
} from "@mui/icons-material";
import React, { useState } from "react";
import { filterSkillsByNameAndProfile } from "utils";

interface SkillsTableProps {
  searchBy: string,
  selected: any[],
  setSelected: (skills: any[]) => void
}

const SkillsTable = (props: SkillsTableProps) => {
  const {
    searchBy,
    selected,
    setSelected
  } = props;

  const defaultModalOpts = {
    open: false,
    change: false
  };

  const defaultSaveResult: any = {
    status: null,
    message: null
  };

  const [confirmationModalOpts, setConfirmationModalOpts] = useState(defaultModalOpts);
  const [saveResult, setSaveResult] = useState(defaultSaveResult);
  const state = useAdminState();
  const skills = state.skillContext.skills;
  let filteredSkills = skills.slice();

  const trimmedSearch = searchBy.trim();
  if (trimmedSearch !== "") {
    filteredSkills = filteredSkills.filter((skill: Skill) => filterSkillsByNameAndProfile(skill, trimmedSearch));
  }
  const getProfilesForSkill = () => {
    return "Test Profile - 1";
  };

  const handleSetSelected = (skillName: string, isSelected: boolean) => {
    if(isSelected){
      setSelected(selected.filter(s => s !== skillName));
    } else {
      setSelected([...selected, skillName ]);
    }
  };


  return (
    <TableContainer>
      <CustomTable>
        <thead>
          <tr>
            <CustomTableHeader>
              <Checkbox
                checked={false}
                style={{ padding: "0px" }}
              />
            </CustomTableHeader>
            <CustomTableHeader>SKILL NAME</CustomTableHeader>
            <CustomTableHeader>PROFILES</CustomTableHeader>
            <CustomTableHeader>FLASH</CustomTableHeader>
            <CustomTableHeader>CLOSED</CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredSkills.map((skill: Skill) => {
            const isSelected = selected.some(s => s === skill.skill);
            return (
              <CustomTableRow key={skill.skill} onClick={() => handleSetSelected(skill.skill, isSelected)} selected={isSelected} data-testid="table-row">
                <CustomTableData><TableText>
                  <Checkbox
                    checked={isSelected}
                    style={{ padding: "0px" }}
                  />
                </TableText></CustomTableData>
                <CustomTableData><TableText>{skill.skill}</TableText></CustomTableData>
                <CustomTableData><TableText>{getProfilesForSkill()}</TableText></CustomTableData>
                <CustomTableData><TableText><FlashOn/></TableText></CustomTableData>
                <CustomTableData><TableText><Block/></TableText></CustomTableData>
              </CustomTableRow>
            );
          })}
        </tbody>
        { confirmationModalOpts.change ?
          <Modal open={confirmationModalOpts.open}>
            <div>Im a confirmation modal</div>
          </Modal>
          : null
        }
      </CustomTable>
    </TableContainer>
  );
};

export default SkillsTable;