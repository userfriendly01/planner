import { env } from "globals";
import { listUMUserRecords } from "services";

const productOwners = [
  "n0138110", // Keith Teeter
  "n0116796", // Rebecca Miller
  "n0088625", // Kimberly Haynes
  "n0183277", // Jacob Radke
  "n0196231", // Michael Wilcox
  "n0197784", // Anthony Burke
  "n0149889"  // David Kahrer
];

const bulkAdmins = [
  ...productOwners,
  "n0197784", // Anthony Burke
  "n0149889", // David Kahrer
  "n0169879", // Stephanie Miller
  "n0346287"  // Dustin Shumaker
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
  const loggedInWorker: any = await listUMUserRecords(nNumber);
  const profileId = loggedInWorker.twilio_attributes?.profile_id;
  return profileId;
};
