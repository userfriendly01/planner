import { TwilioWorker } from "context";
import { apiPaths }from "globals";
import { myAxios, RawTwilioWorker } from "utils";

export const updateUser = (workerSid: string, attributes: Partial<TwilioWorker["attributes"]>): Promise<RawTwilioWorker> =>
  myAxios.post(apiPaths.UPDATE_WORKER_ATTRIBUTES, {
    workerSid,
    attributes
  })
    .then(response => response.data);