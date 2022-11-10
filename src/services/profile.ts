import {
  apiPaths,
  ProfilePayload
} from "globals";
import { myAxios } from "utils";

export const createProfile = (profile: ProfilePayload): Promise<any> => myAxios.post(apiPaths.PROFILES, profile);
export const editProfile = (profile: Partial<ProfilePayload>): Promise<any> => myAxios.put(`${apiPaths.PROFILES}/${profile.profile_id}`, profile);
