import { StyledButton } from "components";
import styled from "styled-components";

export const ControlItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:first-child {
    width:40%;
    justify-content: center;
  }
  &:last-child {
    width:25%;
    margin-left: auto;
    justify-content: flex-end;
  }
`;

export const ControlsWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 1%;
`;

export const AddUserButton = styled(StyledButton)`
  width: 35%;
`;

export const StyledExportButton = styled(StyledButton)`
  height: 50px;
  width: 35%;
  margin: 10px;
`;