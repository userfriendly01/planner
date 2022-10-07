import styled from "styled-components";
import { Paper } from "@mui/material";

export const CustomTable = styled.table`
  border-spacing: 0;
  font-size: 14px;
  table-layout: fixed;
  width: 100%;
  padding-left: 10px;
`;

export const CustomTableData = styled.td`
  color: #1A1446;
  padding: 2px 4px;
  vertical-align: top;
`;

export const CustomTableHeader = styled.th`
  color: #1A1446;
  border-bottom: 2px solid #F5F5F5;
  padding: 10px 4px;
  text-align: left;
  &:nth-child(1) {
    width: 2%;
  }
  &:nth-child(2) {
    width: 10%;
  }
`;

export const CustomTableRow = styled.tr`
  &:nth-child(odd) {
    background-color: rgba(0,0,0,0.04);
  }
  background-color: "inherit";
  &:hover {
    background-color: rgba(0,0,0,0.15);
    cursor: pointer;
  }
`;

export const TableText = styled.div`
  margin: 2px;
`;

export const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const TableContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;
