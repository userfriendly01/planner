import { apiPaths } from "globals";
import { ProfilePayload } from "globals/interfaces";
import { myAxios } from "utils/myAxios";

export const createProfile = (profile: ProfilePayload): Promise<any> => myAxios.post(apiPaths.PROFILES, profile);
export const editProfile = (profile: Partial<ProfilePayload>): Promise<any> => myAxios.put(`${apiPaths.PROFILES}/${profile.profile_id}`, profile);
