export const formatWorkerResponse = response => {
  if (response) {
    const formattedWorkers = response.map(mapWorkerFromTwilioWorker);
    return formattedWorkers;
  } else {
    return [];
  }
};

export const mapWorkerFromTwilioWorker = twilioWorker => ({
  attributes: JSON.parse(twilioWorker.attributes),
  id: twilioWorker.friendlyName,
  sid: twilioWorker.sid
});