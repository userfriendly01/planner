import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  min-width: 100%;
  position: relative;
`;


export const Label = styled.div`
  display: flex;
  width: 90%;
`;

export const IconWrapper = styled.div`
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
