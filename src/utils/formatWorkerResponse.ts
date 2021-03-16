import { TwilioWorker } from "context";
import { areSkillsDifferent } from "utils";

// Worker object directly from twilio API response
export interface RawTwilioWorker {
  // more attributes here that we don't care about
  attributes: string, // unparsed JSON string
  friendlyName: string,
  sid: string
}

export const formatWorkerResponse = (response: RawTwilioWorker[]): TwilioWorker[] => {
  if (response) {
    const formattedWorkers = response.map(mapWorkerFromTwilioWorker);
    return formattedWorkers;
  } else {
    return [];
  }
};

export const mapWorkerFromTwilioWorker = (rawTwilioWorker: RawTwilioWorker): TwilioWorker => {
  let attributes = {};
  try {
    attributes = JSON.parse(rawTwilioWorker.attributes);
  } catch (error) {
    console.error("mapWorkerFromTwilioWorker - Failed to parse worker attributes to JSON", {
      rawTwilioWorker,
      error
    });
  }
  const skillsDifferent = areSkillsDifferent(attributes);
  return {
    attributes,
    sid: rawTwilioWorker.sid,
    skillsDifferent
  };
};