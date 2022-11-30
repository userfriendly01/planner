import { Button } from "@mui/material";
import styled from "styled-components";

export default styled(Button)<{
  height?: string,
  width?: string,
  margin?: string
}>`
  height: ${props => props.height ? props.height : "40px"};
  width: ${props => props.width ? props.width : "150px"};
  margin: ${props => props.margin ? props.margin : "0 15px"};
  && {
    color: black;
    background: ${props => props.color ? props.color : props.theme.button.blue.backgroundColor};
    &:hover {
      background: ${props => props.color ? props.color : props.theme.button.blue.hoverColor};
    }
  }
`;