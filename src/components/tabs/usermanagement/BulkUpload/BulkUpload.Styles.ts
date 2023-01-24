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
  margin: 40px;
  align-items: center;
  justify-content: space-between;
`;

export const StepWrapper = styled.div`
  display: flex;
  width: 100%
`;

export const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin: 20px;
`;

export const ImportButton = styled(StyledButton)`
  width: 250px;
  height: 50px;
`;

export const StyledExportButton = styled(StyledButton)<{ styles?: any }>`
  height: 50px;
  width: ${props => props.styles && props.styles.width ? props.styles.width : "250px"};
`;
