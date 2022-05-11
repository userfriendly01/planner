import styled from "styled-components";

export const FormControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  max-height: 300px;
  padding-top: 5px;
  overflow: overlay;
`;

export const FormControlsPane = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 8px;
  justify-content: center;
`;

export const FullAccessWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ToggleContainer = styled.div`
  display: flex;
`;

export const ToggleLabel = styled.div`
  align-self: center;
  font-weight: 400;
  font-size: 1rem;
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