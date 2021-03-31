import { TwilioWorker } from "context";
import { areSkillsDifferent } from "utils";

// Worker object directly from cicct-twilio-worker-api response
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

// Worker object directly from twilio API response
export interface RawTwilioWorker {
  // more attributes here that we don't care about
  attributes: string, // unparsed JSON string
  friendlyName: string,
  sid: string
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

// export const mapWorkerFromTwilioWorker = (rawTwilioWorker: RawTwilioWorker): TwilioWorker => {
//   let attributes = {};
//   try {
//     attributes = JSON.parse(rawTwilioWorker.attributes);
//   } catch (error) {
//     console.error("mapWorkerFromTwilioWorker - Failed to parse worker attributes to JSON", {
//       rawTwilioWorker,
//       error
//     });
//   }
//   const skillsDifferent = areSkillsDifferent(attributes);
//   return {
//     attributes,
//     sid: rawTwilioWorker.sid,
//     skillsDifferent
//   };
// };