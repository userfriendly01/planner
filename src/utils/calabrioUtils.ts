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
  https://forge.lmig.com/wiki/display/CICCT/Calabrio+Form
*/
export const checkConflictingUsers = async (user: any, users: CalabrioUser[], roles: any[]): Promise<void> => {
  try {
    const {
      acdId
    } = user;
    const firstName = typeof user.firstName === "string" ? user.firstName.toLowerCase() : user.firstName;
    const lastName = typeof user.lastName === "string" ? user.lastName.toLowerCase() : user.lastName;
    const email = typeof user.email === "string" ? user.email.toLowerCase() : user.email;
    const adLogin = typeof user.adLogin === "string" ? user.adLogin.toLowerCase() : user.adLogin;

    await Promise.all(users.map(async u => {
      if(u.acdId === acdId){
        throw new Error("Calabrio Record with this ACD Id already exists. New Record should not be added.");
      }

      const dupUserAdLogin = typeof u.adLogin === "string" ? u.adLogin.toLowerCase() : u.adLogin;
      const dupUserEmail = typeof u.email === "string" ? u.email.toLowerCase() : u.email;
      const dupUserFirstName = typeof u.firstName === "string" ? u.firstName.toLowerCase() : u.firstName;
      const dupUserLastName = typeof u.lastName === "string" ? u.lastName.toLowerCase() : u.lastName;


      console.warn("Conflicting User Object: ", u);
      console.warn(`ACD ID: ${acdId}`);
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

      console.warn("!email", !email);
      console.warn("acdId", acdId);
      console.warn(`firstName: ${firstName} === dupUserFirstName: ${dupUserFirstName} | ${firstName === dupUserFirstName}`);
      console.warn(`lastName: ${lastName} === dupUserLastName: ${dupUserLastName} | ${lastName === dupUserLastName}`);
      console.warn(`equates to: ${!email && acdId && firstName === dupUserFirstName && lastName === dupUserLastName}`);

      if (!dupUserEmail && acdId && firstName === dupUserFirstName && lastName === dupUserLastName) {
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