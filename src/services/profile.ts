import {
  apiPaths,
  ProfilePayload
} from "globals";
import { myAxios } from "utils";

export const createProfile = (profile: ProfilePayload): Promise<any> => myAxios.post(apiPaths.PROFILES, profile);
