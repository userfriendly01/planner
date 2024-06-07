import { StyledButton } from "components/StyledButton";
import styled from "styled-components";
import {
  FlexColumn,
  FlexRow
} from "globals/interfaces";

export const Button = styled(StyledButton)`
  height: 40;
  width: 100;
`;

export const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
  max-height: 50px;
`;

export const ConfirmationText = styled.h2`
  display: flex;
  font-size: 18px;
  padding: 0px 10px 0px 10px;
  text-align: center;
  align-items: center;
  align-self: center;
  line-height: 2;
  min-height: 150px;
`;

export const ModalContainer = styled(FlexColumn)`
  position: absolute;
  min-width: 650px;
  top: 50%;
  left: 50%;
  padding: 2%;
  transform: translate(-50%, -50%);
`;
