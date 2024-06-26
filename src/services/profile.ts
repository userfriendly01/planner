import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import {
  AccessGroup,
  Activity,
  DialListNumber,
  DirectoryNumber,
  ProfilePayload,
  ScreenPop
} from "globals/interfaces";
import { logger } from "utils/logger";
import {
  Action,
  UMSoftphoneConfiguration
}from "globals/interfaces";
import {
  CREATE_DIAL_LIST_ENTRY,
  CREATE_DIRECTORY_ENTRY,
  CREATE_SOFTPHONE_CONFIG,
  DELETE_DIAL_LIST_ENTRY,
  DELETE_DIRECTORY_ENTRY,
  DELETE_SOFTPHONE_CONFIG,
  UPDATE_DIAL_LIST_ENTRY,
  UPDATE_DIRECTORY_ENTRY,
  UPDATE_SOFTPHONE_CONFIG,
  getSoftphoneConfigRelationshipsQuery, listSoftphoneConfigs
} from "globals/graphql";

export const listUMSoftphoneConfigs = async (dispatch: (action: Action) => void): Promise<UMSoftphoneConfiguration[]> => {
  let profiles: UMSoftphoneConfiguration[] = [];
  let screenPops: ScreenPop[] = [];
  let accessGroups: AccessGroup[] = [];
  let activities: Activity[] = [];

  const getPageResults = async (
    isFirstQuery: boolean,
    profilesNextToken?: string,
    screenpopsNextToken?: string,
    accessGroupsNextToken?: string,
    activitiesNextToken?: string
  ): Promise<void> => {
    try {
      const {
        errors, data
      }: any = await apolloClient.query<{ results: any }>({
        query: listSoftphoneConfigs(profilesNextToken, screenpopsNextToken, accessGroupsNextToken, activitiesNextToken, isFirstQuery),
        variables: {}
      });

      if(errors?.length){
        throw errors;
      }

      if(data?.profiles?.items?.length) { profiles = [...profiles, ...data?.profiles?.items]; }
      if(data?.screenPops?.items?.length) { screenPops = [...screenPops, ...data.screenPops.items]; }
      if(data?.accessGroups?.items?.length) { accessGroups = [...accessGroups, ...data.accessGroups.items]; }
      if(data?.activities?.items?.length) { activities = [...activities, ...data.activities.items]; }

      //Test Next Token functionality specifically in unit test

      if(data?.profiles?.nextToken || data?.screenPops?.nextToken || data?.accessGroups?.nextToken || data?.activities?.nextToken){
        return getPageResults(false, data.profiles.nextToken, data.screenPops.nextToken, data.accessGroups.nextToken, data.activities.nextToken);
      } else {
        return;
      }
    } catch(error) {
      logger.error("Error thrown getting skills from the graph", error);
      throw error;
    }
  };

  await getPageResults(true, null, null, null, null);

  dispatch({
    type: "loadProfileOptions",
    payload: {
      profiles,
      screenPops,
      accessGroups,
      activities
    }
  });

  return;
};

