import {
  AppState,
  Worker
} from "globals";

export const checkIfAdmin = (profileId: number): boolean => {
  return profileId === 0;
};

export const getWorkerProfileId = (state: AppState): number => {
  let loggedInWorker: Worker;
  const nNumber = state.userContext.pingIdentity?.sub;
  state.workerContext.workers.forEach((worker: Worker) =>{
    if(worker.attributes?.n_number?.toLowerCase() === nNumber.toLowerCase()){
      loggedInWorker = worker;
    }
  });

  const profileId = loggedInWorker?.attributes?.profile_id;
  if(typeof profileId === "string"){
    return parseInt(profileId);
  } else if(typeof profileId === "number"){
    return profileId;
  } else {
    return null;
  }
};