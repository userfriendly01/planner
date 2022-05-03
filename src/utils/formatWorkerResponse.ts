import { Worker } from "globals";
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

export interface TwilioWorker {
  sid: string,
  attributes: {
    [key: string]: any
  }
}

export const formatWorkerResponse = (response: DbWorker[]): Worker[] => {
  if (response) {
    const formattedWorkers = response.map(mapWorkerFromDbWorker);
    return formattedWorkers;
  } else {
    return [];
  }
};

export const mapWorkerFromDbWorker = (dbWorker: DbWorker): Worker => {
  const worker = {
    ...dbWorker,
    sid: dbWorker.workerSid,
    skillsDifferent: dbWorker.attributes ? areSkillsDifferent(dbWorker.attributes) : false
  };
  delete worker.workerSid;
  return worker;
};

export const mapWorker = (twilioWorker : TwilioWorker): Worker => {
  const worker = {
    ...twilioWorker,
    skillsDifferent: twilioWorker.attributes ? areSkillsDifferent(twilioWorker.attributes) : false
  }

  return worker;
}
