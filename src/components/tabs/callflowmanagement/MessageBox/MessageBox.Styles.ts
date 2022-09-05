import styled from "styled-components";
import { StyledButton } from "components";

export const MessageBoxWrapper = styled.div`
  display: flex;
  width: 600px;
  margin-top: 25px;
  flex-direction: column;
  align-items: center;
`;

export const ActionBar = styled.div`
  display: flex;
  width: 500px;
  height: 30px;
  justify-content: space-around
`;

export const TextField = styled.textarea`
  background-color: rgba(0,0,0,0.04);
  padding: 10px;
  height: 150px;
  width: 500px;
  margin: 5 0 10 0;
`;

export const UserFormButton = styled(StyledButton)`
  height: 40px;
  width: 450px;
  margin-bottom: 15px; 
`;

export const IconWrapper = styled.div<{ active: boolean }>`
  align-items: center;
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

