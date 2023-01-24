import styled from "styled-components";
import { StyledButton } from "components";

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
