import { StyledButton } from "components/StyledButton";
import styled from "styled-components";

export const ProfileSettingsDropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`;

export const ProfileSettingsContainerDiv = styled.div`
  height: 100%;
  padding: 1%;
`;

export const ProfileSettingsMessage = styled.div`
  margin-top: 25vh;
  text-align: center;
`;

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1%;
`;

export const ControlsWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 0 2%;
`;

export const ControlItem = styled.div`
  width: 33%;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  &:first-child {
    justify-content: center;
    margin-right: auto;
  }
  &:last-child {
    justify-content: flex-end;
    margin-left: auto;
  }
`;

export const CreateProfileButton = styled(StyledButton)`
  width: 17%;
`;