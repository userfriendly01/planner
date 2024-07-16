import styled from "styled-components";
import { StyledButton } from "components/StyledButton";
import { FlexRow } from "globals/interfaces";

export const ModalContainer = styled.div<{theme: any}>`
  background-color: ${props => props.theme.backgroundColor};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  left: 0;
  margin: 0 auto;
  max-width: 900px;
  padding: 0 8px;
  position: absolute;
  right: 0;
  top: 5vh;
  width: 100%;
  height: 90vh;
`;

export const Header1 = styled.h1`
  align-self: center;
`;

export const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 8px;
  align-items: flex-end;
`;

export const FormButton = styled(StyledButton)`
  height: 40px;
  width: 150px;
  margin-bottom: 15px; 
`;

export const FormControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding-top: 5px;
  overflow-y: scroll;
  align-items: baseline;
  align-self: center;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 5px;
  align-items: center;
  justify-content: space-evenly;
  align-self: center;
  margin: 10px;
  width: 100%;
`;

export const FormControlsPane = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
`;

export const OptionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const ToggleContainer = styled.div`
  display: flex;
`;

export const ToggleLabel = styled.div`
  align-self: center;
  font-weight: 400;
  font-size: 1rem;
`;

export const Label = styled.p`
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  margin: 5px;
`;

export const ProfileDropdownControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  min-height: 350px;
  z-index: 2;
  margin-top: 20px;
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

export const ProfileDropdownRow = styled.div`
  align-items: center;
  display: flex;
  &:hover { ${/* @ts-ignore */""}
    background-color: ${props => props.highlightOnHover ? props.theme.tableRow.hoverColor : null}
  }
`;

export const ProfileDropdownRowItem = styled.div`
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

export const AccessGroupDropdownRowItem = styled.div`
  &:nth-child(1) {
    display: flex;
    padding-right: 8px;
    padding-top: 1.5px;
    width: 90%;
  }
  &:nth-child(2) {
    display: flex;
    justify-content: center;
    width: 10%;
  }
`;

export const ProfileDropdownRowSeperator = styled.div`
  border-bottom: 1px solid ${props => props.theme.lineSeperatorColor};
  margin-top: 8px;
`;

export const ProfileDropdownWrapper = styled.div`
  max-height: 50vh;
  overflow-y: auto;
  padding: 15px 10px;

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
