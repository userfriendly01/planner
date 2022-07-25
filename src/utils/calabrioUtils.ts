import {
  calabrioGroupLevels,
  CalabrioUser,
  CalabrioGroup,
  ConflictingUserResult,
  searchByOptions
} from "../components/usermanagement/CallRecording/CallRecording.Interfaces";
import {
  getCalabrioUser,
  updateCalabrioUser
} from "services";

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

/*
  Used when creating a new Calabrio User.
  This method is used to identify existing Calabrio users that would prevent a new Calabrio User from being created.
  If any records are found, they are updated so as to not pose a conflict anymore.
  These checks are repeated after the Calabrio User is created so the merge users instructions can be provided to the admin.
  The duplicate fields that would prevent a Calabrio user from being created are email, acdId, or adLogin
*/
export const checkConflictingUsers = async (user: any, users: CalabrioUser[], roles: any[]): Promise<void> => {
  try {
    const email = typeof user.email === "string" ? user.email.toLowerCase() : user.email;
    const adLogin = typeof user.adLogin === "string" ? user.adLogin.toLowerCase() : user.adLogin;
    const acdId = user.acdId;
    const agentSyncRole = roles.find(r => r.name.toLowerCase().includes("agent-sync"));
    const defaultAgentSyncRole = {
      id: 3,
      name: "Agent-Sync Only;"
    };

    await Promise.all(users.map(async u => {
      if(u.acdId === acdId){
        throw new Error("Calabrio Record with this ACD Id already exists. New Record should not be added.");
      }

      const dupUserAdLogin = typeof u.adLogin === "string" ? u.adLogin.toLowerCase() : u.adLogin;
      const dupUserEmail = typeof u.email === "string" ? u.email.toLowerCase() : u.email;

      if (dupUserAdLogin === adLogin) {
        const res: CalabrioUser = await getCalabrioUser(u.id);
        const user = res.data;
        console.warn("Conflicting User Found: ", user);
        user.adLogin = `xx-${user.id}-${user.adLogin}`;
        user.roles = agentSyncRole ? [agentSyncRole] : [defaultAgentSyncRole];
        user.scope = {
          groups: [],
          teams: [],
          tenant: null
        };
        await updateCalabrioUser(user.id, user);
      }
      if(dupUserEmail === email){
        const res: CalabrioUser = await getCalabrioUser(u.id);
        const user = res.data;
        console.warn("Conflicting User Found: ", user);
        user.email = `xx-${user.id}-${user.email}`;
        user.roles = agentSyncRole ? [agentSyncRole] : [defaultAgentSyncRole];
        user.scope = {
          groups: [],
          teams: [],
          tenant: null
        };
        await updateCalabrioUser(user.id, user);
      }
    }));
  } catch(err) {
    console.error("Error thrown trying to fetch and validate Conflicting Users", err);
  }
  return;
};

export const checkDuplicateRecords = async (user: CalabrioUser, users: CalabrioUser[]): Promise<ConflictingUserResult> => {
  if(user){
    const email = typeof user.email === "string" ? user.email.toLowerCase() : user.email;
    const adLogin = typeof user.adLogin === "string" ? user.adLogin.toLowerCase() : user.adLogin;
    const acdId = typeof user.acdId === "string" ? user.acdId.toLowerCase() : user.acdId;

    await Promise.all(users.map(async u => {

      const dupUserAdLogin = typeof u.adLogin === "string" ? u.adLogin.toLowerCase() : u.adLogin;
      const dupUserEmail = typeof u.email === "string" ? u.email.toLowerCase() : u.email;
      const dupUserAcdId = typeof u.acdId === "string" ? u.acdId.toLowerCase() : u.acdId;

      if(dupUserEmail?.includes(email) && dupUserAcdId !== acdId ){
        return Promise.reject({
          conflictFound: true,
          duplicateUser: u,
          scenario: 3,
          searchBy: searchByOptions.NAME
        });
      }

      if (dupUserAdLogin?.includes(adLogin) && dupUserAcdId !== acdId) {
        return Promise.reject({
          conflictFound: true,
          duplicateUser: u,
          scenario: 4,
          searchBy: u.firstName && u.lastName ? searchByOptions.NAME : searchByOptions.N_NUMBER
        });
      }
    }));
  }

  return {
    conflictFound: false
  };
};