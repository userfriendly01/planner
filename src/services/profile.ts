import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import {
  AccessGroup,
  AccessGroupPayload,
  Activity,
  CallTag,
  DialListNumber,
  DirectoryNumber,
  ProfilePayload
} from "globals/interfaces";
import { logger } from "utils/logger";
import {
  Action,
  UMSoftphoneConfiguration
}from "globals/interfaces";
import {
  CREATE_ACCESS_GROUP,
  CREATE_DIAL_LIST_ENTRY,
  CREATE_DIRECTORY_ENTRY,
  CREATE_SOFTPHONE_CONFIG,
  DELETE_DIAL_LIST_ENTRY,
  DELETE_DIRECTORY_ENTRY,
  DELETE_SOFTPHONE_CONFIG,
  UPDATE_DIAL_LIST_ENTRY,
  UPDATE_DIRECTORY_ENTRY,
  UPDATE_SOFTPHONE_CONFIG,
  getSoftphoneConfigRelationshipsQuery
} from "globals/profile";

const formatActivity = (activity: Activity): Activity => ({
  ...activity,
  activity_name: `${activity.activity_name} ${activity.available ? "(A)" : "(U)"}`
});

export const loadSoftphoneConfigRelationships = async (profileContext: any, dispatch: (action: Action) => void, callback?: () => void) => {
  const profiles = profileContext.profiles;
  const availableCallTags: Partial<CallTag>[] = [];
  const results = await Promise.allSettled(profiles.map(async (p: UMSoftphoneConfiguration) => {
    const profileId = p.profile_id;

    try {
      const {
        errors, data
      }: any = await apolloClient.query<{ results: any }>({
        query: getSoftphoneConfigRelationshipsQuery(profileId),
        variables: {}
      });

      if(errors?.length) { throw errors; }
      data.profile.call_tags?.forEach((profileTag: CallTag) => {
        if(!availableCallTags.some((tag: Partial<CallTag>) => tag.attribute_name === profileTag.attribute_name)){
          availableCallTags.push({
            attribute_name: profileTag.attribute_name,
            display_name: profileTag.display_name
          });
        }
      });
      return {
        ...data.profile,
        activities: data.profile.activities?.map((a: Activity) => formatActivity(a))

      };
    } catch(error) {
      logger.error(`Error thrown getting profile relationship items for profile ${p.profile_id}`, error);
      return p;
    }
  }));

  const formattedProfiles = results.map((r: any) => r.value);
  const formatAccessGroup = (accessGroup: AccessGroup): AccessGroup => ({
    ...accessGroup,
    viewable_profiles: formattedProfiles.filter((profile: UMSoftphoneConfiguration) => profile.access_group?.id === accessGroup.id).map((profile: UMSoftphoneConfiguration) => `${profile.profile_id}-${profile.profile_name}`)
  });

  dispatch(({
    type: "loadProfileOptions",
    payload: {
      profiles: formattedProfiles,
      calltags: availableCallTags,
      accessGroups: profileContext.accessGroups?.map((accessGroup: AccessGroup) => formatAccessGroup(accessGroup))
    }
  }));

  if(callback) { callback(); }
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

export const createAccessGroup = async (accessGroup: AccessGroupPayload): Promise<any> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ accessGroup: UMSoftphoneConfiguration }>({
    mutation: CREATE_ACCESS_GROUP,
    variables: {
      input: accessGroup
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.accessGroup;
};