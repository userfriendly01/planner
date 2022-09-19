import { StyledButton } from "components";
import styled from "styled-components";

export const FormControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 650px;
  padding-top: 5px;
  width: 50%;
  overflow: hidden;
`;

export const MessageBoxWrapper = styled.div`
  display: flex;
  width: 600px;
  margin-top: 10px;
  flex-direction: column;
  align-items: center;
`;

export const TextField = styled.textarea`
  background-color: rgba(0,0,0,0.04);
  padding: 10px;
  height: 200px;
  width: 500px;
  margin: 5 0 10 0;
`;

export const UserFormButton: any = styled(StyledButton)`
  height: 40px;
  width: 450px;
  margin-bottom: 15px; 
`;

export const ActionBarWrapper = styled.div`
display: flex;
width: 500px;
height: 30px;
justify-content: space-around
`;

export const IconWrapper = styled.div<{ active: boolean }>`
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: ${props => props.theme.libertyDarkGray};
  cursor: pointer;
  display: flex;
  height: 35px;
  width: 35px;
  background-color: ${props => props.active ? "rgb(170, 237, 237)" : "none"};
  &:hover {
    background-color: ${props => props.theme.tableRow.selectedColor};
    cursor: pointer;
  }
`;