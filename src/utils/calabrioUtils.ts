import { calabrioGroupLevels } from "globals";
import {
  getCalabrioUser,
  updateCalabrioUser
} from "services";

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

/*
  Used when creating a new Calabrio User.
  This method is used to identify existing Calabrio users that would prevent a new Calabrio User from being created.
  If any records are found, they are updated so as to not pose a conflict anymore.
  These checks are repeated after the Calabrio User is created so the merge users instructions can be provided to the admin.
  The duplicate fields that would prevent a Calabrio user from being created are email, acdId, or adLogin
*/
export const checkConflictingUsers = async (user: any, users: CalabrioUser[]): Promise<void> => {
  try {
    const email = user.email;
    const acdId = user.acdId;
    const adLogin = user.adLogin;

    users.forEach(async u => {
      if(u.acdId === acdId){
        throw new Error("Calabrio Record with this ACD Id already exists. New Record should not be added.");
      }

      if (u.adLogin === adLogin) {
        const user: CalabrioUser = await getCalabrioUser(u.personId);
        console.log("Fetched conflicting user: ", user);
        user.adLogin = `xx-${user.adLogin}`;
        await updateCalabrioUser(u.personId, user);
      }

      if(u.email === email){
        const user: CalabrioUser = await getCalabrioUser(u.personId);
        console.log("Fetched conflicting user: ", user);
        user.email = `xx-${user.email}`;
        await updateCalabrioUser(u.personId, user);
      }
    });
  } catch(err) {
    console.error("Error thrown trying to fetch and validate Conflicting Users");
  }
  return;
};

export const checkDuplicateRecords = async (user: CalabrioUser, nNumber: string, users: CalabrioUser[]): Promise<ConflictingUserResult> => {
  const email = user.email;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const personId = user.personId;

  users.forEach(async user => {

    if(user.email.includes(email)){
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
        searchBy: firstName && lastName ? searchByOptions.NAME : searchByOptions.N_NUMBER
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
  //Then we will fetch the worker from Twilio.. if the n# is the same, we will delete the Triton Worker and inactivate the Calabrio worker

  return {
    conflictFound: false
  };
};