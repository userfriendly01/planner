import { checkIfPO } from "authentication/authUtils";
import { ProfileSettingsTable } from "orgmanagement/ProfileSettingsTable";
import { ProfileEntryForm } from "orgmanagement/ProfileEntryForm";
import {
  useAdminState,
  ProfileEntryFormStateProvider
} from "context/appContext";
import { Modal } from "@mui/material";
import React, { useState } from "react";
import {
  ProfileSettingsContainerDiv,
  SettingsContainer,
  ControlsWrapper,
  ControlItem,
  CreateProfileButton
} from "./ProfileSettingsContainer.Styles";

export const ProfileSettingsContainer = () => {
  const initialProfileModalState = {
    open: false
  };

  const [profileModalState, setProfileModalState] = useState(initialProfileModalState);

  const state = useAdminState();
  const { nNumber: loggedInUser } = state.userContext;
  const profilesFromContext = state.profileContext.profiles;

  const createProfileOnClick = () => setProfileModalState({
    open: true
  });

  return (
    <ProfileEntryFormStateProvider>
      <ProfileSettingsContainerDiv>
        <Modal onClose={() => { return; }} open={profileModalState.open}>
          <>
            <ProfileEntryForm
              handleClose={() => setProfileModalState(initialProfileModalState)}
            />
          </>
        </Modal>
        <SettingsContainer>
          {
            checkIfPO(loggedInUser) ?
              <ControlsWrapper>
                <ControlItem>
                  <CreateProfileButton onClick={createProfileOnClick} data-testid={"create-profile-button"}>
                      Create Profile
                  </CreateProfileButton>
                </ControlItem>
              </ControlsWrapper>
              : null
          }
          <ProfileSettingsTable
            profileList={profilesFromContext}
            setProfileModalState={setProfileModalState}
            loggedInUser={loggedInUser}
          />
        </SettingsContainer>
      </ProfileSettingsContainerDiv>
    </ProfileEntryFormStateProvider>
  );
};