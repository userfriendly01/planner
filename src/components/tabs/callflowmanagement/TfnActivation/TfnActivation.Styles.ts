import { TextField } from "@mui/material";
import { StyledButton } from "components";
import styled from "styled-components";

export const AdditionalFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DisplayNameField = styled(TextField)`
&& {
  margin-top: 30px;
  width: 300px;
}
`;

export const EntryMessageField = styled(TextField)`
  && {
    margin-top: 30px;
    width: 500px;
  };
  ${props => props.value ? ".MuiFormLabel-root { transform: translate(14px, -9px) scale(.75); background-color: white; padding: 0 5; }" : null}
`;

export const TfnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SubmitButton = styled(StyledButton)`
  && {
    margin-top: 30px;
  }
`;