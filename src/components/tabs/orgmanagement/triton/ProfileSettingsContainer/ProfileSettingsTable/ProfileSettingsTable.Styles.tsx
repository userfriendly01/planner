import styled from "styled-components";
import { Paper } from "@mui/material";

export const CustomTable = styled.table`
  border-spacing: 0;
  font-size: 14px;
  min-width: 1500px;
`;

export const CustomTableData = styled.td`
  color: #1A1446;
  padding: 2px 4px;
  vertical-align: top;
  padding-bottom: 10px;
  &:nth-child(2) {
    text-align: left;
  }
`;

export const CustomTableHeader = styled.th`
  color: #1A1446;
  border-bottom: 2px solid #F5F5F5;
  padding: 10px 4px;
  text-align: center;
  position: sticky;
  top: 0px;
  background-color: white;
`;

export const CustomTableRow = styled.tr`
  text-align: center;
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
  align-items: baseline;
  display: flex;
  width: 100%;
  overflow-x: scroll;
  justify-content: left;
  overflow-y: auto;
  height: calc(100vh - 106px);
`;

export const TableContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 2%;
  padding-bottom: 0;
  position: relative;
`;

export const TableDataFlex = styled.div`
   color: #1A1446;
   display: flex;
   flex-wrap: wrap;
 `;

export const BubbleDiv = styled.div`
  border-color: #C0BFC0;
  border-style: solid;
  border-radius: 5px;
  border-width: 2px;
  font-size: .85em;
  font-weight: 800;
  margin: 2;
  padding: 1 3;
`;

export const HighlightRed = styled.span`
  color: #ff0000;
`;

export const IconWrapper = styled.div`
  align-items: center;
  border-radius: 10px;
  color: #343741;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 20px;
  justify-content: center;
  width: 20px;
  &:hover {
    background-color: #AAEDED;
    cursor: pointer;
  }
`;
