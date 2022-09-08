import { Button } from "@mui/material";
import styled from "styled-components";

export default styled(Button)`
  && {
    color: black;
    background: ${props => props.theme.button.blue.backgroundColor};
    &:hover {
      background: ${props => props.theme.button.blue.hoverColor};
    }
  }
`;