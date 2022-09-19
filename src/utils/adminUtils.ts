import { AppState } from "globals";


export const checkIfAdmin = (profileId: number) => {
  return profileId === 0;
};

export const getWorkerProfileId = (state: AppState) => {
  let loggedInWorker: any = {};
  const nNumber = state.userContext.pingIdentity?.sub;
  state.workerContext.workers.forEach((worker: any) =>{
    if(worker.attributes?.n_number?.toLowerCase() === nNumber.toLowerCase()){
      loggedInWorker = worker;
    }
  });

  return loggedInWorker?.attributes?.profile_id;
};