import styled from "styled-components";
import { StyledButton } from "components";
import { TextField } from "@material-ui/core";

export const Button = styled(StyledButton)`
  height: 40px;
  width: 150px;
  margin-bottom: 15px; 
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 5px; 
`;

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

export const ModalContainer = styled.div<{theme: any}>`
  background-color: ${props => props.theme.backgroundColor};
  border: #FFD000 5px solid;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  left: 0;
  margin: 0 auto;
  max-width: 800px;
  padding: 25px;
  position: absolute;
  right: 0;
  top: 11vh;
`;

export const InstructionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-self: center;
  margin-top: 20px;
  font-weight: 600;
  font-size: 22px;
`;

export const SubHeader = styled.div`
  display: flex;
  font-size: 20px;
  margin: 25px 0px 20px 0px;
`;


export const Text = styled.div`
  margin: 0px 0px 5px 10px;
`;

export const UserWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const StyledTextField = styled(TextField)`
  .MuiFormLabel-root.Mui-disabled {
    font-size: 20px;
    color: black;
  };
  .MuiInputLabel-formControl {
    background: white;
    padding: 0px 10px 0px 5px;
  };
  &.MuiFormControl-root {
    width: 49%;
  };
`;