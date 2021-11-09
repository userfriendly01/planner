import styled from "styled-components";
import { Tabs } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import {
  StyledButton
} from "components";

export const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

export const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 8px;
  align-items: flex-end;
`;

export const UserFormButton = styled(StyledButton)`
  height: 40px;
  width: 150px;
  margin-bottom: 15px; 
`;

export const FormControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  max-height: 650px;
  padding-top: 5px;
  overflow: overlay;
`;

export const FormControlsPane = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  padding: 0 8px;
  width: 100%;
  max-width: 400px;
`;

export const RightColumn = styled(FormControlsPane)`
  display: flex;
  flex-direction: column;
  margin-top: -8;
`;

export const Header1 = styled.h1`
  align-self: center;
`;

export const Header2 = styled.h2`
  align-self: center;
`;

export const ModalContainer = styled.div<{theme: any}>`
  background-color: ${props => props.theme.backgroundColor};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  left: 0;
  margin: 0 auto;
  max-width: 900px;
  padding: 0 8px;
  position: absolute;
  right: 0;
  top: 10vh;
  width: 100%;
  min-height: 600px;
`;

export const TabContainer = styled.div`
  display: flex;
`;

export const UserFormTabs = styled(Tabs)`
  min-width: 160px;
`;

export const ToggleContainer = styled.div`
  display: flex;
  margin-left: 4px;
`;

export const ToggleLabel = styled.div`
  align-self: center;
  font-weight: 400;
  font-size: 1rem;
`;

export const StyledIcon = styled(Edit)<{theme: any}>`
  && {
    color: ${props => props.theme.button.blue.backgroundColor};
    &:hover {
      color: ${props => props.theme.button.blue.hoverColor};
      cursor: pointer;
    }
  }
`;