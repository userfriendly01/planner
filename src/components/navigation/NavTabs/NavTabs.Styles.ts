import {
  Tab,
  Tabs
} from "@mui/material";
import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTabs = styled(Tabs)`
  background-color: ${props => props.theme.libertyLightYellow};
  color: ${props => props.theme.textColor};
`;

export const StyledTab = styled(Tab)`
  color: black !important;
  && {
    font-size: 1.1em;
  }
`;

export const StyledTabContainer = styled.div`
  position: sticky;
  top: 48px;
  z-index: 99;
`;