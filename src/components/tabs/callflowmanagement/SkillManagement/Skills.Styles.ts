import { Checkbox } from "@mui/material";
import styled from "styled-components";
import { StyledButton } from "components";

const headerIconWidth = "10px";

export const StyledCheckBox = styled(Checkbox)`
  padding: 0px;
`;

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
  &:nth-child(4) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(5) {
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
    width: 35%;
  }
  &:nth-child(3) {
    width: 35%;
  }
  &:nth-child(4) {
    width: ${headerIconWidth};
    text-align: -webkit-center;
  }
  &:nth-child(5) {
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
  width: 40%;
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
  width: 60%;
`;

export const StyledExportButton = styled(StyledButton)<{ styles: any }>`
  height: 40px;
  width: ${props => props.styles && props.styles.width ? props.styles.width : "100px"};
`;