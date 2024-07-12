import { env } from "globals";
import { listUMUserRecords } from "services/user";

const productOwners = [
  "n0116796", // Rebecca Miller
  "n0088625", // Kimberly Haynes
  "n0183277", // Jacob Radke
  "n0196231", // Michael Wilcox,
  "n0149889", // David Kahrer
  "n0197784" // Anthony Burke
];

const bulkAdmins = [
  ...productOwners,
  "n0169879" // Stephanie Miller
];

export const checkIfAdmin = (profileId: number): boolean => {
  return profileId === 0;
};

export const checkIfLowerEnv = (): boolean => {
  return ["local", "development", "test", "staging"].includes(env.APP_ENV);
};

export const checkIfBulkAdmin = (nNumber: string): boolean => {
  if (checkIfLowerEnv()){
    return true;
  }

  return bulkAdmins.includes(nNumber.toLowerCase());
};

export const checkIfPO = (nNumber: string): boolean => {
  if (checkIfLowerEnv()){
    return true;
  }

  return productOwners.includes(nNumber.toLowerCase());
};

export const getWorkerProfileId = async (nNumber: string): Promise<number> => {
  let primaryWorker;
  try {
    ([primaryWorker] = await listUMUserRecords(nNumber));
  } catch(_){
    // Skip
  }

  return primaryWorker?.attributes?.profile_id !== undefined
    ? primaryWorker.attributes.profile_id
    : -1;
};
