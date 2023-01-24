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
  width: 80%;
  margin: 20px;
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
  width: 200px
`;

export const StyledExportButton = styled(StyledButton)<{ styles?: any }>`
  height: 40px;
  width: ${props => props.styles && props.styles.width ? props.styles.width : "100px"};
`;
