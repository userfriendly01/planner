import {
  checkExtension,
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
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(typeof field !== "string" || field.length !== 8) {
        return Promise.reject(`${fieldName} is not in the valid n number format for row ${rowNumber}`);
      } else {
        try {
          const fetchedUser = await fetchUser(field);

          row.contact_uri = `client:${field.toLowerCase()}`;
          row.department_id = fetchedUser.departmentNumber;
          row.department_name = fetchedUser.departmentName;
          row.email = fetchedUser.email;
          row.email_address = fetchedUser.email;
          row.emp_first_name = fetchedUser.firstName;
          row.emp_last_name = fetchedUser.lastName;
          row.full_name = `${fetchedUser.firstName} ${fetchedUser.lastName}`;
          row.location = fetchedUser.officeName;
          row.n_number = field.toLowerCase();
          row.office_location_name = fetchedUser.officeName;
          row.office_location_number = fetchedUser.officeNumber;
          row.primary_dept_name = fetchedUser.departmentName;
          row.primary_dept_number = fetchedUser.departmentNumber;
          row.unique_id = field.toLowerCase();
          row.adLogin = `LM\\${field.toLowerCase()}`;
          row.firstName = fetchedUser.firstName;
          row.lastName = fetchedUser.lastName;

          delete row[fieldName];

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
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(typeof field !== "number"){
        return Promise.reject(`${fieldName} must be a number for row ${rowNumber}`);
      } else if(!state.profileContext.profiles.some((p:any) => p.profile_id === field)){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        row.profile_id = field;
        delete row[fieldName];
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
      const field = row[fieldName];
      const managerObject = state.managerContext.managers.find((m:any) => m.manager_n_number?.toLowerCase() === field.toLowerCase());
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!managerObject){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        row.manager_first_name = managerObject.manager_first_name;
        row.manager_last_name = managerObject.manager_last_name;
        row.manager_n_number = managerObject.manager_n_number;
        row.manager = `${managerObject.manager_first_name} ${managerObject.manager_last_name}`;
        delete row[fieldName];
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
    options: state.skillContext.skills.map((s: any) => `${s.name}${s.levels?.length > 0 ? ` : Available levels: ${s.levels.toString()}` : null}`),
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
      try {
        const fieldArray = field.replace(" ","").split(",");
        fieldArray.forEach((objString: string) => {
          const objKeyValueArray = objString.replace(" ","").split(":");
          const key: any = objKeyValueArray[0];
          const value: any = objKeyValueArray[1];
          if(value){
            defaultSkills.levels[key] = value;
          }
          defaultSkills.skills.push({ key: parseInt(value) });

        });
      } catch(err){
        return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}. Must be a comma delimited list of skills. If a skill has a level it must be separated by a :`);
      }

      const availableSkills = state.skillContext.skills;
      const skillErrors: any = [];

      defaultSkills.skills.forEach((ds: any) => {
        if(!availableSkills.some((as: any) => as.name === ds)){
          skillErrors.push(`${ds} is not an available skill `);
        }
      });

      Object.keys(defaultSkills.levels).forEach((skill: any) => {
        const matchingSkill = availableSkills.find((as: any) => as.name === skill);
        const level = defaultSkills.levels[skill];
        if(!matchingSkill){
          skillErrors.push(`${skill} is not an available skill `);
        } else if(!matchingSkill.levels.includes(level)){
          skillErrors.push(`${skill} does not support Level ${level} `);
        }
      });
      if(skillErrors.length !== 0){
        row.defaultSkills = defaultSkills;
        //delete row[fieldName];
        return Promise.resolve(`${fieldName} Errors found for row ${rowNumber} ${skillErrors.toString()}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
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
      const field = row[fieldName];
      const newExtension = typeof field === "string" ? field.toLowerCase() === "y" : false;

      if(!field){
        return Promise.resolve(`No ${fieldName} set for row ${rowNumber}`);
      } else if(newExtension){
        let extension;
        try {
          extension = await generateExtension();
          row.extension = extension;
          delete row[fieldName];
        } catch (err) {
          return Promise.reject(`Unable to generate ${fieldName} for row ${rowNumber}.`);
        }
        return Promise.resolve(`${fieldName} ${extension} set for row ${rowNumber}`);
      } else if(typeof field !== "number"){
        return Promise.reject(`${fieldName} must be a number or 'Y' for row ${rowNumber}. If you do not want an extension for this user, leave the field blank`);
      } else {
        const isExtensionValid = await checkExtension(field);
        if(isExtensionValid){
          row.extension = field;
          delete row[fieldName];
          return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
        } else {
          return Promise.reject(`${fieldName} ${field} is already taken for row ${rowNumber}`);
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
      const field = row[fieldName];

      if(typeof field !== "string"){
        return Promise.reject(`${fieldName} needs to be 'Y' or 'N' for row ${rowNumber}`);
      } else if(field.toLowerCase() !== "y" && field.toLowerCase() !== "n"){
        return Promise.reject(`${fieldName} needs to be 'Y' or 'N' for row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
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
      const field = row[fieldName];
      const didFieldName = "Did User";
      const didField = row[didFieldName];

      if(typeof didField !== "string"){
        return Promise.reject(`Did User field is incorrect ${fieldName} cannot be validated for row ${rowNumber}`);
      } else if(didField?.toLowerCase() !== "y" && didField?.toLowerCase() !== "n"){
        return Promise.reject(`Did User field is incorrect ${fieldName} cannot be validated for row ${rowNumber}`);
      } else if(didField?.toLowerCase() === "n" && field){
        return Promise.reject(`Did User field is 'N', ${fieldName} is not applicable for row ${rowNumber}`);
      } else {
        try {
          const directDialNum = getE164Number(field);
          row.did = directDialNum;
          row.directDialNum = directDialNum;
          //remove original
        } catch(err) {
          return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
        }
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
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
      const field = row[fieldName];
      const didFieldName = "Did User";
      const didField = row[didFieldName];

      if(typeof didField !== "string"){
        return Promise.reject(`Did User field is incorrect ${fieldName} cannot be validated for row ${rowNumber}`);
      } else if(didField?.toLowerCase() !== "y" && didField?.toLowerCase() !== "n"){
        return Promise.reject(`Did User field is incorrect ${fieldName} cannot be validated for row ${rowNumber}`);
      } else if(didField?.toLowerCase() === "n" && field){
        return Promise.reject(`Did User field is 'N', ${fieldName} is not applicable for row ${rowNumber}`);
      } else {
        if(typeof field !== "string"){
          return Promise.reject(`${fieldName} should be 'Y' or 'N' for row ${rowNumber}`);
        } else if(field?.toLowerCase() !== "y" && field?.toLowerCase() !== "n"){
          return Promise.reject(`${fieldName} should be 'Y' or 'N' for row ${rowNumber}`);
        } else if(field?.toLowerCase() === "n"){
          row.zeroOutEnabled = false;
          return Promise.resolve(`${fieldName} set to false for row ${rowNumber}`);
        } else {
          try {
            const profileFieldName = "Profile Id";
            const profiles = state.profileContext.profiles;
            const profileId = row[profileFieldName] ? profiles.find((p:any) => p.profile_id === row[profileFieldName]) : row.profile_id;
            const overflowSkill = getOverflowSkillFromProfile(profiles, profileId);
            if(overflowSkill){
              row.routing = {
                skills: [overflowSkill],
                levels: {}
              };
            }
            row.zeroOutEnabled = true;

            //remove original
          } catch(err) {
            return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
          }
          return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
        }
      }
    }
  },
  {
    field: "alternateNumber",
    name: "Alternate/Outgoing Number",
    type: "string",
    description: "If the user is a DID user, this is the Teams/Alternate DID. If The User is not a DID user, this is populated as the Outgoing number",
    required: true,
    example: "6038518288",
    options: null,
    validateFunction: async (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Alternate/Outgoing Number";
      const field = row[fieldName];
      const didFieldName = "Did User";
      const didField = row[didFieldName];

      if(typeof didField !== "string"){
        return Promise.reject(`Did User field is incorrect ${fieldName} cannot be validated for row ${rowNumber}`);
      } else if(didField?.toLowerCase() !== "y" && didField?.toLowerCase() !== "n"){
        return Promise.reject(`Did User field is incorrect ${fieldName} cannot be validated for row ${rowNumber}`);
      } else if(didField?.toLowerCase() === "n" && field){
        try {
          const directDialNum = getE164Number(field);
          row.did = directDialNum;
          //remove original
        } catch(err) {
          return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
        }
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
      } else {
        try {
          const directDialNum = getE164Number(field);
          row.did = directDialNum;
          row.directDialNum = directDialNum;
          //remove original
        } catch(err) {
          return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}`);
        }
        return Promise.resolve(`${fieldName} ${field} set for row ${rowNumber}`);
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
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "N Number";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!state.calabrioContext.groups.some((g:any) => g.name?.toLowerCase() === field?.toLowerCase())){
        //maybe validate format?
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  {
    field: "calabrioGroup",
    name: "Calabrio Group",
    type: "string",
    description: "Parent Group (Must already be created in Calabrio)",
    required: "Y",
    example: "Default Group",
    options: state.calabrioContext.groups.map((g: any) => g.name),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Calabrio Group";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!state.calabrioContext.groups.some((g:any) => g.name?.toLowerCase() === field?.toLowerCase())){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
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
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!state.calabrioContext.teams.some((t:any) => t.name?.toLowerCase() === field?.toLowerCase())){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  {
    field: "roles",
    name: "Calabrio Role",
    type: "string",
    description: "Must be an approved role to add by management and already exist in Calabrio",
    required: "Y",
    example: "QM Agent",
    options: calabrioAllowedRoles,
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Calabrio Role";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!calabrioAllowedRoles.some((r:any) => r?.toLowerCase() === field?.toLowerCase())){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
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
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!calabrioTimeZones.some((t:any) => t.label?.toLowerCase() === field?.toLowerCase())){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  }
];


//Templates
export const getCreateTemplates: any = (state: any): any => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      processFunction: () => Promise.resolve(Date.now()),
      multiRunDependencies: null,
      validationConcurrencyLimit: 10,
      processingConcurrencyLimit: 10,
      fields: getTritonFields(state)
    },
    CREATE_CALABRIO_QM_USER: {
      name: "CREATE_CALABRIO_QM_USER",
      processFunction: () => Promise.resolve(Date.now()),
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER",
        variable: "workerSid"
      }],
      validationConcurrencyLimit: null,
      processingConcurrencyLimit: null,
      fields: getCalabrioQmFields(state)
    }
  };
};