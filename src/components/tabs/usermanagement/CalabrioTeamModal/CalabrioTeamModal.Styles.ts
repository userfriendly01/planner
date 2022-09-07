import {
  FlexColumn,
  FlexRow
} from "globals";
import styled from "styled-components";
import { CloseRounded } from "@mui/icons-material";

export const CloseButton = styled(CloseRounded)`
  position: absolute;
  right: 10px;
`;

export const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

export const HeaderAndCloseButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px;
`;

export const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;