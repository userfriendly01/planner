import {
  createUser,
  createCalabrioUser,
  updateUser,
  fetchUser,
  generateExtension
} from "services";
import {
  getE164Number,
  getOverflowSkillFromProfile
} from "utils";
import {
  calabrioAllowedRoles,
  calabrioTimeZones
} from "utils";
import {
  checkConflictingUsers,
  cleanupField
} from "./utils";

const toProperCase = (field: any) => {
  const fieldArray = field.split(" ").map((w: string) => {
    const word = w.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return fieldArray.join(" ");
};


const isDidUser = (didField: any, rowNumber: number) => {
  if(typeof didField !== "string"){
    Promise.reject(`Did User field needs to be 'Y' or 'N' for row ${rowNumber}`);
  } else if(didField !== "y" && didField !== "n"){
    Promise.reject(`Did User field needs to be 'Y' or 'N' for row ${rowNumber}`);
  } else if(didField === "y") {
    return true;
  } else {
    return false;
  }
};

//Fields
const getTritonFields = (state: any): any => [
  {
    field: "nNumber",
    name: "N Number",
    type: "string",
    description: "Agents N Number",
    required: "Y",
    example: "n0263786",
    options: null,
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "N Number";
      const field = cleanupField(row[fieldName], "string");
      const worker = state.workerContext.workers.find((w: any) => cleanupField(w.attributes.n_number, "string") === field);
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(typeof field !== "string" || field.length !== 8) {
        return Promise.reject(`${fieldName} is not in the valid n number format for row ${rowNumber}`);
      } else if(worker){
        return Promise.reject(`${field} already has a record in Twilio/Worker Database ${rowNumber}`);
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
        } catch(err) {
          return Promise.reject(`Error thrown fetching ${fieldName} from HR Database for row ${rowNumber}`);
        }
      }
    }
  },
  {
    field: "profileId",
    name: "Profile Id",
    type: "number",
    description: "Profile Id",
    required: "Y",
    example: 3,
    options: state.profileContext.profiles.map((p: any) => p.profile_id),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Profile Id";
      const field = cleanupField(row[fieldName], "number");
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(typeof field !== "number"){
        return Promise.reject(`${fieldName} must be a number for row ${rowNumber}`);
      } else if(!state.profileContext.profiles.some((p:any) => cleanupField(p.profile_id, "number") === field)){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        row.attributes.profile_id = field;
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  {
    field: "managerNNumber",
    name: "Manager N Number",
    type: "string",
    description: "N Number of the Manager",
    required: "Y",
    example: "n0088625",
    options: state.managerContext.managers.map((m: any) => m.manager_n_number),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Manager N Number";
      const field = cleanupField(row[fieldName], "string");

      const managerObject = state.managerContext.managers.find((m:any) => cleanupField(m.manager_n_number, "string") === field);
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!managerObject){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        row.attributes.manager_first_name = managerObject.manager_first_name;
        row.attributes.manager_last_name = managerObject.manager_last_name;
        row.attributes.manager_n_number = managerObject.manager_n_number;
        row.attributes.manager = `${managerObject.manager_first_name} ${managerObject.manager_last_name}`;
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  {
    field: "defaultSkills",
    name: "Default Skills",
    type: "string",
    description: "Comma delimited list of skill/level pairings. Skills can be on their own or have a ':level' to represent the level. If left blank, no skills will be added to the user",
    required: "N",
    example: "bscCommissions:3, blSalesL1:2, aisl1",
    options: state.skillContext.skills.map((s: any) => {
      if(s.levels?.length > 0){
        return `${s.name} Available levels: ${s.levels.toString()}`;
      } else {
        return s.name;
      }
    }),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      /*
        skills object: {
         levels: {asig: 2},
         skills: [466, aisg]   
        }
      */
      const fieldName = "Default Skills";
      const field: any = row[fieldName];
      const defaultSkills: any = {
        skills: [],
        levels: {}
      };
      if(field){
        try {
          const fieldArray = field.replace(" ","").split(",");
          fieldArray.forEach((objString: string) => {
            const objKeyValueArray = objString.replace(" ","").split(":");
            const key: any = cleanupField(objKeyValueArray[0], "string");
            const value: any = cleanupField(objKeyValueArray[1], "number");
            if(value){
              defaultSkills.levels[key] = value;
            }
            defaultSkills.skills.push(key);
          });
        } catch(err){
          return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}. Must be a comma delimited list of skills. If a skill has a level it must be separated by a :`);
        }

        const availableSkills = state.skillContext.skills;
        const skillErrors: any = [];

        defaultSkills.skills.forEach((ds: any) => {
          if(!availableSkills.some((as: any) => cleanupField(as.name, "string") === ds)){
            skillErrors.push(`${ds} is not an available skill `);
          }
        });

        Object.keys(defaultSkills.levels).forEach((skill: any) => {
          const matchingSkill = availableSkills.find((as: any) => cleanupField(as.name, "string") === skill);
          const level = defaultSkills.levels[skill];
          if(!matchingSkill){
            skillErrors.push(`${skill} is not an available skill `);
          } else if(!matchingSkill.levels.includes(level)){
            skillErrors.push(`${skill} does not support Level ${level} `);
          }
        });
        if(skillErrors.length > 0){
          return Promise.reject(`${fieldName} Errors found for row ${rowNumber} ${skillErrors.toString()}`);
        } else {
          row.attributes.defaultSkills = defaultSkills;
          return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
        }
      } else {
        return Promise.resolve(`${fieldName} is empty but not required. Skipping validation`);
      }
    }
  },
  {
    field: "extension",
    name: "Extension",
    type: "string",
    description: "Enter a number for the users extension or type Y for a randomly generated extension. Enter N for no extension",
    required: false,
    example: "65214",
    options: null,
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Extension";
      const field = cleanupField(row[fieldName], "string");
      const newExtension = field === "y";
      const workers = state.workerContext.workers;

      if(!field){
        return Promise.resolve(`No ${fieldName} set for row ${rowNumber}`);
      } else if(newExtension){
        let extension;
        try {
          extension = await generateExtension(workers);
          row.attributes.extension = extension;
        } catch (err) {
          console.error("Error generating extension", err);
          return Promise.reject(`Unable to generate ${fieldName} for row ${rowNumber}`);
        }
        return Promise.resolve(`${fieldName} ${extension} set for row ${rowNumber}`);
      } else if(typeof field !== "string"){
        return Promise.reject(`${fieldName} must be a number or 'Y' for row ${rowNumber}. If you do not want an extension for this user, leave the field blank`);
      } else if(field === "n"){
        return Promise.resolve(`${fieldName} skipped for row ${rowNumber}. `);
      } else {
        try {
          const isInt = parseInt(field);
          if(typeof isInt !== "number" && isInt > 0){
            return Promise.reject(`${fieldName} ${field} is in the wrong format for row ${rowNumber}`);
          }
          const isExtensionTaken = workers.some((w: any) => cleanupField(w.attributes.extension, "string") === field);
          if(!isExtensionTaken){
            row.attributes.extension = field;
            return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
          } else {
            return Promise.reject(`${fieldName} ${field} is already taken for row ${rowNumber}`);
          }
        } catch(err) {
          return Promise.reject(`${fieldName} ${field} is in the wrong format for row ${rowNumber}`);
        }
      }
    }
  },
  {
    field: "didUser",
    name: "Did User",
    type: "boolean",
    description: "Y/N indicator to represent if user has a Direcr Dial Number",
    required: true,
    example: "Y",
    options: null,
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Did User";
      const field = cleanupField(row[fieldName], "string");

      try {
        isDidUser(field, rowNumber);
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
      } catch(err) {
        return Promise.reject(`${fieldName} needs to be 'Y' or 'N' for row ${rowNumber}`);
      }
    }
  },
  {
    field: "directDialNumber",
    name: "Direct Dial Number",
    type: "string",
    description: "10 digit Direct Dial Phone Number, will be prepended with +1. Only required when DID User is true",
    required: true,
    example: "6038518200",
    options: null,
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Direct Dial Number";
      const field = cleanupField(row[fieldName], "string");
      const didFieldName = "Did User";
      const didField = cleanupField(row[didFieldName], "string");


      try {
        const didUser = isDidUser(didField, rowNumber);
        console.warn("Bullshit Summary - Zero Out Enabled: ", rowNumber, field, didField, didUser);
        if(didUser && field){
          try {
            const directDialNum = getE164Number(field);
            row.attributes.did = directDialNum;
            row.directDialNum = directDialNum;
            row.activateEp = true;
            row.alternateDid = directDialNum;
            return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
          } catch(err) {
            return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
          }
        } else if(didUser && !field) {
          return Promise.reject(`${fieldName} is required when DID user is 'Y' ${rowNumber}`);
        } else if(!didUser && !field) {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else {
          return Promise.reject(`Did User field is 'N', ${fieldName} is not applicable for row ${rowNumber}`);
        }
      } catch(err) {
        return Promise.reject(`${didFieldName} needs to be 'Y' or 'N' for row ${rowNumber}`);
      }
    }
  },
  {
    field: "zeroOutEnabled",
    name: "Zero Out Enabled",
    type: "boolean",
    description: "Y/N Indicator to represent if the zero out skill aligned to the profile ID should be added to the users current skills. Only required when DID User is true",
    required: true,
    example: "Y",
    options: null,
    validateFunction: async (row: any, rowNumber: number) => {
      const fieldName = "Zero Out Enabled";
      const field = cleanupField(row[fieldName], "string");
      const didFieldName = "Did User";
      const didField = cleanupField(row[didFieldName], "string");

      try {
        const didUser = isDidUser(didField, rowNumber);
        console.warn("Bullshit Summary - Zero Out Enabled: ", rowNumber, field, didField, didUser);
        if(didUser && field === "y"){
          try {
            const profileFieldName = "Profile Id";
            const profiles = state.profileContext.profiles;
            const profileId = cleanupField(row[profileFieldName], "number");
            const overflowSkill = getOverflowSkillFromProfile(profiles, profileId);
            if(overflowSkill){
              row.attributes.routing = {
                skills: [cleanupField(overflowSkill, "string")],
                levels: {}
              };
            }
            row.zeroOutEnabled = true;
            return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
          } catch(err) {
            return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
          }
        } else if(didUser && field === "n") {
          row.zeroOutEnabled = false;
          return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
        } else if(didUser && !field) {
          return Promise.reject(`${fieldName} is required when DID user is 'Y' ${rowNumber}`);
        } else if(!didUser && !field) {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else if(!didUser && field === "n") {
          return Promise.resolve(`${fieldName} skipped for Non DID user for row ${rowNumber}`);
        } else {
          return Promise.reject(`Did User field is 'N', ${fieldName} is not applicable for row ${rowNumber}`);
        }
      } catch(err) {
        return Promise.reject(`${didFieldName} needs to be 'Y' or 'N' for row ${rowNumber}`);
      }
    }
  },
  {
    field: "outgoingNumber",
    name: "Outgoing Number",
    type: "string",
    description: "If the user is not a DID user this is their Outgoing number",
    required: true,
    example: "6038518288",
    options: null,
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Outgoing Number";
      const field = cleanupField(row[fieldName], "string");
      const didFieldName = "Did User";
      const didField = cleanupField(row[didFieldName], "string");

      try {
        const didUser = isDidUser(didField, rowNumber);
        console.warn("Bullshit Summary - Outgoing Number: ", rowNumber, field, didField, didUser);
        if(didUser && field){
          return Promise.reject(`Did User field is 'Y', ${fieldName} is not applicable for row ${rowNumber}`);
        } else if(didUser && !field) {
          return Promise.resolve(`${fieldName} skipped for DID user for row ${rowNumber}`);
        } else if(!didUser && !field) {
          return Promise.reject(`${fieldName} is required when DID user is 'N' ${rowNumber}`);
        } else {
          try {
            const outgoing = getE164Number(field);
            row.attributes.did = outgoing;
            return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
          } catch(err) {
            return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
          }
        }
      } catch(err) {
        return Promise.reject(`${didFieldName} needs to be 'Y' or 'N' for row ${rowNumber}`);
      }
    }
  }
];

const getCalabrioQmFields = (state: any): any => [
  {
    field: "nNumber",
    name: "N Number",
    type: "string",
    description: "Agents N Number",
    required: "Y",
    example: "n0263786",
    options: null,
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "N Number";
      const field = cleanupField(row[fieldName], "string");
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(typeof field !== "string" || field.length !== 8) {
        return Promise.reject(`${fieldName} is not in the valid n number format for row ${rowNumber}`);
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
        } catch(err) {
          return Promise.reject(`Error thrown fetching ${fieldName} from HR Database for row ${rowNumber}`);
        }
      }
    }
  },
  {
    field: "calabrioScope",
    name: "Calabrio Scope",
    type: "string",
    description: "Comma delimited list of groups or teams to represent a supervisor or evaluators scope. (Must already exist in Calabrio)",
    required: "Y",
    example: "Default Group",
    options: state.calabrioContext.groups.map((g: any) => g.name),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Calabrio Scope";
      const field = cleanupField(row[fieldName], "string");
      const availableGroups = state.calabrioContext.groups;
      const availableTeams = state.calabrioContext.teams;
      row.scope = {
        groups: [],
        teams: []
      };

      if(!field){
        return Promise.resolve(`${fieldName} skipped for row ${rowNumber}`);
      } else {
        try {
          const fieldArray = field.split(",");
          if(fieldArray.length === 0){
            return Promise.resolve(`${fieldName} skipped for row ${rowNumber}`);
          } else {
            fieldArray.forEach((scope: any) => {
              const cleanScope = cleanupField(scope, "string");
              const group = availableGroups.find((g:any) => cleanupField(g.name, "string") === cleanScope);
              const team = availableTeams.find((t:any) => cleanupField(t.name, "string") === cleanScope);
              if(!group && !team){
                return Promise.reject(`${cleanScope} is not a valid group or team for row ${rowNumber}`);
              } else if(group) {
                row.scope.groups.push(group.groupId);
              } else {
                row.scope.teams.push(team.teamId);
              }
            });
            return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
          }
        } catch(err) {
          console.error("Error Thrown validating extension", err);
          return Promise.reject(`${field} is not in the correct format for row ${rowNumber}`);
        }
      }
    }
  },
  {
    field: "calabrioTeam",
    name: "Calabrio Team",
    type: "string",
    description: "Team (Must already be created in Calabrio)",
    required: "Y",
    example: "Default Team",
    options: state.calabrioContext.teams.map((t: any) => t.name),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Calabrio Team";
      const field = cleanupField(row[fieldName], "string");
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!state.calabrioContext.teams.some((t:any) => cleanupField(t.name, "string") === field)){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        const team = state.calabrioContext.teams.find((t:any) => cleanupField(t.name, "string") === field);
        if(!team || !team.groupId){
          return Promise.reject(`${fieldName} is not a valid option from row ${rowNumber}`);
        } else {
          row.groupId = team.groupId;
          return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
        }
      }
    }
  },
  {
    field: "roles",
    name: "Calabrio Role",
    type: "string",
    description: "Comma delimited list of approved roles that already exist in Calabrio",
    required: "Y",
    example: "QM Agent",
    options: calabrioAllowedRoles,
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Calabrio Role";
      const field = cleanupField(row[fieldName], "string");

      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else {
        try {
          const fieldArray = field.split(",");
          if(fieldArray.length === 0){
            return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
          } else {
            fieldArray.forEach((role: any) => {
              const cleanRole = cleanupField(role, "string");
              const foundInRoles = calabrioAllowedRoles.some((r:any) => cleanupField(r, "string") === cleanRole);
              const roleObject = state.calabrioContext.roles.find((r:any) => cleanupField(r.name, "string") === cleanRole);
              row.roles = [];
              if(!foundInRoles || !roleObject){
                return Promise.reject(`${cleanRole} is not a valid role for row ${rowNumber}`);
              } else {
                row.roles.push(roleObject);
                return Promise.resolve(`${fieldName} valid for row ${rowNumber}`);
              }
            });
          }
        } catch(err) {
          return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
        }
      }
    }
  },
  {
    field: "timeZone",
    name: "Time Zone",
    type: "string",
    description: "Time Zone of the Calabrio User",
    example: "America/New_York (EST/EDT)",
    options: calabrioTimeZones.map((t: any) => t.label),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Time Zone";
      const field = cleanupField(row[fieldName], "string");
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!calabrioTimeZones.some((t:any) => cleanupField(t.label, "string") === field)){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        row.timeZone = row[fieldName];
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  }
];

const getUpdateWorkerAttributeFields = (state: any): any => [
  {
    field: "nNumber",
    name: "N Number",
    type: "string",
    description: "Agents N Number",
    required: "Y",
    example: "n0263786",
    options: state.workerContext.workers.map((w: any) => w.attributes.n_number),
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "N Number";
      const field = cleanupField(row[fieldName], "string");
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(typeof field !== "string" || field.length !== 8) {
        return Promise.reject(`${fieldName} is not in the valid n number format for row ${rowNumber}`);
      } else {
        try {
          const worker = state.workerContext.workers.find((w: any) => cleanupField(w.attributes.n_number, "string") === field);

          if(worker){
            row.workerSid = worker.sid;
            row.n_number = field;
            return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
          } else {
            return Promise.reject(`${field} is not an existing setup worker in Triton ${rowNumber}`);
          }
        } catch(err) {
          return Promise.reject(`Error thrown fetching ${fieldName} from state for row ${rowNumber}`);
        }
      }
    }
  }
];

const processCreateTritonUser = async (row: any, rowNumber: number, state: any) => {
  console.log("**** TRITON RECORD PROCESSING", row);
  const workerSid = "WK123456";
  // const workerSid = await createUser(row);
  const didFieldName = "Did User";
  const didField = cleanupField(row[didFieldName], "string");
  const didUser = isDidUser(didField, rowNumber);
  const body: any = {};
  if(didUser) {
    body.attributes = row.attributes;
    body.activateEp = true;
    body.alternateDid = row.directDialNum;
    body.directDialNum = row.directDialNum;
    body.zeroOutEnabled = row.zeroOutEnabled;
  } else {
    body.attributes = row.attributes;
    body.activateEp = false;
  }

  row.workerSid = workerSid;
  row.acdId = workerSid;

  console.log("FINAL TRITON BODY: ", body);
  Promise.resolve(`${workerSid} created for ${row.n_number}`);
  //call set state
};

const processCreateCalabrioUser = async (row: any, rowNumber: number, state: any) => {
  console.log("****CALABRIO RECORD PROCESSING for", row);
  await checkConflictingUsers(row, rowNumber, state.calabrioContext.users);
  const existingTritonWorker = state.workerContext.workers.find((w:any) => w.attributes.n_number === row.n_number);
  const acdId = row.acdId || existingTritonWorker.sid || undefined;
  const body: any = {};

  body.acdId = acdId;
  body.adLogin = `LM\\${row.n_number.toLowerCase()}`;
  body.email = row.email;
  body.firstName = row.firstName;
  body.lastName = row.lastName;
  body.groupId = row.groupId;
  body.timeZone = row.timezone;
  body.roles = row.roles;
  body.scope = row.scope;

  //await create calabrio user
  //call set state
  Promise.resolve();
};

const processUpdateWorkerAttribute = async (row: any, rowNumber: number, template: any, state: any) => {
  const key = template.data.key;
  const value = template.data.value;
  const attributes = { [key]: value };

  const isWorkerFound = state.workerContext.workers.find((w:any) => w.attributes.n_number === row.n_number);
  row.attributes = attributes;
  row.workerSid = isWorkerFound.sid;
  console.log("**** UPDATE WORKER ATTRIBUTE RECORD PROCESSING", row);
  // updateUser(row.workerSid, row);
  Promise.resolve(`${row.workerSid} - Worker Attributes updated for row ${rowNumber}`);
};

//Templates
export const getCreateTemplates: any = (state: any): any => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      data: {},
      processFunction: (row: any, rowNumber: number) => processCreateTritonUser(row, rowNumber, state),
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: getTritonFields(state)
    },
    CREATE_CALABRIO_QM_USER: {
      name: "CREATE_CALABRIO_QM_USER",
      data: {},
      processFunction: (row: any, rowNumber: number) => processCreateCalabrioUser(row, rowNumber, state),
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER",
        variable: "workerSid"
      }],
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 25,
      fields: getCalabrioQmFields(state)
    }
  };
};

export const getUpdateTemplates: any = (state: any): any => {
  return {
    UPDATE_WORKER_ATTRIBUTE: {
      name: "UPDATE_WORKER_ATTRIBUTE",
      data: {},
      processFunction: (row: any, rowNumber: number, template: any) => processUpdateWorkerAttribute(row, rowNumber, template, state),
      multiRunDependencies: null,
      validationConcurrencyLimit: null,
      processingConcurrencyLimit: 5,
      fields: getUpdateWorkerAttributeFields(state)
    }
  };
};