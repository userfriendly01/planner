import { Paper } from "@material-ui/core";
import styled from "styled-components";

const PaperContainer = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
`;

export default PaperContainer;
