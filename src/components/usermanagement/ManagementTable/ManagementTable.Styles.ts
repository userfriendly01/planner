import styled from "styled-components";

const headerIconWidth = "64px";

export const CustomTable = styled.table`
  border-spacing: 0;
  font-size: 14px;
  table-layout: fixed;
  width: 100%;
`;

export const CustomTableData = styled.td`
  color: ${props => props.theme.textColor};
  padding: 2px 4px;
  vertical-align: top;
  &:nth-child(7) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(8) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(9) {
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
    width: 15%;
  }
  &:nth-child(2) {
    width: 10%;
  }
  &:nth-child(3) {
    width: 10%;
  }
  &:nth-child(4) {
    width: 18%;
  }
  &:nth-child(7) {
    width: ${headerIconWidth};
  }
  &:nth-child(8) {
    width: ${headerIconWidth};
  }
  &:nth-child(9) {
    width: ${headerIconWidth};
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

export const DeltaWrapper = styled.div`
  align-items: center;
  color: ${props => props.theme.libertyDarkGray};
  display: flex;
  justify-content: center;
  margin: auto;
`;

export const IconWrapper = styled.div`
  align-items: center;
  border-radius: ${props => props.theme.tableRow.icon.hoverDiameter / 2}px;
  color: ${props => props.theme.libertyDarkGray};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.theme.tableRow.icon.size}px;
  height: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  justify-content: center;
  width: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  &:hover {
    background-color: ${props => props.theme.tableRow.selectedColor};
    cursor: pointer;
  }
`;

export const TableContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;

export const TableDataFlex = styled.div`
  color: ${props => props.theme.textColor};
  display: flex;
  flex-wrap: wrap;
`;

export const TableText = styled.div`
  margin: 2px;
`;
