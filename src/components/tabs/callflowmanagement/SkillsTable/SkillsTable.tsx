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
import React, {
  useEffect, useState
} from "react";
import { filterSkillsByName } from "utils";

interface SkillsTableProps {
  filteredState: any,
  selected: any[],
  setSelected: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
}

const SkillsTable = (props: SkillsTableProps) => {
  const {
    filteredState,
    selected,
    setSelected,
    setFilteredState
  } = props;

  const defaultModalOpts = {
    open: false,
    change: false
  };

  const defaultSaveResult: any = {
    status: null,
    message: null
  };

  const filterType = {
    CLOSED: "closedFilter",
    FLASH: "flashFilter"
  };

  const [confirmationModalOpts, setConfirmationModalOpts] = useState(defaultModalOpts);
  const [saveResult, setSaveResult] = useState(defaultSaveResult);

  console.warn("filteredState in the table", filteredState);

  const getProfilesForSkill = (skill: any) => {
    const profileDivs: any = [];
    skill.profiles?.map((p: any, index: number) => {
      if(index !== filteredState.filteredList.length - 1){
        profileDivs.push(<div>{p.profileName} - {p.profileId}</div>);
      } else {
        profileDivs.push(<div>{p.profileName} - {p.profileId},</div>);
      }
    });
    console.warn("profileDivs", profileDivs);
    return profileDivs;
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
            <CustomTableHeader
              onClick={() => setFilteredState({
                ...filteredState,
                [filterType.FLASH]: !filteredState.flashMessage
              })
              }
            >FLASH</CustomTableHeader>
            <CustomTableHeader
              onClick={() => setFilteredState({
                ...filteredState,
                [filterType.CLOSED]: !filteredState.closedMessage
              })
              }
            >CLOSED</CustomTableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredState.filteredList.map((skill: Skill) => {
            const isSelected = selected.some(s => s === skill.name);
            return (
              <CustomTableRow key={skill.name} onClick={() => handleSetSelected(skill.name, isSelected)} selected={isSelected} data-testid="table-row">
                <CustomTableData><TableText>
                  <Checkbox
                    checked={isSelected}
                    style={{ padding: "0px" }}
                  />
                </TableText></CustomTableData>
                <CustomTableData><TableText>{skill.name}</TableText></CustomTableData>
                <CustomTableData><TableText>{getProfilesForSkill(skill).map((d: any) => ({ d }))}</TableText></CustomTableData>
                <CustomTableData><TableText>{skill.flashMessage && <FlashOn/>}</TableText></CustomTableData>
                <CustomTableData><TableText>{skill.closedMessage && <Block/>}</TableText></CustomTableData>
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