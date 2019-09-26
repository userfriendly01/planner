import { theme } from "globals";
import styled from "styled-components";

const ModalHeader = styled.div`
  align-self: center;
  color: ${theme.textColor};
  font-family: 'Roboto', sans-serif;
  font-size: ${props => props.fontSize ? props.fontSize : "3rem"};
  font-weight: 400;
  letter-spacing: 0rem;
  line-height: 1.30357em;
  margin: 2%;
`;

export default ModalHeader;
