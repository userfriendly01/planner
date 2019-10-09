
import { Button } from "@material-ui/core";
import styled from "styled-components";

export default styled(Button)`
  && {
    background: ${props => props.theme.button.blue.backgroundColor};
    &:hover {
      background: ${props => props.theme.button.blue.hoverColor};
    }
  }
`;