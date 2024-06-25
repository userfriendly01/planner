import { apiPaths } from "globals";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import {
  ProfilePayload, UMUser
} from "globals/interfaces";
import { myAxios } from "utils/myAxios";
import { getPaginatedResults } from "utils/graphUtils";
import { logger } from "utils/logger";
import {
  Action,
  UMSoftphoneConfiguration,
  DBList
}from "globals/interfaces";
import {
  LIST_USER_RECORDS,
  getSoftphoneConfigRelationshipsQuery
} from "globals/graphql";

export const listUMSoftphoneConfigs = async (dispatch: (action: Action) => void): Promise<DBList<UMSoftphoneConfiguration>> => {
  try {
    await getPaginatedResults("UMSoftphoneConfiguration", dispatch);
    return;
  } catch(error) {
    logger.error("Failed to fetch profiles from graph", { error });
    throw ({
      error,
      msg: "Failed to fetch profiles from graph"
    });
  }
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
        if(data?.dialListNumbers?.items?.length) { formattedProfile.dialListNumbers = [...formattedProfile.dialListNumbers, ...data.dialListNumbers.items]; }
        if(data?.directoryNumbers?.items?.length) { formattedProfile.directoryNumbers = [...formattedProfile.directoryNumbers, ...data.directoryNumbers.items]; }

        //Test Next Token functionality specifically in unit test

        if(errors?.length && !errors.every((e: any) => e.errorType === "NOT_FOUND")) { throw errors; }

        if(data?.actvities?.nextToken || data?.directoryNextToken?.nextToken || data?.dialListNextToken?.nextToken){
          return getPageResults(false, data.actvities.nextToken, data.directoryNextToken.nextToken, data.dialListNextToken.nextToken);
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

export const createProfile = (profile: ProfilePayload): Promise<any> => myAxios.post(apiPaths.PROFILES, profile);
export const editProfile = (profile: Partial<ProfilePayload>): Promise<any> => myAxios.put(`${apiPaths.PROFILES}/${profile.profile_id}`, profile);
