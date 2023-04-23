import {
  AppState,
  WfmBusinessUnit,
  WfmTeam,
  WfmUser,
  Worker
} from "globals";

export const findMatchingTritonWorker = (wfmUser: WfmUser, state: AppState) => {
  const workers: Worker[] = state.workerContext.workers;
  let worker: Worker = null;

  const wfmNNumber = wfmUser.EmploymentNumber?.toLowerCase();
  const wfmIdentity = wfmUser.Identity?.toLowerCase();
  const wfmEmail = wfmUser.Email?.toLowerCase();

  workers.forEach((w: Worker) => {
    if(!worker){
      const workerNNumber = w.attributes.n_number?.toLowerCase();
      const workerEmail = w.attributes.email?.toLowerCase();

      if(wfmNNumber === workerNNumber){
        worker = w;
      } else if(wfmIdentity === workerEmail){
        worker = w;
      } else if(wfmEmail === workerEmail){
        worker = w;
      }
    }
  })

  return worker;
};

export const getWfmBusinessUnits = (state: AppState) => {
  const wfmOrg = state.calabrioContext.wfmOrg;
  return wfmOrg.map((businessUnit: WfmBusinessUnit) => {
    return {
      Id: businessUnit.Id,
      Name: businessUnit.Name
    }
  });
};

export const getWfmTeams = (state: AppState, businessUnitId?: string) => {
  const wfmTeams: WfmTeam[] = [];
  
  if(businessUnitId){
    const businessUnit = state.calabrioContext.wfmOrg.find((bu: WfmBusinessUnit) => bu.Id === businessUnitId);
    businessUnit.Teams.forEach((team: WfmTeam) => wfmTeams.push(team));
  } else {
    state.calabrioContext.wfmOrg.forEach((businessUnit: WfmBusinessUnit) => {
      businessUnit.Teams.forEach((team: WfmTeam) => wfmTeams.push(team));
    });
  }
  return wfmTeams;
};

export const getWfmPeople = (state: AppState) => {
  const wfmPeople: WfmUser[] = [];
  const wfmTeams: WfmTeam[] = getWfmTeams(state);

  state.calabrioContext.wfmOrg.forEach((businessUnit: WfmBusinessUnit) => {
    businessUnit.People_Without_Team?.forEach((person: WfmUser) => wfmPeople.push(person));
  });

  wfmTeams.forEach((team: WfmTeam) => {
    team.People?.forEach((person: WfmUser) => wfmPeople.push({
      ParentTeam: team.Id,
      ...person
    }));
  });

  return wfmPeople;
};