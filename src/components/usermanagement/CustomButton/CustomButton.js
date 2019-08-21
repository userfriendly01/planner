import { ButtonBase } from "@material-ui/core";
import { theme } from "globals";
import styled from "styled-components";

const CustomButton = styled(ButtonBase)`
  && {
    opacity: ${props => props.disabled ? ".5" : "1"};
    background-color: #AAEDED;
    border: none;
    border-radius: 3px;
    color: ${theme.textColor};
    cursor: pointer;
    font-size: 1.2em;
    outline: none;
    padding: 5 10 5 10;
  }
`;

export default CustomButton;
