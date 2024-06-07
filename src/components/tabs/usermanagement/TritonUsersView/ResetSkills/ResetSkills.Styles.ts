import styled from "styled-components";
import {
  FlexColumn, FlexRow
} from "globals/interfaces";

export const ResetSkillsButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

export const FlexRowMax = styled(FlexRow)`
  width: max-content;
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

export const ResultsContainer = styled(FlexColumn)<{
    backgroundColor: string,
    borderColor: string
  }>`
  background-color: ${props => props.backgroundColor};
  border-width: 2px;
  border-color: ${props => props.borderColor};
  border-style: solid;
  border-radius: 10px;
  padding: 5px;
  width: auto;
  margin: 5px;
`;