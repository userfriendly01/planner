import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const terminateUser = (accessToken: string, payload: any) => myAxios.post(apiPaths.TERMINATE_WORKER(payload.nNumber), payload, {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
});