import { Paper } from "@mui/material";
import styled from "styled-components";
import { FlexRow } from "globals/interfaces";
import { InfoOutlined } from "@mui/icons-material";

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
  &:nth-child(3) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
  &:nth-child(4) {
    text-align: -webkit-center;
    vertical-align: middle;
  }
`;

export const CustomTableHeader = styled.th`
  color: ${props => props.theme.textColor};
  border-bottom: 2px solid ${props => props.theme.tableRow.borderColor};
  padding: 10px 4px;
  text-align: left;
  &:nth-child(1) {
    width: 50%;
  }
  &:nth-child(2) {
    width: 30%;
  }
  &:nth-child(3) {
    width: 10%;
  }
  &:nth-child(4) {
    width: 10%;
  }
`;

export const CustomTableRow = styled.tr`
  &:nth-child(odd) {
    background-color: ${props => props.theme.tableRow.alternateRowColor};
  }
  background-color: "inherit";
  &:hover {
    background-color: ${props => props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
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

export const NoListDiv = styled.div`
  text-align: center;
`;

export const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const TableText = styled.div`
  margin: 2px;
`;

export const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

export const Header = styled.h1`
  align-self: center;
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
`;

export const ExternalNumberContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`;

export const InfoOutlinedStyled = styled(InfoOutlined)`
&& {
  font-size: 1.5em;
}
`;