import { Button } from "@mui/material";
import styled from "styled-components";

export const StyledButton = styled(Button)`
  && {
    color: black;
    background: ${props => props.color ? props.color : props.theme.button.blue.backgroundColor};
    &:hover {
      background: ${props => props.color ? props.color : props.theme.button.blue.hoverColor};
    }
  }
`;