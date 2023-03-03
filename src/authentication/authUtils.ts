import { Worker } from "globals";
import {
  getAdGroupPermissionMapping,
  getAuthenticationProfileTemplates,
  Permissions,
  getStartupProfiles
} from "authentication";

export const checkIfAdmin = (profileId: number): boolean => {
  return profileId === 0;
};

export const checkIfLowerEnv = (): boolean => {
  return ["local", "development", "test", "staging"].includes(process.env.APP_ENV);
};

export const checkIfPO = (nNumber: string): boolean => {
  const productOwners = [
    "n0138110",
    "n0116796",
    "n0088625",
    "n0183277",
    "n0196231",
    "n0050481"
  ];

  if (checkIfLowerEnv()){
    return true;
  }

  return productOwners.includes(nNumber.toLowerCase());
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

const formatAdGroups = (unformattedGroups: string[]): string[] => {
  const adgroups: string[] = [];
  unformattedGroups.map((string: string) => {
    string.split(",").forEach(adgroup => {
      adgroups.push(adgroup.toLowerCase());
    });
  });
  return adgroups;
};

export const getPermissions = (unformattedAdGroups: string[]): any[] => {
  const myAdGroups = formatAdGroups(unformattedAdGroups);
  return getAdGroupPermissionMapping().filter((permission: any) =>
    myAdGroups.includes(`cn=${permission.adGroup.toLowerCase()}`));
};

export const getStartups = (permissions: any[]): any[] => {
  const startups: any[] = [];
  permissions.forEach((p: any) => {
    const matchingStartup = startups.find(s => s === p.startup.function);
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
  const tritonProfile = myProfiles.find(a => a.name === getAuthenticationProfileTemplates().TRITON.name);
  const tritonStartupResponse = startups.find((resArray: any[]) => resArray[0] === getStartupProfiles().TRITON.name);
  if(tritonProfile && tritonStartupResponse ){
    const profileId = getWorkerProfileId(nNumber, tritonStartupResponse[1]);
    const updatePermissionIndex = myProfiles.indexOf(myProfiles.find(a => a.name === getAuthenticationProfileTemplates().TRITON.name));
    myProfiles[updatePermissionIndex].isAdmin = checkIfAdmin(profileId);
    myProfiles[updatePermissionIndex].profileId = profileId;
  }
};