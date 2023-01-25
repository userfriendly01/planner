import styled from "styled-components";
import { StyledButton } from "components";
import { Paper } from "@mui/material";

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const ProgressBarWrapper = styled.div`
  width: 500px;
  height: 40px;
  border: 1px solid black;
  border-radius: 30px;
`;

export const ProgressBarFiller = styled.div<{progress: string}>`
  height: inherit;
  width: ${props => props.progress};
  background-color: grey;
  border-radius: inherit;
`;

export const ModalWrapper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 800px;
  height: 400px;
  position: absolute;
  left: 32vw;
  top: 30vh;
`;

export const TextWrapper = styled.div<{styles: string}>`
  font-weight: ${props => props.styles && props.styles.weight ? props.styles.weight : "normal"}
  font-size: ${props => props.styles && props.styles.size ? props.styles.size : "20px"}
`;

export const ValidationErrorWrapper = styled(Paper)`
  align-items: center;
  display: flex;
`;
export const BulkChangesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

export const Row = styled.div`
  display: flex;
  width: 60%;
  margin-top: 70px;
  align-items: center;
  justify-content: space-between;
`;

export const StepWrapper = styled.div`
  display: flex;
  width: 40%;
`;

export const Wrapper = styled.div<{center?: boolean}>`
  display: flex;
  width: 60%;
  justify-content: ${props => props.center? "center" : "space-between"};
`;

export const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

export const ImportButton = styled(StyledButton)`
  width: 350px;
  height: 50px;
  font-weight: bold;
`;

export const StyledExportButton = styled(StyledButton)<{ styles?: any }>`
  height: 50px;
  font-weight: bold;
  width: ${props => props.styles && props.styles.width ? props.styles.width : "250px"};
`;
