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
  const teams = groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TEAM);
  return teams.map(team => {
    delete team.agents;
    return team;
  });
};

export const formatCalabrioGroups = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  const groups = groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.GROUP);
  return groups.map(group => {
    delete group.agents;
    return group;
  });
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

    await Promise.all(users.map(async u => {
      if(u.acdId === acdId){
        throw new Error("Calabrio Record with this ACD Id already exists. New Record should not be added.");
      }

      if (u.adLogin === adLogin) {
        console.log("Fetched conflicting user: ", user);
        user.adLogin = `xx-${u.id}-${u.adLogin}`;
        await updateCalabrioUser(u.id, user);
      }

      if(u.email === email){
        console.log("Fetched conflicting user: ", user);
        user.email = `xx-${u.id}-${u.email}`;
        await updateCalabrioUser(u.id, user);
      }
    }));
  } catch(err) {
    console.error("Error thrown trying to fetch and validate Conflicting Users");
  }
  return;
};

export const checkDuplicateRecords = async (user: CalabrioUser, users: CalabrioUser[]): Promise<ConflictingUserResult> => {
  const email = user.email;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const adLogin = user.adLogin;
  const acdId = user.acdId;

  console.warn("**User in check duplicates", user);

  if(user){
    await Promise.all(users.map(async u => {
      console.warn("individual User", u);

      if(u.email?.includes(email) && u.acdId !== acdId ){
        return Promise.reject({
          conflictFound: true,
          duplicateUser: u,
          scenario: 3,
          searchBy: searchByOptions.NAME
        });
      }

      if (u.adLogin?.includes(adLogin) && u.skillId !== acdId) {
        return Promise.reject({
          conflictFound: true,
          duplicateUser: u,
          scenario: 4,
          searchBy: firstName && lastName ? searchByOptions.NAME : searchByOptions.N_NUMBER
        });
      }
    }));
  }

  return {
    conflictFound: false
  };
};