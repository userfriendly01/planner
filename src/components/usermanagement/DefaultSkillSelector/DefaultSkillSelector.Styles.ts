import styled from "styled-components";

export const DefaultSkillsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  min-height: 400px;
  z-index: 2;
`;

export const IconButtonWrapper = styled.button`
  all: unset;
  align-items: center;
  color: ${props => props.disabled ? props.theme.button.icon.disabledColor : "inherit"};
  cursor: pointer;
  display: flex;
  font-size: 20px;
  height: ${props => props.theme.button.icon.diameter}px;
  justify-content: center;
  width: ${props => props.theme.button.icon.diameter}px;
  &:hover:enabled {
    border-radius: ${props => props.theme.button.icon.diameter/2}px;
    background-color: ${props => props.theme.button.icon.backgroundHoverColor};
  }
`;

export const SkillRow = styled.div`
  align-items: center;
  display: flex;
  height: 32px;
  &:hover { ${/* @ts-ignore */""}
    background-color: ${props => props.highlightOnHover ? props.theme.tableRow.hoverColor : null}
  }
`;

export const SkillRowItem = styled.div`
  &:nth-child(1) {
    display: flex;
    padding-right: 8px;
    width: 60%;
  }
  &:nth-child(2) {
    display: flex;
    justify-content: center;
    width: 20%;
  }
  &:nth-child(3) {
    display: flex;
    justify-content: flex-end;
    width: 20%;
  }
`;

export const SkillRowSeperator = styled.div`
  border-bottom: 1px solid ${props => props.theme.lineSeperatorColor};
  margin-top: 8px;
`;

export const SkillsWrapper = styled.div`
  max-height: 50vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    background-color: #F5F5F5;
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 6px;
    background: rgba(0,0,0,0.1);
    border: 1px solid #ccc;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #aaa;
    border: 1px solid #aaa;
  }
`;

