import { AppState } from "globals";

export const setAuthenticatedUserState = (state: AppState, dispatch: any) => {
  const profileId = getWorkerProfileId(state);
  const isAdmin = checkIfAdmin(profileId);
  dispatch({
    type: "setAuthenticationOnUser",
    payload: {
      profileId,
      isAdmin
    }
  });
};

const checkIfAdmin = (profileId: number) => {
  return profileId === 0;
};

const getWorkerProfileId = (state: AppState) => {
  console.log("STATE WHEN WE LOOK FOR PROFILE ID", state);
  let loggedInWorker: any = {};
  const nNumber = state.userContext.pingIdentity.sub;
  state.workerContext.workers.forEach((worker: any) =>{
    if(worker.attributes?.n_number?.toLowerCase() === nNumber.toLowerCase()){
      loggedInWorker = worker;
    }
  });

  return loggedInWorker?.attributes?.profile_id;
};