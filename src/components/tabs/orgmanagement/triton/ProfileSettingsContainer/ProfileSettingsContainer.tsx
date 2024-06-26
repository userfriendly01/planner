import { checkIfPO } from "authentication/authUtils";
import { ProfileSettingsTable } from "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileSettingsTable/ProfileSettingsTable";
import { ProfileEntryForm } from "orgmanagement/ProfileEntryForm";
import { PageLoadSpinner } from "components/PageLoadSpinner";
import {
  useAdminState,
  ProfileEntryFormStateProvider,
  useAdminDispatch
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
import { loadSoftphoneConfigRelationships } from "services/profile";

export const ProfileSettingsContainer = () => {
  const initialProfileModalState = {
    open: false
  };

  const [profileModalState, setProfileModalState] = useState(initialProfileModalState);

  const state = useAdminState();
  const adminDispatch = useAdminDispatch();
  const { nNumber: loggedInUser } = state.userContext;
  const profiles = state.profileContext.profiles;
  const [ isLoading, setIsLoading ] = React.useState(true);

  const createProfileOnClick = () => setProfileModalState({
    open: true
  });

  React.useEffect(() => {
    loadSoftphoneConfigRelationships(profiles, adminDispatch, () => setIsLoading(false));
  }, []);

  return (
    <ProfileEntryFormStateProvider>
      <ProfileSettingsContainerDiv>
        {isLoading ?
          <PageLoadSpinner />
          :
          <>
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
                setProfileModalState={setProfileModalState}
                loggedInUser={loggedInUser}
              />
            </SettingsContainer>
          </>
        }
      </ProfileSettingsContainerDiv>
    </ProfileEntryFormStateProvider>
  );
};