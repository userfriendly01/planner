import { StyledButton } from "components";
import {
  FlexColumn,
  FlexRow
} from "globals";
import styled from "styled-components";

export const Button = styled(StyledButton)`
  height: 40;
  width: 100;
`;

export const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
  height: 50px;
`;

export const ConfirmationText = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 0px 10px 0px 10px ;
  height: 60px;
`;

export const Data = styled.h2`
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 23px;
  padding: 0px 10px 0px 10px ;
  height: 60px;
`;

export const ModalContainer = styled(FlexColumn)`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 2%;
  transform: translate(-50%, -50%);
`;
