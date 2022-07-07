import { calabrioGroupLevels } from "globals";

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

const conflictingUserResultOptions = {
  NO_ACTION: "No Action Taken",
  CALABRIO_RECORD_INACTIVATED: "Existing Calabrio Records were found and Inactivated",
  TWILIO_WORKER_DELETED: "A worker with the same n# has been detected in Twilio and deleted"
};

interface ConflictingUserResult {
  id: string | number | null,
  result: string
}
export const deleteConflictingUsers = async (user: CalabrioUser, nNumber: string, users: CalabrioUser[]): Promise<ConflictingUserResult[]> => {
  const email = user.email;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const personId = user.personId;
  const results: ConflictingUserResult[] = [];

  users.forEach(async user => {
    if (user.adLogin.includes(nNumber)) {
      await console.log("delete Calabrio record");
    }

    if(user.email === email){
      await console.log("delete Calabrio record");
    }

    if (user.firstName === firstName && user.lastName === lastName){
      await console.log("delete Twilio worker and User Record");
    }
  });

  //Question for Kim - Do you want confirmations for these steps or just keep it behind the scenes
  //Need to update the check for duplicate agent check to look for agents in Twilio without records in the DB
  //Considerations on dup fields - if we're going to update a record we have to do all the clean up checks first

  return results;
  //Will searchby first and last name,
  //If a record is found we will fetch the full user from Calabrio
  //Then we will fetch the worker from Twilio.. if the n# is the same, we will delete the Triton Worker and inactivate the Calabrio worker
};