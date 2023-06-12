import { StyledButton } from "components";
import styled from "styled-components";
import { Paper } from "@mui/material";

export const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
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
  background-color: #99E5EA;
  border-radius: inherit;
`;

export const ModalWrapper = styled(Paper)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 900px;
  height: 400px;
  position: absolute;
  left: 32vw;
  top: 30vh;
`;

export const TextWrapper = styled.div<{styles: any}>`
  font-weight: ${props => props.styles && props.styles.weight ? props.styles.weight : "normal"};
  font-size: ${props => props.styles && props.styles.size ? props.styles.size : "20px"};
  text-align: center;
  padding: 20 50;
`;

export const ProcessingResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  
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

export const Wrapper = styled.div<{center?: boolean, column?: boolean, centrallyAlign?: boolean}>`
  display: flex;
  width: 60%;
  justify-content: ${props => props.center? "center" : "space-between"};
  flex-direction: ${props => props.column? "column": "row"};
  align-items: ${props => props.centrallyAlign? "center" : "baseline"};
`;

export const FileNameWrapper = styled.div`
  font-size: "14px",
  font-style: "italic",
  margin: "2 0 2 0"
`;


export const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;


export const UpdateWrapper = styled.div<{adjustibleHeight?: boolean}>`
  display: flex;
  width: 800px;
  align-items: center;
  justify-content: space-between;
  height: ${props => props.adjustibleHeight? "auto": "60px"};
  margin: 0px 50px 0px 150px;
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

export const Button = styled(StyledButton)<{ styles?: any }>`
  height: 50px;
  font-weight: bold;
  width: ${props => props.styles && props.styles.width ? props.styles.width : "250px"};
`;

export const SkillSelectorContainer = styled.div`
  min-width: 320px;
  margin: "10px 20px 0px 20px"
  width: 100%;
  max-width: 400px;
`;
