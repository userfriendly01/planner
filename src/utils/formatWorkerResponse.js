import { areSkillsDifferent } from "utils";

export const formatWorkerResponse = response => {
  if (response) {
    const formattedWorkers = response.map(mapWorkerFromTwilioWorker);
    return formattedWorkers;
  } else {
    return [];
  }
};

export const mapWorkerFromTwilioWorker = twilioWorker => {
  let attributes = {};
  try {
    attributes = JSON.parse(twilioWorker.attributes);
  } catch (error) {
    console.error("mapWorkerFromTwilioWorker - Failed to parse worker attributes to JSON", {
      twilioWorker,
      error
    });
  }
  const skillsDifferent = areSkillsDifferent(attributes);
  return {
    attributes,
    id: twilioWorker.friendlyName,
    sid: twilioWorker.sid,
    skillsDifferent
  };
};