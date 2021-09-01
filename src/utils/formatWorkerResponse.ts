import { TwilioWorker } from "globals";
import { areSkillsDifferent } from "utils";

export interface DbWorker {
  attributes: {
    [key: string]: any,
  },
  activateEp: boolean,
  alternateDid: string,
  directDialNum: string,
  workerSid: string,
  zeroOutEnabled: boolean
  inactiveForwardTo?: string
}

export const formatWorkerResponse = (response: DbWorker[]): TwilioWorker[] => {
  if (response) {
    const formattedWorkers = response.map(mapWorkerFromDbWorker);
    return formattedWorkers;
  } else {
    return [];
  }
};

export const mapWorkerFromDbWorker = (dbWorker: DbWorker): TwilioWorker => {
  const twilioWorker = {
    ...dbWorker,
    sid: dbWorker.workerSid,
    skillsDifferent: dbWorker.attributes ? areSkillsDifferent(dbWorker.attributes) : false
  };
  delete twilioWorker.workerSid;
  return twilioWorker;
};
