import {
  AppState,
  Worker
} from "globals";
import {
  adGroupPermissionMapping,
  authenticationProfiles,
  Permissions,
  startupProfiles
} from "../authentication";

export const checkIfAdmin = (profileId: number): boolean => {
  return profileId === 0;
};

export const getWorkerProfileId = (nNumber: string, workers: Worker[]): number => {
  let loggedInWorker: Worker;
  workers.forEach((worker: Worker) =>{
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

export const getAdGroups = (unformattedGroups: string[]): string[] => {
  const adgroups: string[] = [];
  unformattedGroups.map((string: string) => {
    string.split(",").forEach(adgroup => {
      adgroups.push(adgroup.toLowerCase());
    });
  });
  return adgroups;
};

export const getPermissions = (unformattedAdGroups: string[]): any[] => {
  console.log("*** unformatted AD groups", unformattedAdGroups);
  const myAdGroups = getAdGroups(unformattedAdGroups);
  console.warn("*** adGroupPermissionMapping", adGroupPermissionMapping);
  return adGroupPermissionMapping.filter((permission: any) =>
    myAdGroups.includes(`cn=${permission.adGroup.toLowerCase()}`));
};

export const getStartups = (permissions: any[]): any[] => {
  const startups: any[] = [];
  permissions.forEach((p: any) => {
    console.log("startup compare", startups, p.startup.name);
    const matchingStartup = startups.find(s => s.name === p.startup.name);
    if(!matchingStartup){
      startups.push(p.startup.function);
    }
  });
  return startups;
};


export const getAuthenticationProfiles = (permissions: any[], nNumber: any, startups: any[]) => {
  const myProfiles: any[] = [];
  permissions.forEach(p => {
    const matchingProfile = myProfiles.find(a => a.name === p.authenticationProfile.name);
    if(!matchingProfile){
      if(p.permissionLevel === Permissions.WRITE){
        p.authenticationProfile.permissionLevel = Permissions.WRITE;
      }
      myProfiles.push(p.authenticationProfile);
    } else if(matchingProfile && matchingProfile.permissionLevel === Permissions.READ) {
      if(p.permissionLevel === Permissions.WRITE){
        const updatePermissionIndex = myProfiles.indexOf(myProfiles.find(a => a.name === p.authenticationProfile.name));
        myProfiles[updatePermissionIndex].permissionLevel = Permissions.WRITE;
      }
    }
  });
  checkTritonProfileAuthentication(myProfiles, nNumber, startups);
  return myProfiles;
};

const checkTritonProfileAuthentication = (myProfiles: any[], nNumber: any, startups: any[]) => {
  const tritonProfile = myProfiles.find(a => a.name === authenticationProfiles.TRITON.name);
  const tritonStartupResponse = startups.find((resArray: any[]) => resArray[0] === startupProfiles.TRITON.name);
  console.log("tritonStartupResponse", tritonStartupResponse);
  if(tritonProfile && tritonStartupResponse ){
    const profileId = getWorkerProfileId(nNumber, tritonStartupResponse[1]);
    const updatePermissionIndex = myProfiles.indexOf(myProfiles.find(a => a.name === authenticationProfiles.TRITON.name));
    myProfiles[updatePermissionIndex].isAdmin = checkIfAdmin(profileId);
    myProfiles[updatePermissionIndex].profileId = profileId;
  }
};