import { Paper } from "@mui/material";
import styled from "styled-components";

export const CallflowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`;

export const MessageWrapper = styled.div`
  display: flex;
`;

export const PaperContainer = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
`;

