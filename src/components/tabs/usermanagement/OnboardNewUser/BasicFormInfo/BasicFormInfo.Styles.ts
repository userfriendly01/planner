import {
  FormControlsContainer,
  FormControlsPane
} from "globals";
import styled from "styled-components";

export { FlexRow } from "globals";

export const BasicInfoFormContainer = styled(FormControlsContainer)`
justify-content: center;
max-height: 650px;
margin: 20px 0px;
`;

export const BasicInfoFormPane = styled(FormControlsPane)`
display: flex;
flex-direction: column;
min-width: 320px;
padding: 0 8px;
width: 100%;
max-width: 400px;
`;


export const RightColumn = styled(BasicInfoFormPane)`
  display: flex;
  flex-direction: column;
  margin-top: -8px;
`;