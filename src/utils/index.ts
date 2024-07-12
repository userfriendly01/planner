import {
  UMUser
} from "globals/interfaces";
import { areSkillsDifferent } from "utils/skillsUtils";

export const wait = (callback: () => void, waitTimeMs: number) => setTimeout(callback, waitTimeMs);

export const isNotEmptyString = (value: string): boolean => {
  return !!(value && value.trim().length > 0);
};

export const escapeQuotes = (payload: string): string => {
  const replaceAll = (string: string, search: string, replace: string) => {
    return string.split(search).join(replace);
  };
  let finalPayload = payload;
  finalPayload = replaceAll(finalPayload, "'", "\\'");
  finalPayload = replaceAll(finalPayload, "\"", "\\\"");
  return finalPayload;
};

export const isErrorIn400s = (statusCode?: string) => {
  if (statusCode) {
    const str = statusCode.toString();
    const firstDigit = str.slice(0, 1);
    if (typeof statusCode === "number" && str.length === 3 && firstDigit === "4") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const mapWorkerFromTwilio = (dbWorker: UMUser): UMUser => {
  const worker = {
    ...dbWorker,
    sid: dbWorker.workerSid,
    skillsDifferent: dbWorker.attributes ? areSkillsDifferent(dbWorker.attributes) : false
  };
  delete worker.workerSid;
  if (worker.attributes?.manager_n_number) {
    worker.attributes.manager_n_number = worker.attributes.manager_n_number.toLowerCase();
  }
  //sometimes Twilio flops and cant populate full name - this will be more reliable
  if(dbWorker.attributes?.emp_first_name && dbWorker.attributes?.emp_last_name){
    worker.attributes.full_name = `${dbWorker.attributes?.emp_first_name} ${dbWorker.attributes?.emp_last_name}`;
  }
  return worker;
};