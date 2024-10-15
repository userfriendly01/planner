import { StyledButton } from "components/StyledButton";
import styled from "styled-components";
import { Paper } from "@mui/material";

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

export const StyledExportButton = styled(StyledButton)`
  height: 50px;
  width: 100%;
  margin: 10px;
`;

export const ModalWrapper = styled(Paper)<{position?: string}>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 900px;
  height: 400px;
  position: ${props => props.position || "absolute"};
  left: 32vw;
  top: 30vh;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;