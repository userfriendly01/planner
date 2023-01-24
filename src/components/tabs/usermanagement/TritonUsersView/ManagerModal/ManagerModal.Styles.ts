import {
  FlexColumn,
  FlexRow
} from "globals";
import { Paper } from "@mui/material";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  min-width: 100%;
  position: relative;
`;

export const ManagerModalButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

export const Header = styled.h1`
  align-self: center;
`;

export const HeaderAndCloseButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const LeftDiv = styled.div`
  width: 1em;
`;

export const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const PaperContainer = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
`;
