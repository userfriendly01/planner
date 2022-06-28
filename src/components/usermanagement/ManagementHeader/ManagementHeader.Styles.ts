import { StyledButton } from "components";
import styled from "styled-components";

export const ControlItem = styled.div`
  width: 33%;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  &:first-child {
    justify-content: center;
    margin-right: auto;
  }
  &:last-child {
    justify-content: flex-end;
    margin-left: auto;
  }
`;

export const ControlsWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 1%;
`;

export const RightPadding = styled.div`
  padding-right: 8px;
`;

export const AddUserButton = styled(StyledButton)`
  width: 35%;
  .MuiButtonBase-root {
    margin-left: 10px; 
  }
`;