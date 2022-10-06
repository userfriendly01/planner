import { StyledButton } from "components";
import styled from "styled-components";

export const ConfirmationDiv = styled.div`
  font-weight: bold;
`;

export const ConfirmationExportDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px;
  font-size: 15px;
  font-weight: normal;
`;

export const MessageBoxWrapper = styled.div`
  display: flex;
  width: 600px;
  margin-top: 10px;
  flex-direction: column;
  align-items: center;
`;

export const MessageContainerWrapper = styled.div`
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
  width: 400px;
  margin: 5 0 10 0;
`;

export const UserFormButton: any = styled(StyledButton)`
  height: 40px;
  width: 450px;
  margin-bottom: 15px; 
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