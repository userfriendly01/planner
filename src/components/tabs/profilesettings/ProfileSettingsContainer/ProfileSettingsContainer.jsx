import { checkIfPO } from "authentication";
import {
  ProfileSettingsTable,
  ProfileEntryForm
} from "components";
import {
  useAdminState,
  ProfileEntryFormStateProvider
} from "context";
import { Modal } from "@mui/material";
import React, { useState } from "react";
import {
  ProfileSettingsContainerDiv,
  SettingsContainer,
  ControlsWrapper,
  ControlItem,
  CreateProfileButton
} from "./ProfileSettingsContainer.Styles";

const ProfileSettingsContainer = () => {
  const initialProfileModalState = {
    open: false
  };

  const [profileModalState, setProfileModalState] = useState(initialProfileModalState);

  const state = useAdminState();
  const environment = state.userContext.pingIdentity.environment;
  const loggedInUser = state.userContext.pingIdentity.sub.toLowerCase();
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
            checkIfPO(loggedInUser, environment) ?
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
            environment={environment}
            profileList={profilesFromContext}
            setProfileModalState={setProfileModalState}
            loggedInUser={loggedInUser}
          />
        </SettingsContainer>
      </ProfileSettingsContainerDiv>
    </ProfileEntryFormStateProvider>
  );
};

export default ProfileSettingsContainer;
