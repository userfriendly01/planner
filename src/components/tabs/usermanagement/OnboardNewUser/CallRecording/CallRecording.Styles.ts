import styled from "styled-components";

export const FormControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  height: 280px;
  padding-top: 5px;
  overflow: overlay;
`;

export const FormControlsPane = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const FullAccessWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ScopeRow = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : "inherit"};
  &:hover {
    background-color: ${props => props.selected ? props.theme.tableRow.hoverSelectedColor : props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
`;

export const ScopeContainer = styled.div`
  display: flex;
  height: 80%;
  width: 90%;
  font-size: 15px;
  justify-content: space-evenly;
`;

export const TableText = styled.div`
  margin: 2px;
`;

export const TableBody = styled.div`
  overflow-y: scroll;
  border: grey 2px solid;
  width: 250px;
`;

export const CustomTableData = styled.div`
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

export const Text = styled.div`
  margin: 0px 0px 5px 10px;
`;