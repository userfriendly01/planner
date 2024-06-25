import { apiPaths } from "globals";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { ProfilePayload, UMUser } from "globals/interfaces";
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
  const isFirstQuery = true;
  const profileId = 26;
  const parameters: any = {
    accessGroupNextToken: null,
    activityNextToken: null,
    directoryNextToken: null,
    dialListNextToken: null,
    skillsNextToken: null,
    isFirstQuery
  };

  try {

    const {
      errors, data
    }: any = await apolloClient.query<{ results: DBList<UMUser | null> }>({
      query: LIST_USER_RECORDS.query,
      variables: {
        n_number: "n02632155"
      }
    });

    console.log("FAITH DID THIS WORK", data);

  } catch(error) {
    console.log("FAITH ERROR BLOCK", error.message);
    logger.error("Error thrown getting softphone relationship items", error);
  }
};

export const createProfile = (profile: ProfilePayload): Promise<any> => myAxios.post(apiPaths.PROFILES, profile);
export const editProfile = (profile: Partial<ProfilePayload>): Promise<any> => myAxios.put(`${apiPaths.PROFILES}/${profile.profile_id}`, profile);
