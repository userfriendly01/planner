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
  To understand this method, refer to this wiki: https://forge.lmig.com/wiki/display/CICCT/Calabrio+Form
*/
export const checkConflictingUsers = async (user: any, users: CalabrioUser[], roles: any[]): Promise<void> => {
  try {
    const {
      acdId,
      firstName,
      lastName
    } = user;
    const email = typeof user.email === "string" ? user.email.toLowerCase() : user.email;
    const adLogin = typeof user.adLogin === "string" ? user.adLogin.toLowerCase() : user.adLogin;
    const agentSyncRole = roles.find(r => r.name.toLowerCase().includes("agent-sync") || {
      id: 3,
      name: "Agent-Sync Only;"
    });

    console.warn("agentSyncRole", agentSyncRole);

    await Promise.all(users.map(async u => {
      if(u.acdId === acdId){
        throw new Error("Calabrio Record with this ACD Id already exists. New Record should not be added.");
      }

      const dupUserAdLogin = typeof u.adLogin === "string" ? u.adLogin.toLowerCase() : u.adLogin;
      const dupUserEmail = typeof u.email === "string" ? u.email.toLowerCase() : u.email;

      console.warn("Conflicting User Object: ", u);
      console.warn(`New User AdLogin: ${adLogin} - Conflicting User AdLogin ${dupUserAdLogin}`);
      console.warn(`New User email: ${email} - Conflicting User email ${dupUserEmail}`);

      if (dupUserAdLogin === adLogin || dupUserEmail === email) {
        const res: CalabrioUser = await getCalabrioUser(u.id);
        const user = res.data;
        console.warn("Conflicting User Found with Duplicate Email or Windows Login: ", user);

        user.adLogin = `xx-${user.id}-${user.adLogin}`;
        user.email = `xx-${user.id}-${user.email}`;
        user.deactivated = Date.now();

        await updateCalabrioUser(user.id, user);
      }

      if (!email && acdId && firstName === user.firstName && lastName === user.lastName) {
        const res: CalabrioUser = await getCalabrioUser(u.id);
        const user = res.data;
        console.warn("Conflicting User Found with First and Last Name: ", user);

        user.deactivated = Date.now();

        await updateCalabrioUser(user.id, user);
      }
    }));
  } catch(err) {
    console.error("Error thrown trying to fetch and validate Conflicting Users", err);
  }
  return;
};