import { TwilioWorker } from "context";
import { apiPaths }from "globals";
import { myAxios, RawTwilioWorker } from "utils";

export const createUser = (workerAttributes: Partial<TwilioWorker["attributes"]>): Promise<RawTwilioWorker> =>
  myAxios.post(apiPaths.CREATE_WORKER, { attributes: workerAttributes })
    .then(response => response.data);