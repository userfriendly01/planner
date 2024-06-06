import styled from "styled-components";
import {
  FlexColumn, FlexRow
} from "globals/interfaces";

export const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end
`;

export const FilterButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 5px;
`;

export const Header = styled.h1`
  align-self: center;
`;

export const ModalContainer = styled(FlexColumn)`
  font-family: 'Roboto', sans-serif;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 5px;
`;

export const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self:center;
  padding: 5px;
`;