export const formatWorkerResponse = response => {
  if (response) {
    const formattedWorkers = response.map(worker => {
      const workerObj = {};
      workerObj.attributes = JSON.parse(worker.attributes);
      workerObj.id = worker.friendlyName;
      workerObj.sid = worker.sid;
      return workerObj;
    });
    return formattedWorkers;
  } else {
    return [];
  }
};
