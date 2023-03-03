import { Worker } from "globals";
import { areSkillsDifferent } from "utils";

export interface DbWorker {
  attributes: {
    [key: string]: any,
  },
  activateEp: boolean,
  alternateDid: string,
  directDialNum: string,
  operatingUnitSid?: string,
  workerSid: string,
  zeroOutEnabled: boolean
  inactiveForwardTo?: string
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
  if (worker.attributes?.manager_n_number) {
    worker.attributes.manager_n_number = worker.attributes.manager_n_number.toLowerCase();
  }
  return worker;
};