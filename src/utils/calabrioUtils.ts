import { calabrioGroupLevels } from "globals";
import { getCalabrioUser } from "services";

export interface CalabrioUser {
    [key: string]: any,
    personId: number,
    firstName: string,
    lastName: string,
    email: string,
  }
export interface CalabrioGroup {
    groupId: number,
    name: string,
    displayId: null | number,
    parentGroupId: number,
    parentGroupName: string,
    groupLevel: string,
    agents?: CalabrioUser[]
  }

export const formatCalabrioTeams = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  return groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TEAM);
};

export const formatCalabrioGroups = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  return groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.GROUP);
};

export const formatCalabrioUsers = (groupsArray: CalabrioGroup[]): any[] => {
  const users: any[] = [];
  groupsArray.forEach((group: CalabrioGroup) => {
    if(group.agents){
      group.agents.forEach(agent => {
        users.push(agent);
      });
    }
  });
  return users;
};

export const searchByOptions = {
  NAME: "name",
  N_NUMBER: "nNumber",
  ACD_ID: "ACD ID"
};
interface ConflictingUserResult {
  conflictFound: boolean,
  duplicateUser?: CalabrioUser,
  scenario?: number,
  searchBy?: string,
}
export const checkConflictingUsers = async (user: CalabrioUser, nNumber: string, users: CalabrioUser[]): Promise<ConflictingUserResult> => {
  const email = user.email;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const personId = user.personId;

  users.forEach(async user => {

    if(user.email === email){
      const duplicateUser = await getCalabrioUser(personId);
      return {
        conflictFound: true,
        duplicateUser,
        scenario: 3,
        searchBy: searchByOptions.NAME
      };
    }

    if (user.adLogin.includes(nNumber)) {
      const duplicateUser = await getCalabrioUser(personId);
      return {
        conflictFound: true,
        duplicateUser,
        scenario: 4,
        searchBy: searchByOptions.N_NUMBER
      };
    }

    if (user.firstName === firstName && user.lastName === lastName){
      const duplicateUser = await getCalabrioUser(personId);
      return {
        conflictFound: true,
        duplicateUser,
        scenario: 6,
        searchBy: searchByOptions.NAME
      };
    }

    if(user.email.includes(nNumber)){
      const duplicateUser = await getCalabrioUser(personId);
      return {
        conflictFound: true,
        duplicateUser,
        scenario: 6,
        searchBy: searchByOptions.NAME
      };
    }
  });

  //Need to update the check for duplicate agent check to look for agents in Twilio without records in the DB
  //Considerations on dup fields - if we're going to update a record we have to do all the clean up checks first

  return {
    conflictFound: false
  };
  //Will searchby first and last name,
  //If a record is found we will fetch the full user from Calabrio
  //Then we will fetch the worker from Twilio.. if the n# is the same, we will delete the Triton Worker and inactivate the Calabrio worker
};