export const loadSoftphoneConfigRelationships = async (profiles: UMSoftphoneConfiguration[], dispatch: (action: Action) => void, callback: () => void) => {
  const results = await Promise.allSettled(profiles.map(async (p: UMSoftphoneConfiguration) => {
    const formattedProfile: UMSoftphoneConfiguration =  {
      ...p,
      accessGroup: null,
      activities: [],
      dialListNumbers: [],
      directoryNumbers: []
    };
    const profileId = p.profile_id;

    const getPageResults = async (
      isFirstQuery: boolean,
      activityNextToken?: string,
      directoryNextToken?: string,
      dialListNextToken?: string
    ): Promise<UMSoftphoneConfiguration> => {
      try {
        const {
          errors, data
        }: any = await apolloClient.query<{ results: any }>({
          query: getSoftphoneConfigRelationshipsQuery(profileId, {
            activityNextToken,
            directoryNextToken,
            dialListNextToken,
            isFirstQuery
          }),
          variables: {}
        });

        if(data?.accessGroup) { formattedProfile.accessGroup = data.accessGroup; }
        if(data?.activities?.items?.length) { formattedProfile.activities = [...formattedProfile.activities, ...data.activities.items]; }
        if(data?.directoryNumbers?.items?.length) { formattedProfile.directoryNumbers = [...formattedProfile.directoryNumbers, ...data.directoryNumbers.items]; }
        if(data?.dialListNumbers?.items?.length) { formattedProfile.dialListNumbers = [...formattedProfile.dialListNumbers, ...data.dialListNumbers.items]; }

        //Test Next Token functionality specifically in unit test

        if(errors?.length && !errors.every((e: any) => e.errorType === "NOT_FOUND")) { throw errors; }

        if(data?.actvities?.nextToken || data?.directoryNumbers?.nextToken || data?.dialListNumbers?.nextToken){
          return getPageResults(false, data.actvities.nextToken, data.directoryNumbers.nextToken, data.dialListNumbers.nextToken);
        } else {
          return formattedProfile;
        }
      } catch(error) {
        logger.error(`Error thrown getting profile relationship items for ${p}`, error);
        return formattedProfile;
      }
    };

    return await getPageResults(true, null, null, null);
  }));

  dispatch(({
    type: "loadPaginatedResults",
    payload: {
      type: "UMSoftphoneConfiguration",
      results: results.map((r: any) => r.value),
      isFirstPage: true
    }
  }));
};

export const createProfile = async (profile: ProfilePayload): Promise<any> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ profile: UMSoftphoneConfiguration }>({
    mutation: CREATE_SOFTPHONE_CONFIG,
    variables: {
      input: profile
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.profile;
};

export const editProfile = async (profile_id: number, profile: Partial<ProfilePayload>): Promise<any> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ profile: UMSoftphoneConfiguration }>({
    mutation: UPDATE_SOFTPHONE_CONFIG,
    variables: {
      input: profile,
      profile_id
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.profile;
};

export const deleteProfile = async (profile_id: number): Promise<any> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ profile: UMSoftphoneConfiguration }>({
    mutation: DELETE_SOFTPHONE_CONFIG,
    variables: {
      profile_id
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.profile;
};

export const createDialListEntry = async (dialListEntry: Partial<DialListNumber>) => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ dialListEntry: DialListNumber }>({
    mutation: CREATE_DIAL_LIST_ENTRY,
    variables: {
      input: dialListEntry
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.dialListEntry;
};

export const editDialListEntry = async (id: string, profile_id: number, dialListEntry: Partial<DialListNumber>) => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ dialListEntry: DialListNumber }>({
    mutation: UPDATE_DIAL_LIST_ENTRY,
    variables: {
      profile_id,
      id,
      input: dialListEntry
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.dialListEntry;
};

export const deleteDialListEntry = async (id: string, profile_id: number) => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ dialListEntry: DialListNumber }>({
    mutation: DELETE_DIAL_LIST_ENTRY,
    variables: {
      id,
      profile_id
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.dialListEntry;
};

export const createDirectoryEntry = async (directoryEntry: Partial<DirectoryNumber>) => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ directoryEntry: DirectoryNumber }>({
    mutation: CREATE_DIRECTORY_ENTRY,
    variables: {
      input: directoryEntry
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.directoryEntry;
};

export const editDirectoryEntry = async (id: string, profile_id: number, directoryEntry: Partial<DirectoryNumber>) => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ directoryEntry: DirectoryNumber }>({
    mutation: UPDATE_DIRECTORY_ENTRY,
    variables: {
      profile_id,
      id,
      input: directoryEntry
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.directoryEntry;
};

export const deleteDirectoryEntry = async (id: string, profile_id: number) => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ directoryEntry: DirectoryNumber }>({
    mutation: DELETE_DIRECTORY_ENTRY,
    variables: {
      id,
      profile_id
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.directoryEntry;
};