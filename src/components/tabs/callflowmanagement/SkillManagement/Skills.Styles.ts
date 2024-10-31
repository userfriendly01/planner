import styled from "styled-components";
import { StyledButton } from "components/StyledButton";
import {
  Paper, Tabs
} from "@mui/material";
import { FlexRow } from "globals/interfaces";

const headerIconWidth = "10px";

export const StyledHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
`;

export const CustomTable = styled.table`
  border-spacing: 0;
  font-size: 14px;
  table-layout: fixed;
  width: 100%;
  margin-top: 10px;
  overflow-y: scroll;
  max-height: 700px;
`;

export const CustomTableData = styled.td`
  color: ${props => props.theme.textColor};
  padding: 2px 4px;
  vertical-align: top;
  &:nth-child(1) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(5) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(6) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
`;

export const CustomTableHeader = styled.th`
  color: ${props => props.theme.textColor};
  border-bottom: 2px solid ${props => props.theme.tableRow.borderColor};
  padding-left: 4px;
  text-align: left;
  &:nth-child(1) {
    width: ${headerIconWidth};
    text-align: -webkit-center;
  }
  &:nth-child(2) {
    width: 25%;
  }
  &:nth-child(3) {
    width: 25%;
  }
  &:nth-child(4) {
    width: 15%;
  }
  &:nth-child(5) {
    width: ${headerIconWidth};
    text-align: -webkit-center;
  }
  &:nth-child(6) {
    width: ${headerIconWidth};
    text-align: -webkit-center;
  }
  &:nth-child(7) {
    width: ${headerIconWidth};
    text-align: -webkit-center;
  }
`;

export const CustomTableRow = styled.tr<{ selected: boolean }>`
  &:nth-child(odd) {
    background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : props.theme.tableRow.alternateRowColor};
  }
  background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : "inherit"};
  &:hover {
    background-color: ${props => props.selected ? props.theme.tableRow.hoverSelectedColor : props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
`;

export const FilterWrapper = styled.div<{ active: boolean }>`
  color: ${props => props.active ? "rgb(170, 237, 237)" : "black"};
  cursor: pointer;
  &:hover {
    cursor: pointer;
  }
`;

export const FormControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 650px;
  padding-top: 5px;
  width: 35%;
  overflow: hidden;
`;

export const TableContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;

export const TableText = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2px;
`;

export const TableIcon = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2px;
  align-items: center;
`;

export const SkillsTableWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 700px;
`;

export const SkillsWrapper = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;
  flex-direction: column;
  width: 65%;
`;

export const SkillsDetailWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
  align-items: center;
  justify-content: space-between;
`;

export const DeleteMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: break-spaces;
`;

export const StyledExportButton = styled(StyledButton)<{ styles: any }>`
  height: 40px;
  width: ${props => props.styles && props.styles.width ? props.styles.width : "100px"};
`;

export const SkillTabs = styled(Tabs)`
  && .MuiTabs-flexContainer {
    justify-content: space-evenly;
  }
`;

export const FormRow = styled(FlexRow)`
  align-items: center;
  justify-content: space-evenly;
  margin: 5px;
`;

export const Label = styled.div`
  display: flex;
  width: 90%;
  justify-content: center;
  margin: 10px;
  text-align: center;
`;

export const TaskQueueDisplay = styled(Paper)<{error?: string}>`
  width: 330px;
  min-height: 150px;
  border: ${props => props.error === "true" ? "groove 2px red": "none"};
  text-align: -webkit-center;
  margin-left: 44px;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 75%;
  justify-content: space-between;
`;

export const ScrollingPaper = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
  overflow-y: auto;
  max-height: 800px;
`;

export const CenteredDiv = styled.div`
  align-self: center;
  margin: 10px;
  text-align: center;
`;

export const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding-top: 8px;
  align-items: center;
  max-height: 50;
}
`;