import {
  cleanupField,
  toProperCase
} from "../BulkUtils";
import {
  fetchUser,
  generateExtension
} from "services";
import {
  getE164Number,
  calabrioAllowedRoles,
  calabrioTimeZones,
  getOverflowSkillFromProfile,
  logger
} from "utils";
import {
  formatDateFromExcelDate
} from "../BulkUtils/formatUtils";
import {
  allowedEmptyScheduleField
} from "../BulkUtils/validationUtils";
import {
  Fields
} from "../BulkChanges.Interfaces";

const rejectPromise = (error: string, rowNumber: number | string) => {
  return Promise.reject(JSON.stringify({
    rowNumber: rowNumber,
    error
  }));
};

export const isDidUser = (didField: any, rowNumber: number) => {
  if (typeof didField !== "string") {
    throw new Error(`Did User field needs to be 'Y' or 'N' for row ${rowNumber}`);
  } else if (didField !== "y" && didField !== "n") {
    throw new Error(`Did User field needs to be 'Y' or 'N' for row ${rowNumber}`);
  } else if (didField === "y") {
    return true;
  } else {
    return false;
  }
};

export const FIELDS: Fields = {
  N_NUMBER_CREATE: {
    field: "nNumber",
    name: "N Number",
    type: "string",
    description: "Agents N Number",
    example: "n0263786",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "N Number";
      const field = cleanupField(row[fieldName], "string");
      const worker = state.workerContext.workers.find((w: any) => cleanupField(w.attributes.n_number, "string") === field);
      if (!row.attributes) {
        row.attributes = {};
      }
      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (typeof field !== "string" || field.length !== 8) {
        return rejectPromise(`${fieldName} is not in the valid n number format for row ${rowNumber}`, rowNumber);
      } else if (worker) {
        return rejectPromise(`${field} already has a record in Twilio/Worker Database row ${rowNumber}`, rowNumber);
      } else {
        try {
          const fetchedUser = await fetchUser(field);

          row.attributes.contact_uri = `client:${field.toLowerCase()}`;
          row.attributes.department_id = fetchedUser.departmentNumber;
          row.attributes.department_name = fetchedUser.departmentName;
          row.attributes.email = fetchedUser.email;
          row.attributes.email_address = fetchedUser.email;
          row.attributes.emp_first_name = fetchedUser.firstName;
          row.attributes.emp_last_name = fetchedUser.lastName;
          row.attributes.full_name = `${fetchedUser.firstName} ${fetchedUser.lastName}`;
          row.attributes.location = fetchedUser.officeName;
          row.attributes.n_number = field.toLowerCase();
          row.attributes.office_location_name = fetchedUser.officeName;
          row.attributes.office_location_number = fetchedUser.officeNumber;
          row.attributes.primary_dept_name = fetchedUser.departmentName;
          row.attributes.primary_dept_number = fetchedUser.departmentNumber;
          row.attributes.unique_id = field.toLowerCase();
          row.attributes.adLogin = `LM\\${field.toLowerCase()}`;
          row.attributes.firstName = fetchedUser.firstName;
          row.attributes.lastName = fetchedUser.lastName;
          return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
        } catch (error) {
          logger.error(error.message, { error }, false);
          return rejectPromise(`Error thrown fetching ${fieldName} from HR Database for row ${rowNumber}`, rowNumber);
        }
      }
    }
  },
  N_NUMBER_UPDATE: {
    field: "nNumber",
    name: "N Number",
    type: "string",
    description: "Agents N Number",
    example: "n0263786",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "N Number";
      const field = cleanupField(row[fieldName], "string");

      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (typeof field !== "string" || field.length !== 8) {
        return rejectPromise(`${fieldName} is not in the valid n number format for row ${rowNumber}`, rowNumber);
      } else {
        try {
          const worker = state.workerContext.workers.find((w: any) => w.attributes?.n_number && cleanupField(w.attributes.n_number, "string") === field);
          if (worker) {
            row.workerSid = worker.sid;
            row.attributes = worker.attributes;
            return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
          } else {
            return rejectPromise(`${field} is not an existing setup worker in Triton for row ${rowNumber}`, rowNumber);
          }
        } catch (error) {
          logger.error(error.message, { error }, false);
          return rejectPromise(`Error thrown fetching ${fieldName} from state for row ${rowNumber}`, rowNumber);
        }
      }
    }
  },
  N_NUMBER_SYNC: {
    field: "nNumber",
    name: "N Number",
    type: "string",
    description: "Agents N Number",
    example: "n0263786",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const fieldName = "N Number";
      const field = cleanupField(row[fieldName], "string");

      if (!row.attributes) {
        row.attributes = {};
      }
      if (!field) {
        return rejectPromise(`${fieldName} is missing from Triton Worker ${row.workerSid}`, "NA");
      } else if (typeof field !== "string" || field.length !== 8) {
        return rejectPromise(`${fieldName} is not in the valid n number format on Triton worker ${row.workerSid}`, "NA");
      } else {
        try {
          const fetchedUser = await fetchUser(field);

          row.attributes.contact_uri = `client:${field.toLowerCase()}`;
          row.attributes.department_id = fetchedUser.departmentNumber;
          row.attributes.department_name = fetchedUser.departmentName;
          row.attributes.email = fetchedUser.email;
          row.attributes.email_address = fetchedUser.email;
          row.attributes.emp_first_name = fetchedUser.firstName;
          row.attributes.emp_last_name = fetchedUser.lastName;
          row.attributes.full_name = `${fetchedUser.firstName} ${fetchedUser.lastName}`;
          row.attributes.location = fetchedUser.officeName;
          row.attributes.n_number = field.toLowerCase();
          row.attributes.office_location_name = fetchedUser.officeName;
          row.attributes.office_location_number = fetchedUser.officeNumber;
          row.attributes.primary_dept_name = fetchedUser.departmentName;
          row.attributes.primary_dept_number = fetchedUser.departmentName;
          row.attributes.unique_id = field.toLowerCase();
          row.attributes.adLogin = `LM\\${field.toLowerCase()}`;
          row.attributes.firstName = fetchedUser.firstName;
          row.attributes.lastName = fetchedUser.lastName;
          return Promise.resolve(`${fieldName} Valid for ${row.workerSid}`);
        } catch (error) {
          logger.error(error.message, { error }, false);
          return rejectPromise(`Error thrown fetching ${fieldName} from HR Database for ${field}`, "NA");
        }
      }
    }
  },
  PROFILE_ID: {
    field: "profileId",
    name: "Profile Id",
    type: "number",
    description: "Profile Id",
    example: 3,
    options: (state: any) => state.profileContext.profiles.map((p: any) => p.profile_id).sort((a: number, b: number) => a - b),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Profile Id";
      const field = cleanupField(row[fieldName], "number");
      if (!row.attributes) {
        row.attributes = {};
      }
      if (!field && field !== 0) {
        return rejectPromise(`${fieldName} is missing for row ${rowNumber}`, rowNumber);
      } else if (!state.profileContext.profiles.some((p: any) => cleanupField(p.profile_id, "number") === field)) {
        return rejectPromise(`${fieldName} is not a valid option or is not a number for row ${rowNumber}`, rowNumber);
      } else {
        row.attributes.profile_id = field;
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  MANAGER_N_NUMBER_CREATE: {
    field: "managerNNumberCreate",
    name: "Manager N Number",
    type: "string",
    description: "N Number of the Manager",
    example: "n0088625",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Manager N Number";
      const field = cleanupField(row[fieldName], "string");
      if (!row.attributes) {
        row.attributes = {};
      }
      const managerObject = state.managerContext.managers.some((m: any) => m.manager_n_number && cleanupField(m.manager_n_number, "string") === field);
      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (managerObject) {
        return rejectPromise(`${fieldName} is already present for row ${rowNumber}`, rowNumber);
      } else {
        try {
          const fetchedUser = await fetchUser(field);

          row.attributes.manager_first_name = fetchedUser.firstName;
          row.attributes.manager_last_name = fetchedUser.lastName;
        } catch (error) {
          logger.error(error.message, { error }, false);
          return rejectPromise(`Error thrown fetching ${fieldName} from HR Database for row ${rowNumber}`, rowNumber);
        }
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  MANAGER_N_NUMBER: {
    field: "managerNNumber",
    name: "Manager N Number",
    type: "string",
    description: "N Number of the Manager",
    example: "n0088625",
    options: (state: any) => state.managerContext.managers.map((m: any) => m.manager_n_number).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Manager N Number";
      const field = cleanupField(row[fieldName], "string");
      if (!row.attributes) {
        row.attributes = {};
      }
      const managerObject = state.managerContext.managers.find((m: any) => m.manager_n_number && cleanupField(m.manager_n_number, "string") === field);
      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (!managerObject) {
        return rejectPromise(`${fieldName} is not a valid option for row ${rowNumber}`, rowNumber);
      } else {
        row.attributes.manager_first_name = managerObject.manager_first_name;
        row.attributes.manager_last_name = managerObject.manager_last_name;
        row.attributes.manager_n_number = managerObject.manager_n_number;
        row.attributes.manager = `${managerObject.manager_first_name} ${managerObject.manager_last_name}`;
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  DEFAULT_SKILLS: {
    field: "defaultSkills",
    name: "Default Skills",
    type: "string",
    description: "Comma delimited list of skill/level pairings. Skills can be on their own or have a ':level' to represent the level. If left blank, no skills will be added to the user",
    example: "bscCommissions:3, blSalesL1:2, aisl1",
    options: (state: any) => state.skillContext.skills.map((s: any) => s.levels?.length > 0 ? `${s.name} Available levels: ${s.levels?.toString()}` : s.name).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      /*
        skills object: {
         levels: {asig: 2},
         skills: [466, aisg]
        }
      */
      const fieldName = "Default Skills";
      const field: any = row[fieldName];
      if (!row.attributes) {
        row.attributes = {};
      }
      const defaultSkills: any = {
        skills: [],
        levels: {}
      };
      if (field) {
        const skillErrors: any = [];
        try {
          const fieldArray = field.replace(" ", "").split(",");
          fieldArray.forEach((objString: string) => {
            const objKeyValueArray = objString.replace(" ", "").split(":");
            const key: any = objKeyValueArray[0];
            const value: any = cleanupField(objKeyValueArray[1], "number");
            if (value) {
              defaultSkills.levels[key] = value;
            }
            defaultSkills.skills.push(key);
          });

          const availableSkills = state.skillContext.skills;

          defaultSkills.skills.forEach((ds: any) => {
            if (!availableSkills.some((as: any) => cleanupField(as.name, "string") === cleanupField(ds, "string"))) {
              skillErrors.push(`${ds} is not an available skill `);
            }
          });

          Object.keys(defaultSkills.levels).forEach((skill: any) => {
            const matchingSkill = availableSkills.find((as: any) => cleanupField(as.name, "string") === cleanupField(skill, "string"));
            const level = defaultSkills.levels[skill];
            if (!matchingSkill?.levels.includes(level)) {
              skillErrors.push(`${skill} does not support Level ${level}.`);
            }
          });
        } catch (err) {
          skillErrors.push(err.message);
        }
        if (skillErrors.length > 0) {
          return rejectPromise(`${fieldName} Errors found for row ${rowNumber} ${skillErrors.toString()}`, rowNumber);
        } else {
          row.attributes.default_skills = defaultSkills;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        }
      } else {
        row.attributes.default_skills = defaultSkills;
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      }
    }
  },
  EXTENSION: {
    field: "extension",
    name: "Extension",
    type: "string",
    description: "Enter a number for the users extension or type Y for a randomly generated extension. Enter N for no extension",
    example: "65214",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Extension";
      const field = cleanupField(row[fieldName], "string");
      const newExtension = field === "y";
      const workers = state.workerContext.workers;
      if (!row.attributes) {
        row.attributes = {};
      }

      if (!field) {
        return Promise.resolve(`No ${fieldName} set for row ${rowNumber}`);
      } else if (newExtension) {
        let extension;
        try {
          extension = await generateExtension(workers);
          row.attributes.extension = cleanupField(extension, "number");
        } catch (error) {
          logger.error("Error generating extension", { error }, false);

          return rejectPromise(`Unable to generate ${fieldName} for row ${rowNumber}`, rowNumber);
        }
        return Promise.resolve(`${fieldName} ${extension} set for row ${rowNumber}`);
      } else if (field === "n") {
        return Promise.resolve(`${fieldName} skipped for row ${rowNumber}.`);
      } else {
        try {
          const isNotNum: boolean = isNaN(field as any);
          if (isNotNum) {
            return rejectPromise(`${fieldName} ${field} is in the wrong format for row ${rowNumber}`, rowNumber);
          }
          const isExtensionTaken = workers.some((w: any) => cleanupField(w.attributes.extension, "string") === field);
          if (!isExtensionTaken) {
            row.attributes.extension = parseInt(field);
            return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
          } else {
            return rejectPromise(`${fieldName} ${field} is already taken for row ${rowNumber}`, rowNumber);
          }
        } catch (err) {
          return rejectPromise(`${fieldName} ${field} error thrown validating extention for row ${rowNumber}`, rowNumber);
        }
      }
    }
  },
  DID_USER: {
    field: "didUser",
    name: "Did User",
    type: "boolean",
    description: "Y/N indicator to represent if user has a DirecT Dial Number",
    example: "Y",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Did User";
      const field = cleanupField(row[fieldName], "string");

      try {
        isDidUser(field, rowNumber);
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
      } catch (err) {
        return rejectPromise(`${fieldName} needs to be 'Y' or 'N' for row ${rowNumber}`, rowNumber);
      }
    }
  },
  DIRECT_DIAL_NUMBER: {
    field: "directDialNumber",
    name: "Direct Dial Number",
    type: "string",
    description: "10 digit Direct Dial Phone Number, will be prepended with +1. Only required when DID User is true",
    example: "6038518200",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Direct Dial Number";
      const field = cleanupField(row[fieldName], "string");
      const didFieldName = "Did User";
      const didField = cleanupField(row[didFieldName], "string");
      if (!row.attributes) {
        row.attributes = {};
      }

      try {
        const didUser = isDidUser(didField, rowNumber);
        if (didUser && field) {
          try {
            const directDialNum = getE164Number(field);
            row.attributes.did = directDialNum;
            row.directDialNum = directDialNum;
            row.alternateDid = directDialNum;
            return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
          } catch (err) {
            return rejectPromise(`${fieldName} is not in the correct format for row ${rowNumber}`, rowNumber);
          }
        } else if (didUser && !field) {
          return rejectPromise(`${fieldName} is required when DID user is 'Y' for row ${rowNumber}`, rowNumber);
        } else if (!didUser && !field) {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else {
          return rejectPromise(`Did User field is 'N', ${fieldName} is not applicable for row ${rowNumber}`, rowNumber);
        }
      } catch (err) {
        return rejectPromise(`${didFieldName} needs to be 'Y' or 'N' for row ${rowNumber}`, rowNumber);
      }
    }
  },
  ZERO_OUT_ENABLED: {
    field: "zeroOutEnabled",
    name: "Zero Out Enabled",
    type: "boolean",
    description: "Y/N Indicator to represent if the zero out skill aligned to the profile ID should be added to the users current skills. Only required when DID User is true",
    example: "Y",
    options: null,
    validateFunction: async (row: any, state: any) => {
      const rowNumber = row.rowNumber;
      const fieldName = "Zero Out Enabled";
      const field = cleanupField(row[fieldName], "string");
      const didFieldName = "Did User";
      const didField = cleanupField(row[didFieldName], "string");
      try {
        const didUser = isDidUser(didField, rowNumber);
        if (didUser && field === "y") {
          try {
            const profileFieldName = "Profile Id";
            const profiles = state.profileContext.profiles;
            const profileId = cleanupField(row[profileFieldName], "number");
            if (!profileId && profileId !== 0 || typeof profileId !== "number") {
              return rejectPromise(`Unable to set ${fieldName}. Incorrect format for ${profileFieldName} for row ${rowNumber}`, rowNumber);
            }
            const overflowSkill = getOverflowSkillFromProfile(profiles, profileId.toString());
            if (overflowSkill) {
              if (!row.attributes) {
                row.attributes = {};
              }
              row.attributes.routing = {
                skills: [cleanupField(overflowSkill, "string")],
                levels: {}
              };
              row.zeroOutEnabled = true;
              return Promise.resolve(`${fieldName} ${overflowSkill} set for row ${rowNumber}`);
            } else {
              row.zeroOutEnabled = true;
              return Promise.resolve(`${fieldName} set to true but no overflow skill found on profile for row ${rowNumber}`);
            }
          } catch (err) {
            return rejectPromise(`Error thrown setting ${fieldName} for row ${rowNumber}. ${err.toString()}`, rowNumber);
          }
        } else if (didUser && field === "n") {
          row.zeroOutEnabled = false;
          return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
        } else if (didUser && field && field !== "y" && field !== "n") {
          return rejectPromise(`${fieldName} needs to be needs to be 'Y' or 'N' if DID user is 'Y' for ${rowNumber}`, rowNumber);
        } else if (didUser && !field) {
          return rejectPromise(`${fieldName} is required when DID user is 'Y' for row ${rowNumber}`, rowNumber);
        } else if (!didUser && !field) {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else if (!didUser && field === "n") {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else {
          return rejectPromise(`Did User field is 'N', ${fieldName} is not applicable for row ${rowNumber}`, rowNumber);
        }
      } catch (err) {
        return rejectPromise(`${didFieldName} needs to be 'Y' or 'N' for row ${rowNumber}`, rowNumber);
      }
    }
  },
  OUTGOING_NUMBER: {
    field: "outgoingNumber",
    name: "Outgoing Number",
    type: "string",
    description: "If the user is not a DID user this is their Outgoing number",
    example: "6038518288",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Outgoing Number";
      const field = cleanupField(row[fieldName], "string");
      const didFieldName = "Did User";
      const didField = cleanupField(row[didFieldName], "string");
      if (!row.attributes) {
        row.attributes = {};
      }

      try {
        const didUser = isDidUser(didField, rowNumber);
        if (didUser && field) {
          return rejectPromise(`Did User field is 'Y', ${fieldName} is not applicable for row ${rowNumber}`, rowNumber);
        } else if (didUser && !field) {
          return Promise.resolve(`${fieldName} skipped for DID user for row ${rowNumber}`);
        } else if (!didUser && !field) {
          return rejectPromise(`${fieldName} is required when DID user is 'N' for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const outgoing = getE164Number(field);
            row.attributes.did = outgoing;
            return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
          } catch (err) {
            return rejectPromise(`${fieldName} is not in the correct format for row ${rowNumber}`, rowNumber);
          }
        }
      } catch (err) {
        return rejectPromise(`${didFieldName} needs to be 'Y' or 'N' for row ${rowNumber}`, rowNumber);
      }
    }
  },
  SELF_SERVICE_IND: {
    field: "selfServiceInd",
    name: "Self Service Indicator",
    type: "boolean",
    description: "Y/N indicator to represent if user has self-service attribute. Only required when DID User is true.",
    example: "Y",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Self Service Indicator";
      const field = cleanupField(row[fieldName], "string");
      const didFieldName = "Did User";
      const didField = cleanupField(row[didFieldName], "string");

      try {
        const didUser = isDidUser(didField, rowNumber);
        if (didUser && field === "y") {
          const profileFieldName = "Profile Id";
          const profileId = cleanupField(row[profileFieldName], "number");
          const profileThreshold = 39;
          if (!profileId || typeof profileId !== "number") {
            return rejectPromise(`Unable to set ${fieldName}. Incorrect format for ${profileFieldName} for row ${rowNumber}`, rowNumber);
          }
          if (profileId < profileThreshold) {
            return rejectPromise(`Unable to set ${fieldName}. Incorrect value for ${profileFieldName} for row ${rowNumber} - need ${profileFieldName} to be ${profileThreshold} or above`, rowNumber);
          }
          row.selfServiceInd = true;
          return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
        } else if (didUser && field === "n") {
          row.selfServiceInd = false;
          return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
        } else if (didUser && field && field !== "y" && field !== "n") {
          return rejectPromise(`${fieldName} needs to be needs to be 'Y' or 'N' if DID user is 'Y' for ${rowNumber}`, rowNumber);
        } else if (didUser && !field) {
          return rejectPromise(`${fieldName} is required when DID user is 'Y' for row ${rowNumber}`, rowNumber);
        } else if (!didUser && !field) {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else if (!didUser && field === "n") {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else {
          return rejectPromise(`Did User field is 'N', ${fieldName} is not applicable for row ${rowNumber}`, rowNumber);
        }
      } catch (err) {
        return rejectPromise(`${didFieldName} needs to be 'Y' or 'N' for row ${rowNumber}`, rowNumber);
      }
    }
  },
  ROUTING_TEAM: {
    field: "routing_team",
    name: "Routing Team",
    type: "string",
    description: "List of Teams that can be used in dynamic routing",
    example: "licensedCSC",
    options: (state: any) => {
      const optionsArray: any = [];
      state.profileContext.profiles.map((p: any) => {
        const profileId = p.profile_id;
        if (p.routing_teams) {
          p.routing_teams.forEach((t: any) => optionsArray.push(`Profile ${profileId}: ${t.routing_team_nme}`));
        }
      });
      return optionsArray.sort();
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Routing Team";
      const field = cleanupField(row[fieldName], "string");
      const profileField = "Profile Id";
      const profile = cleanupField(row[profileField], "number");
      if (!row.attributes) {
        row.attributes = {};
      }
      const routingProfiles = state.profileContext.profiles.filter((p: any) => p.routing_teams);
      const matchingProfile = routingProfiles.find((p: any) => cleanupField(p.profile_id, "number") === profile);
      const routingTeams = matchingProfile?.routing_teams.map((t: any) => t.routing_team_nme.toLowerCase());
      if (matchingProfile) {
        if (!field) {
          return rejectPromise(`${fieldName} is missing for row ${rowNumber}`, rowNumber);
        } else if (!routingTeams.includes(field)) {
          return rejectPromise(`${fieldName} is not a valid option for profile for row ${rowNumber}`, rowNumber);
        } else {
          row.attributes.routing_team = row[fieldName];
          return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
        }
      } else if (field) {
        return rejectPromise(`${fieldName} is not applicable to profile id ${profile} for row ${rowNumber}`, rowNumber);
      } else {
        return Promise.resolve(`Bypassing ${fieldName}. Unapplicable for profile id ${profile} for row ${rowNumber}`);
      }
    }
  },
  WFM_ACTIVATE_EXTERNAL_LOGON: {
    field: "wfmActivateExternalLogon",
    name: "WFM Activate External Logon",
    type: "boolean",
    description: "Y/N indicator to represent if user needs to activate WFM external logon.",
    example: "Y",
    options: null,
    validateFunction: async (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.WFM_ACTIVATE_EXTERNAL_LOGON.name;
      const field = cleanupField(row[fieldName], "string");

      if (!field) {
        return rejectPromise(`${fieldName} must be Y or N for row ${rowNumber}`, rowNumber);
      } else if (field !== "y" && field !== "n") {
        return rejectPromise(`${fieldName} must be Y or N for row ${rowNumber}`, rowNumber);
      } else if (field === "y") {
        // user needs to activate their external logon
        row.wfmActivateExternalLogon = true;
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
      } else {
        // user doesn't need external logon
        row.wfmActivateExternalLogon = false;
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
      }
    }
  },
  CALABRIO_SCOPE: {
    field: "calabrioScope",
    name: "Calabrio Scope",
    type: "string",
    description: "Comma delimited list of groups or teams to represent a supervisor or evaluators scope. (Must already exist in Calabrio)",
    example: "Default Group",
    options: (state: any) => state.calabrioContext.groups.map((g: any) => g.name).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Calabrio Scope";
      const field = cleanupField(row[fieldName], "string");
      const availableGroups = state.calabrioContext.groups;
      const availableTeams = state.calabrioContext.teams;
      row.scope = {
        groups: [],
        teams: []
      };

      if (!field) {
        return Promise.resolve(`${fieldName} skipped for row ${rowNumber}`);
      } else {
        try {
          const fieldArray = field.split(",");
          fieldArray.forEach((scope: any) => {
            const cleanScope = cleanupField(scope, "string");
            const group = availableGroups.find((g: any) => cleanupField(g.name, "string") === cleanScope);
            const team = availableTeams.find((t: any) => cleanupField(t.name, "string") === cleanScope);
            if (!group && !team) {
              throw new Error(`${cleanScope} is not a valid group or team for row ${rowNumber}`);
            } else if (group) {
              row.scope.groups.push(group.groupId);
            } else {
              row.scope.teams.push(team.groupId);
            }
          });
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (error) {
          logger.error("Error Thrown validating calabrio scope", { error }, false);
          return rejectPromise(error.message, rowNumber);
        }
      }
    }
  },
  CALABRIO_TEAM_CREATE: {
    field: "calabrioTeamCreate",
    name: "Calabrio Team",
    type: "string",
    description: "Team",
    example: "Default Team",
    options: (state: any) => state.calabrioContext.teams.map((t: any) => t.name).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Calabrio Team";
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else {
        const team = state.calabrioContext.teams.find((t: any) => cleanupField(t.name, "string") === field);

        if (team && team.groupId) {
          // Team already exists, dont need to verify parent group
          row.groupId = team.groupId;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } else {
          // Creating a new team. Verify given parent group exists
          const fieldName = "Calabrio Group";
          const field = cleanupField(row[fieldName], "string");
          const parentGroup = state.calabrioContext.groups.find((g: any) => cleanupField(g.name, "string") === field);

          if (!parentGroup) {
            return rejectPromise(`New Teams require a valid ${fieldName} for row ${rowNumber}`, rowNumber);
          } else {
            row.parentGroupId = parentGroup.groupId;
            row.newTeam = true;
            row["Calabrio Team"] = toProperCase(row["Calabrio Team"]);
            return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
          }
        }
      }
    }
  },
  CALABRIO_TEAM: {
    field: "calabrioTeam",
    name: "Calabrio Team",
    type: "string",
    description: "Team (Must already be created in Calabrio)",
    example: "Default Team",
    options: (state: any) => state.calabrioContext.teams.map((t: any) => t.name).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Calabrio Team";
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else {
        const team = state.calabrioContext.teams.find((t: any) => cleanupField(t.name, "string") === field);
        if (!team || !team.groupId) {
          return rejectPromise(`${fieldName} is not a valid option for row ${rowNumber}`, rowNumber);
        } else {
          row.groupId = team.groupId;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        }
      }
    }
  },
  CALABRIO_GROUP: {
    field: "calabrioGroup",
    name: "Calabrio Group",
    type: "string",
    description: "Group (Must already be created in Calabrio)",
    example: "GRS Claims Services",
    options: (state: any) => state.calabrioContext.groups.map((g: any) => g.name).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Calabrio Team";
      const field = cleanupField(row[fieldName], "string");

      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else {
        const team = state.calabrioContext.teams.find((t: any) => cleanupField(t.name, "string") === field);
        if (team && team.groupId) {
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } else {
          // Creating a new team. Verify given parent group exists
          const fieldName = "Calabrio Group";
          const field = cleanupField(row[fieldName], "string");

          const group = state.calabrioContext.groups.find((g: any) => cleanupField(g.name, "string") === field);
          if (!group) {
            return rejectPromise(`New Teams require a valid ${fieldName} for row ${rowNumber}`, rowNumber);
          } else {
            return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
          }
        }
      }
    }
  },
  CALABRIO_ROLES: {
    field: "roles",
    name: "Calabrio Role",
    type: "string",
    description: "Comma delimited list of approved roles that already exist in Calabrio",
    example: "QM Agent",
    options: () => calabrioAllowedRoles.sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Calabrio Role";
      const field = cleanupField(row[fieldName], "string");

      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else {
        try {
          const fieldArray = field.split(",");
          row.roles = [];
          fieldArray.forEach((role: any) => {
            const cleanRole = cleanupField(role, "string");
            const foundInRoles = calabrioAllowedRoles.some((r: any) => cleanupField(r, "string") === cleanRole);
            const roleObject = state.calabrioContext.roles.find((r: any) => cleanupField(r.name, "string") === cleanRole);
            if (!foundInRoles || !roleObject) {
              throw new Error(`${cleanRole} is not a valid role for row ${rowNumber}`);
            } else {
              row.roles.push(roleObject);
            }
          });
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(err.message, rowNumber);
        }
      }
    }
  },
  CALABRIO_TIME_ZONE: {
    field: "timeZone",
    name: "Time Zone",
    type: "string",
    description: "Time Zone of the Calabrio User",
    example: "America/New_York (EST/EDT)",
    options: () => calabrioTimeZones.map((t: any) => t.label).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "Time Zone";
      const field = cleanupField(row[fieldName], "string");
      const timeZone = calabrioTimeZones.find((t: any) => cleanupField(t.label, "string") === field);
      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (!timeZone) {
        return rejectPromise(`${fieldName} is not a valid option for row ${rowNumber}`, rowNumber);
      } else {
        row.timeZone = timeZone.value;
        return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
      }
    }
  },
  CALABRIO_WFM_IDENTITY: {  // this field is only for validation the HR email is the same as the user's ldap email.  It will not be added to the request body
    field: "wfmIdentity",
    name: "WFM Identity",
    type: "string",
    description: "LDAP Email address of the wfm person.  This field will show an error if the email provided does not match the email in HR. (optional)",
    example: "",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_IDENTITY.name;
      const field = cleanupField(row[fieldName], "string");

      if (!field) {
        return Promise.resolve(`${fieldName} is missing but not required. Skipping validation for row ${rowNumber}`);
      } else {
        const hrEmail = row.attributes.email;

        if (field !== cleanupField(hrEmail, "string")) {
          return rejectPromise(`Invalid ${fieldName}.  The email provided does NOT match the email address in this user's HR data. This user needs to update their email so they match prior to being loaded into WFM for row ${rowNumber}`, rowNumber);
        } else {  // as long as the provided identity field and the hr email are the same, add what was entered for Identity
          row.wfmIdentity = row[fieldName].trim();  // keep the same casing as was provided
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        }
      }
    }
  },
  CALABRIO_WFM_BUSINESS_UNIT: { // required
    field: "wfmBusinessUnit",
    name: "WFM Business Unit",
    type: "string",
    description: "Business Unit of the Calabrio WFM person. Required",
    example: "GRM Safeco",
    options: (state: any) => state.calabrioContext.wfmOptions.map((bu: any) => bu.Name).sort(),
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_BUSINESS_UNIT.name;
      const field = cleanupField(row[fieldName], "string");

      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else {
        const foundBusinessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Name.toLowerCase() === field.toLowerCase());

        if (foundBusinessUnit) {
          row.businessUnitId = foundBusinessUnit.Id;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
        }
      }
    }
  },
  CALABRIO_WFM_ROLES: {  // allowed to be empty...
    field: "wfmRole",
    name: "WFM Role",
    type: "string",
    description: "Comma delimited list of roles that already exist in Calabrio WFM",
    example: "Fin_Ops_Agent, Fin_Ops_Team_Lead",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Roles.map((r: any) => r.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_ROLES.name;
      const field = cleanupField(row[fieldName], "string");

      row.wfmRoleIds = [];
      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else {
        try {
          const fieldArray = field.split(",");

          fieldArray.forEach((role: any) => {
            const cleanRole = cleanupField(role, "string");
            const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

            if (!businessUnitObj) {
              throw new Error(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`);
            }

            const roleObject = businessUnitObj.Roles.find((r: any) => cleanupField(r.Name, "string") === cleanRole);
            if (!roleObject) {
              throw new Error(`${cleanRole} is not a valid ${fieldName} for row ${rowNumber}`);
            } else {
              row.wfmRoleIds.push(roleObject.Id);
            }
          });
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(err.message, rowNumber);
        }
      }
    }
  },
  CALABRIO_WFM_FIRST_DAY_OF_WEEK: {
    field: "wfmFirstDayOfWeek",
    name: "First Day of Week",
    type: "number",
    description: "Number (0-6) representing the day of the week that the work week begins on.  1 is Monday",
    example: "1",
    options: () => [0, 1, 2, 3, 4, 5, 6],
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_FIRST_DAY_OF_WEEK.name;
      const field = cleanupField(row[fieldName], "number");
      if (!field) {
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else {
        if ([0, 1, 2, 3, 4, 5, 6].includes(field)) {
          row.wfmFirstDayOfWeek = field;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
        }
      }
    }
  },
  CALABRIO_WFM_WORKFLOW_CONTROL_SET: { // allowed to be empty
    field: "wfmWorkflowControlSet",
    name: "Workflow Control Set",
    type: "string",
    description: "The rules that manage how and when a worker can request time off, OT, etc",
    example: "",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Workflow_Control_Sets.map((wfc: any) => wfc.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_WORKFLOW_CONTROL_SET.name;
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else {
        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const workflowControlSetObj = businessUnitObj.Workflow_Control_Sets.find((wfc: any) => cleanupField(wfc.Name, "string") === field);
            if (workflowControlSetObj) {
              row.wfmWorkflowControlSetId = workflowControlSetObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_TEAM: {  // allowed to be empty only if other scheduling fields are also empty
    field: "wfmTeam",
    name: "WFM Team",
    type: "string",
    description: "The team of the WFM Person",
    example: "",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOrg.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Teams.map((t: any) => t.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_TEAM.name;
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        if (allowedEmptyScheduleField(row, fieldName)) {
          return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
        }
      } else {
        const businessUnitObj = state.calabrioContext.wfmOrg.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const teamObj = businessUnitObj.Teams.find((t: any) => cleanupField(t.Name, "string") === field);
            if (teamObj) {
              row.wfmTeamId = teamObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_CONTRACT: {  // allowed to be empty only if other scheduling fields are also empty
    field: "wfmContract",
    name: "WFM Contract",
    type: "string",
    description: "Represents the schedule of the agent",
    example: "SAF 8:00 Hour Day",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Contracts.map((c: any) => c.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_CONTRACT.name;
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        if (allowedEmptyScheduleField(row, fieldName)) {
          return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
        }
      } else {
        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const contractObj = businessUnitObj.Contracts.find((c: any) => cleanupField(c.Name, "string") === field);
            if (contractObj) {
              row.wfmContractId = contractObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_CONTRACT_SCHEDULE: {  // allowed to be empty only if other scheduling fields are also empty
    field: "wfmContractSchedule",
    name: "WFM Contract Schedule",
    type: "string",
    description: "User's 'hours per day' worked",
    example: "SAF Mon-Fri",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Contract_Schedules.map((c: any) => c.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.name;
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        if (allowedEmptyScheduleField(row, fieldName)) {
          return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
        }
      } else {
        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const contractScheduleObj = businessUnitObj.Contract_Schedules.find((c: any) => cleanupField(c.Name, "string") === field);
            if (contractScheduleObj) {
              row.wfmContractScheduleId = contractScheduleObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_PARTTIME_PERCENTAGE: {  // allowed to be empty only if other scheduling fields are also empty
    field: "wfmPartTimePercentage",
    name: "WFM Part Time Percentage",
    type: "string",
    description: "Represents the % of the day worked",
    example: "SAF 100%",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Part_Time_Percentages.map((ptp: any) => ptp.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.name;
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        if (allowedEmptyScheduleField(row, fieldName)) {
          return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
        }
      } else {
        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const ptPercentageObj = businessUnitObj.Part_Time_Percentages.find((ptp: any) => cleanupField(ptp.Name, "string") === field);
            if (ptPercentageObj) {
              row.wfmPartTimePercentageId = ptPercentageObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_SHIFTBAG: {
    field: "wfmShiftBag",
    name: "WFM Shift Bag",
    type: "string",
    description: "A bag of rules aligned to a shift",
    example: "",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Shift_Bags.map((sb: any) => sb.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "WFM Shift Bag";
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);

      } else {
        // If this field is provided, but no other scheduling fields are, throw an error saying
        // shiftbag can only be provided if the other schedule fields are given
        if (
          !cleanupField(row[FIELDS.CALABRIO_WFM_PERSON_START_DATE.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_TEAM.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_TEAM_START_DATE.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_CONTRACT.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.name], "string")
        ) {
          return rejectPromise(`${fieldName} is invalid.  ${fieldName} should only be provided when the following fields are also provided: ${FIELDS.CALABRIO_WFM_PERSON_START_DATE.name}, ${FIELDS.CALABRIO_WFM_TEAM.name}, ${FIELDS.CALABRIO_WFM_TEAM_START_DATE.name}, ${FIELDS.CALABRIO_WFM_CONTRACT.name}, ${FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.name}, ${FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.name}`, rowNumber);
        }

        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const shiftBagObj = businessUnitObj.Shift_Bags.find((ptp: any) => cleanupField(ptp.Name, "string") === field);
            if (shiftBagObj) {
              row.wfmShiftBagId = shiftBagObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_BUDGET_GROUP: {
    field: "wfmBudgetGroup",
    name: "WFM Budget Group",
    type: "string",
    description: "Defines how many people are allowed to be FTO at once",
    example: "Gold AM",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Budget_Groups.map((ptp: any) => ptp.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "WFM Budget Group";
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else {
        // If this field is provided, but no other scheduling fields are, throw an error saying
        // budgetGroup can only be provided if the other schedule fields are given
        if (
          !cleanupField(row[FIELDS.CALABRIO_WFM_PERSON_START_DATE.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_TEAM.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_TEAM_START_DATE.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_CONTRACT.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.name], "string") &&
          !cleanupField(row[FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.name], "string")
        ) {
          return rejectPromise(`${fieldName} is invalid.  ${fieldName} should only be provided when the following fields are also provided: ${FIELDS.CALABRIO_WFM_PERSON_START_DATE.name}, ${FIELDS.CALABRIO_WFM_TEAM.name}, ${FIELDS.CALABRIO_WFM_TEAM_START_DATE.name}, ${FIELDS.CALABRIO_WFM_CONTRACT.name}, ${FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.name}, ${FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.name}`, rowNumber);
        }
        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const budgetGroupObj = businessUnitObj.Budget_Groups.find((ptp: any) => cleanupField(ptp.Name, "string") === field);
            if (budgetGroupObj) {
              row.wfmBudgetGroupId = budgetGroupObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_PERSON_START_DATE: { // Excel gives us a number that is "days since jan 1 1900"
    field: "wfmPersonStartDate", // allowed to be empty only if other scheduling fields are also empty
    name: "WFM Person Start Date",
    type: "number",
    description: "Start date for the WFM Person",
    example: "excel spreadsheet cell/column must be a DATE type (not text)",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_PERSON_START_DATE.name;
      const field = cleanupField(row[fieldName], "number");
      if (!field) {
        if (allowedEmptyScheduleField(row, fieldName)) {
          return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
        }
      } else {
        try {
          const formattedDate = formatDateFromExcelDate(field);  // throws error if day month or year is NaN
          row.wfmPersonStartDate = formattedDate;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
        }
      }
    }
  },
  CALABRIO_WFM_TEAM_START_DATE: { // allowed to be empty only if other scheduling fields are also empty
    field: "wfmTeamStartDate",
    name: "WFM Team Start Date",
    type: "string",
    description: "The start date for the team",
    example: "",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_TEAM_START_DATE.name;
      const field = cleanupField(row[fieldName], "number");
      if (!field) {
        if (allowedEmptyScheduleField(row, fieldName)) {
          return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
        }
      } else {
        try {
          const formattedDate = formatDateFromExcelDate(field); // will throw error if NaN
          row.wfmTeamStartDate = formattedDate;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
        }
      }
    }
  },
  CALABRIO_WFM_SKILLS_START_DATE: {  // allowed to be empty if skills is
    field: "wfmSkillsStartDate",
    name: "WFM Skills Start Date",
    type: "string",
    description: "The start date for skills",
    example: "",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_SKILLS_START_DATE.name;
      const field = cleanupField(row[fieldName], "number");

      const skillsField = cleanupField(row[FIELDS.CALABRIO_WFM_SKILLS.name], "string");
      if (!field && !skillsField) {
        // resolve
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else if (!field && skillsField) {
        // reject for missing field
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (field && skillsField) {
        // format date
        try {
          const formattedDate = formatDateFromExcelDate(field); // will throw error if NaN
          row.wfmSkillsStartDate = formattedDate;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
        }
      } else {
        // this would mean we have this skills start date field, but no skills field.
        return rejectPromise(`${fieldName} was provided but WFM Skills is empty.`, rowNumber);
      }
    }
  },
  CALABRIO_WFM_SKILLS: { // allowed to be empty
    field: "wfmSkills",
    name: "WFM Skills",
    type: "string",
    description: "A comma deliminated list of skills for the WFM person",
    example: "Gold Spanish, Gold Policy",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Skills.map((s: any) => s.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_SKILLS.name;
      const field = cleanupField(row[fieldName], "string");

      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else {
        try {
          const fieldArray = field.split(",");
          row.wfmSkillIds = [];
          fieldArray.forEach((role: any) => {
            const cleanSkill = cleanupField(role, "string");
            const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

            if (!businessUnitObj) {
              throw new Error(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`);
            }

            const skillsObj = businessUnitObj.Skills.find((r: any) => cleanupField(r.Name, "string") === cleanSkill);
            if (!skillsObj) {
              throw new Error(`${cleanSkill} is not a valid wfm skill for row ${rowNumber}`);
            } else {
              row.wfmSkillIds.push(skillsObj.Id);
            }
          });
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(err.message, rowNumber);
        }
      }
    }
  },
  CALABRIO_WFM_ROTATION_START_DATE: {  // allowed to be empty if rotation is empty
    field: "wfmRotationStartDate",
    name: "WFM Rotation Start Date",
    type: "string",
    description: "The start date for rotation",
    example: "",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_ROTATION_START_DATE.name;
      const field = cleanupField(row[fieldName], "number");

      const rotationField = cleanupField(row[FIELDS.CALABRIO_WFM_ROTATION.name], "string");
      if (!field && !rotationField) {
        // resolve
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else if (!field && rotationField) {
        // reject for missing field
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (field && rotationField) {
        // format date
        try {
          const formattedDate = formatDateFromExcelDate(field); // will throw error if NaN
          row.wfmRotationStartDate = formattedDate;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
        }
      } else {
        // this would mean we have this rotation start date field, but no rotation field.
        return rejectPromise(`${fieldName} was provided but WFM Rotation is empty.`, rowNumber);
      }
    }
  },
  CALABRIO_WFM_ROTATION: { // allowed to be empty
    field: "wfmRotation",
    name: "WFM Rotation",
    type: "string",
    description: "Sets the start time of the schedule",
    example: "SAF 07:00a start",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Rotations.map((r: any) => r.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_ROTATION.name;
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else {
        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const rotationObj = businessUnitObj.Rotations.find((r: any) => cleanupField(r.Name, "string") === field);
            if (rotationObj) {
              row.wfmRotationId = rotationObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_ROTATION_START_WEEK: { // This field is a number from 1-10
    field: "wfmRotationStartWk", // allowed to be empty if rotation is empty
    name: "WFM Rotation Start Week",
    type: "number",
    description: "Number that represents the week the persons rotation should start on. Must be an integer 1-10",
    example: "2",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_ROTATION_START_WEEK.name;
      const field = cleanupField(row[fieldName], "number");

      const rotationField = cleanupField(row[FIELDS.CALABRIO_WFM_ROTATION.name], "string");
      if (!field && !rotationField) {
        // resolve
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else if (!field && rotationField) {
        // reject for missing field
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (field && rotationField) {
        if (!isNaN(field) && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(field)) {
          row.wfmRotationStartWk = field;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } else {
          return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
        }
      } else {
        // this would mean we have this Rotation start week field, but no rotation field.
        return rejectPromise(`${fieldName} was provided but WFM Rotation is empty.`, rowNumber);
      }
    }
  },
  CALABRIO_WFM_AVAILABILITY_START_DATE: { // allowed empty if availability is also empty
    field: "wfmAvailabilityStartDate",
    name: "WFM Availability Start Date",
    type: "string",
    description: "The start date for availibilty",
    example: "",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_AVAILABILITY_START_DATE.name;
      const field = cleanupField(row[fieldName], "number");

      const availabilityField = cleanupField(row[FIELDS.CALABRIO_WFM_AVAILABILITY.name], "string");
      if (!field && !availabilityField) {
        // resolve
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else if (!field && availabilityField) {
        // reject for missing field
        return rejectPromise(`${fieldName} is missing from row ${rowNumber}`, rowNumber);
      } else if (field && availabilityField) {
        // format date
        try {
          const formattedDate = formatDateFromExcelDate(field); // will throw error if NaN
          row.wfmAvailabilityStartDate = formattedDate;
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
        }
      } else {
        // this would mean we have this availability start date field, but no availability field.
        return rejectPromise(`${fieldName} was provided but WFM Availability is empty.`, rowNumber);
      }
    }
  },
  CALABRIO_WFM_AVAILABILITY: { // check on this, but I think it can be empty?
    field: "wfmAvailability",
    name: "WFM Availability",
    type: "string",
    description: "Defines what days per week are scheduled days",
    example: "SAF 5d 8h M-F",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Availabilities.map((a: any) => a.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = "WFM Availability";
      const field = cleanupField(row[fieldName], "string");
      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else {
        const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

        if (!businessUnitObj) {
          return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
        } else {
          try {
            const availabilityObj = businessUnitObj.Availabilities.find((r: any) => cleanupField(r.Name, "string") === field);
            if (availabilityObj) {
              row.wfmAvailabilityId = availabilityObj.Id;
              return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
            } else {
              return rejectPromise(`${fieldName} is invalid for row ${rowNumber}`, rowNumber);
            }
          } catch (err) {
            return rejectPromise(`Error encountered validating ${fieldName} for row ${rowNumber}: ${err.message}`, rowNumber);
          }
        }
      }
    }
  },
  CALABRIO_WFM_OPTIONAL_COLUMNS: { // can be empty
    field: "wfmOptionalCols",
    name: "WFM Optional Columns",
    type: "string",
    description: "Comma delimited list of optional columns. Column names and values are colon delimited. Optional",
    example: "SAF Agent Status:Ready, SAF Agent Location State:NH",
    options: (state: any, businessUnitId: string) => {
      const businessUnit = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === businessUnitId);
      if (businessUnit) {
        return businessUnit.Optional_Columns.map((oc: any) => oc.Name).sort();
      }
      return ["unable to generate options"];
    },
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;
      const fieldName = FIELDS.CALABRIO_WFM_OPTIONAL_COLUMNS.name;
      const field = (row[fieldName]) ? row[fieldName].trim() : "";
      const uniqueColumnNames: Set<string> = new Set<string>();
      const optionalColumnErrors: string[] = [];
      row.wfmOptionalColumns = [];

      if (!field) {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
      } else {
        try {
          const businessUnitObj = state.calabrioContext.wfmOptions.find((bu: any) => bu.Id === row.businessUnitId);

          if (!businessUnitObj) {
            return rejectPromise(`Unable to validate ${fieldName} due to invalid Business Unit for row ${rowNumber}`, rowNumber);
          }
          const fieldArray = field.split(",");
          fieldArray.forEach((oc: any) => {
            const columnKeyValuePair = oc.split(":");
            const cleanOptionalColumnName = cleanupField(columnKeyValuePair[0], "string");
            const trimmedOptionalColumnValue = (columnKeyValuePair[1]) ? columnKeyValuePair[1].trim() : "";

            const optionalColumnObj = businessUnitObj.Optional_Columns.find((r: any) => cleanupField(r.Name, "string") === cleanOptionalColumnName);
            if (!optionalColumnObj) {
              optionalColumnErrors.push(`${cleanOptionalColumnName} is not valid for the selected business unit for row ${rowNumber}`);
            } else {
              // check for duplicate column names
              if (uniqueColumnNames.has(cleanOptionalColumnName)) {
                optionalColumnErrors.push(`Duplicate WFM Optional Column ${cleanOptionalColumnName} for row ${rowNumber}`);
              } else {
                uniqueColumnNames.add(cleanOptionalColumnName);
              }

              // reformat - Teleopti api wants Id and Value
              if (trimmedOptionalColumnValue) {
                const optionalColumn = {
                  Id: optionalColumnObj.Id,
                  Value: trimmedOptionalColumnValue
                };
                row.wfmOptionalColumns.push(optionalColumn);
              } else {
                optionalColumnErrors.push(`No value given for WFM Optional Column ${cleanOptionalColumnName} for row ${rowNumber}`);
              }
            }
          });

          if (optionalColumnErrors.length > 0) {
            throw new Error(optionalColumnErrors.toString());
          }
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        } catch (err) {
          return rejectPromise(err.message, rowNumber);
        }
      }
    }
  },
  CALABRIO_WFM_NOTE: { // can be empty
    field: "wfmNote",
    name: "Note",
    type: "string",
    description: "Optional string representing text that will be saved in the general note field",
    example: "I'm a note!",
    options: null,
    validateFunction: (row: any, state: any): Promise<any> => {
      const rowNumber = row.rowNumber;

      try {
        const fieldName = FIELDS.CALABRIO_WFM_NOTE.name;
        const field = row[fieldName].trim();

        if (!field) {
          return Promise.resolve(`${fieldName} is empty but not required. Skipping validation for row ${rowNumber}`);
        } else {
          row.wfmNote = (field);
          return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
        }
      } catch (err) {
        return rejectPromise(err.message, rowNumber);
      }
    }
  }
};
