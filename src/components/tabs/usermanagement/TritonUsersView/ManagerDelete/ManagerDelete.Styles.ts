import {
  FlexColumn,
  FlexRow
} from "globals/interfaces";
import styled from "styled-components";

export const TextBox = styled.div`
  padding-top: 10px;
  padding-bottom: 30px;
  text-align: center;
`;

export const PenaltyBox = styled.div`
  padding-bottom: 30px;
  text-align: center;
  font-weight: bold;
`;

export const ManagerDeleteButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

export const Header = styled.h1`
  text-align: center;
`;

export const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end
`;

export const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;