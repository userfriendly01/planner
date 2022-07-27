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

const calabrioTenants = {
  PROD: "tenant0215",
  NP: "LibertyMutual"
};

//Calabrio doesnt offer an API for this, only PST, MNT, CST, and EST were requested so we hardcoded them here as they are unlikely to change
//They are also the same through environments
export const calabrioTimeZones =  [
  {
    label: "America/New_York (EST/EDT)",
    value: 173
  },
  {
    label: "America/Los_Angeles (PST/PDT)",
    value: 151
  },
  {
    label: "America/Denver (MST/MDT)",
    value: 110
  },
  {
    label: "America/Chicago (CST/CDT)",
    value: 99
  }
];

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

export const formatCalabrioTenant = (groupsArray: CalabrioGroup[]): CalabrioGroup => {
  const group = groupsArray.find((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TENANT);
  return group;
};

const toLowerCaseString = (variable: any) => {
  return typeof variable === "string" ? variable.toLowerCase() : variable;
};

/*
  https://forge.lmig.com/wiki/display/CICCT/Calabrio+Form
*/
export const checkConflictingUsers = async (user: any, users: CalabrioUser[], roles: any[]): Promise<void> => {
  try {
    const {
      acdId
    } = user;

    const firstName = toLowerCaseString(user.firstName);
    const lastName = toLowerCaseString(user.lastName);
    const email = toLowerCaseString(user.email);
    const adLogin = toLowerCaseString(user.adLogin);

    await Promise.all(users.map(async u => {
      if(u.acdId === acdId){
        throw new Error("Calabrio Record with this ACD Id already exists. New Record should not be added.");
      }

      const dupUserAdLogin = toLowerCaseString(u.adLogin);
      const dupUserEmail = toLowerCaseString(u.email);
      const dupUserFirstName = toLowerCaseString(u.firstName);
      const dupUserLastName = toLowerCaseString(u.lastName);


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
        user.email = `SHELLUSER${user.id}@libertymutual.com`;

        await updateCalabrioUser(user.id, user);
      }
    }));
  } catch(err) {
    console.error("Error thrown trying to fetch and validate Conflicting Users", err);
  }
  return;
};