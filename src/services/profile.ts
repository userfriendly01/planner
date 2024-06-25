import { apiPaths } from "globals";
import { ProfilePayload } from "globals/interfaces";
import { myAxios } from "utils/myAxios";
import { getPaginatedResults } from "utils/graphUtils";
import { logger } from "utils/logger";
import {
  Action,
  UMSoftphoneConfiguration,
  DBList
}from "globals/interfaces";

export const listUMSoftphoneConfigurations = async (dispatch: (action: Action) => void): Promise<DBList<UMSoftphoneConfiguration>> => {
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

export const createProfile = (profile: ProfilePayload): Promise<any> => myAxios.post(apiPaths.PROFILES, profile);
export const editProfile = (profile: Partial<ProfilePayload>): Promise<any> => myAxios.put(`${apiPaths.PROFILES}/${profile.profile_id}`, profile);
