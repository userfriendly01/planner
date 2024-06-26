import { DialListTable } from "orgmanagement/DialListTable";
import { ProfileDropDown } from "orgmanagement/ProfileDropDown";
import { useAdminState } from "context/appContext";
import { apiPaths } from "globals";
import React, { useState } from "react";
import { sortDialListEntriesByName } from "utils/_sortUtils";
import { myAxios } from "utils/myAxios";
import { logger } from "utils/logger";
import {
  ProfileSettingsContainerDiv,
  ProfileSettingsMessage
} from "./ProfileSettingsContainer.Styles";

interface InitialProfileStateProps {
  dialList: any[],
  message: string,
  profileId?: number | string
}

export const ProfileDialListContainer = () => {
  const state = useAdminState();
  const profilesFromContext = state.profileContext;

  const dialList: any= [];
  const message = "";
  const profileId = "3";


  return (
    <ProfileSettingsContainerDiv>
      <ProfileDropDown
        availableProfiles={[]}
        profileId={profileId}
        updateProfile={() => "Faith"}
      />
      {
        profileId !== null
          ?
          <DialListTable
            dialList={dialList}
            profileId={profileId}
            refreshProfileData={() => "Faith"}
          />
          :
          null
      }
      {
        message
          ?
          <ProfileSettingsMessage data-testid="message">
            <h1>{message}</h1>
          </ProfileSettingsMessage>
          :
          null
      }
    </ProfileSettingsContainerDiv>
  );
};