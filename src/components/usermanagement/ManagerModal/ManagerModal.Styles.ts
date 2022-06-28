import {
  FlexColumn,
  FlexRow
} from "globals";
import styled from "styled-components";

export const ButtonWrapper = styled(FlexRow)`
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