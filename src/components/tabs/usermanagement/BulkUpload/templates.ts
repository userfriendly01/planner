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
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      console.log("entering validate nNumber function");
      const fieldName = "N Number";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
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
      console.log("entering validate nNumber function");
      const fieldName = "Profile Id";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else {
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
      console.log("entering validate nNumber function");
      const fieldName = "Profile Id";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!state.managerContext.managers.some((m:any) => m.manager_n_number.toLowerCase() === field.toLowerCase())){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  },
  {
    field: "defaultSkills",
    name: "Default Skills",
    type: "string",
    description: "Comma delimited list of skills assigned as the Defauls Skill profile for the user. If left blank, no skills will be assigned",
    required: "N",
    example: "bscCommissions, aisgl1, blSalesL1",
    options: state.skillContext.skills.map((s: any) => s.name),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Default Skills";
      const field = row[fieldName];
      let skillsArray;
      console.log("entering validate skills function", field);
      try {
        skillsArray = field.split(",");
      } catch(err){
        return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}. Must be a comma delimited list of skills.`);
      }
      console.log("skillsArray", skillsArray);

      skillsArray.forEach((skill: any) => {
        if(!state.skillContext.skills.some((s:any) => s.name.toLowerCase() === skill.toLowerCase())){
          return Promise.reject(`${skill} is not a valid option for row ${rowNumber}`);
        }
      });
      return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
    }
  },
  {
    field: "defaultSkillLevels",
    name: "Default Skill Levels",
    type: "string",
    description: "Comma delimited list of skill/level pairings. Skills should have a colon before the level. If left blank, skills with levels will default to 1",
    required: "N",
    example: "bscCommissions: 3, blSalesL1: 2",
    options: null,
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Default Skills";
      const field = row[fieldName];
      let skillsLevelArray;
      console.log("entering validate skills function", field);
      try {
        skillsLevelArray = field.split(",");
      } catch(err){
        return Promise.reject(`${fieldName} is not in the correct format for row ${rowNumber}. Must be a comma delimited list of skills.`);
      }
      console.log("skillsLevelArray", skillsLevelArray);

      skillsLevelArray.forEach((skill: any) => {
        const matchingSkill = state.skillContext.skills.some((s:any) => s.name.toLowerCase() === skill.toLowerCase());
        const availableLevels = matchingSkill.levels;
        if(!matchingSkill){
          return Promise.reject(`${skill} is not a valid option for row ${rowNumber}`);
        }
      });
      return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
    }
  },
  {
    field: "extension",
    name: "Extension",
    type: "string",
    description: "Enter a number for the users extension or type Y for a randomly generated extension. Enter N for no extension",
    required: false,
    example: "65214",
    options: null
  },
  {
    field: "didUser",
    name: "Did User",
    type: "boolean",
    description: "Y/N indicator to represent if user has a Direcr Dial Number",
    required: true,
    example: "Y",
    options: null
  },
  {
    field: "directDialNumber",
    name: "Direct Dial Number",
    type: "string",
    description: "10 digit Direct Dial Phone Number, will be prepended with +1. Only required when DID User is true",
    required: true,
    example: "6038518200",
    options: null
  },
  {
    field: "zeroOutEnabled",
    name: "Zero Out Enabled",
    type: "boolean",
    description: "Y/N Indicator to represent if the zero out skill aligned to the profile ID should be added to the users current skills. Only required when DID User is true",
    required: true,
    example: "Y",
    options: null
  },
  {
    field: "alternateNumber",
    name: "Alternate/Outgoing Number",
    type: "string",
    description: "If the user is a DID user, this is the Teams/Alternate DID. If The User is not a DID user, this is populated as the Outgoing number",
    required: true,
    example: "6038518288",
    options: null
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
      console.log("entering validate nNumber function");
      const fieldName = "N Number";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!state.calabrioContext.groups.some((g:any) => g.name.toLowerCase() === field.toLowerCase())){
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
      } else if(!state.calabrioContext.groups.some((g:any) => g.name.toLowerCase() === field.toLowerCase())){
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
      } else if(!state.calabrioContext.teams.some((t:any) => t.name.toLowerCase() === field.toLowerCase())){
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
      } else if(!calabrioAllowedRoles.some((r:any) => r.toLowerCase() === field.toLowerCase())){
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
    example: "America/New_York",
    options: calabrioTimeZones.map((t: any) => t.label),
    validateFunction: (row: any, rowNumber: number): Promise<any> => {
      const fieldName = "Time Zone";
      const field = row[fieldName];
      if(!field){
        return Promise.reject(`${fieldName} is missing from row ${rowNumber}`);
      } else if(!calabrioTimeZones.some((t:any) => t.label.toLowerCase() === field.toLowerCase())){
        return Promise.reject(`${fieldName} is not a valid option for row ${rowNumber}`);
      } else {
        return Promise.resolve(`${fieldName} Valid for row ${rowNumber}`);
      }
    }
  }
];

//Validation Steps
const validateTritonFields = async (uploadedForm: any, state: any): Promise<any> => {
  const fields: any = getTritonFields(state);
  const validationErrors: any = [];

  console.log("validateTritonFields");
  const tritonPromises = await Promise.allSettled(uploadedForm.map(async (row: any, index: number) => {
    console.log("validateFields", row);
    const rowErrors = [];

    //N Number
    const nNumber = fields[0];
    const fieldName0 = nNumber.name;
    if(!row[fieldName0]){
      rowErrors.push(`${fieldName0} is missing from row ${index + 1}`);
    }

    //Profile Id
    const profileId = fields[1];
    const fieldName1 = profileId.name;
    if(!row[fieldName1]){
      rowErrors.push(`${fieldName1} is missing from row ${index + 1}`);
    }

    //Manager nNumber
    const managerNNumber = fields[2];
    const fieldName2 = managerNNumber.name;

    if(!row[fieldName2]){
      rowErrors.push(`${fieldName2} is missing from row ${index + 1}`);
    }

    //Default Skills
    const defaultSkills = fields[3];
    const fieldName3 = defaultSkills.name;

    if(!row[fieldName3]){
      rowErrors.push(`${fieldName3} is missing from row ${index + 1}`);
    }

    //Default Skill Levels
    const defaultSkillLevels = fields[4];
    const fieldName4 = defaultSkillLevels.name;

    if(!row[fieldName4]){
      rowErrors.push(`${fieldName4} is missing from row ${index + 1}`);
    }

    //Extension
    const extension = fields[5];
    const fieldName5 = extension.name;

    if(!row[fieldName5]){
      rowErrors.push(`${fieldName5} is missing from row ${index + 1}`);
    }

    //DID User
    const didUser = fields[6];
    const fieldName6 = didUser.name;

    if(!row[fieldName6]){
      rowErrors.push(`${fieldName6} is missing from row ${index + 1}`);
    }

    //Direct Dial Number
    const directDialNumber = fields[7];
    const fieldName7 = directDialNumber.name;

    if(!row[fieldName7]){
      rowErrors.push(`${fieldName7} is missing from row ${index + 1}`);
    }

    //Zero Out Enabled
    const zeroOutEnabled = fields[8];
    const fieldName8 = zeroOutEnabled.name;

    if(!row[fieldName8]){
      rowErrors.push(`${fieldName8} is missing from row ${index + 1}`);
    }

    //Alternate/Outgoing Number
    const alternateOutgoingNumber = fields[9];
    const fieldName9 = alternateOutgoingNumber.name;

    if(!row[fieldName9]){
      rowErrors.push(`${fieldName9} is missing from row ${index + 1}`);
    }

    if(rowErrors.length > 0){
      console.error(`Errors thrown for row ${index + 1}`, rowErrors);
      validationErrors.push({
        template: "Triton User",
        row_number: index + 1,
        errors: rowErrors
      });
      return Promise.reject(rowErrors);
    } else {
      return Promise.resolve();
    }
  }));

  console.log("tritonPromises", tritonPromises);
  if(validationErrors.length > 0){
    const errors: any = [];
    validationErrors.forEach((row: any) => errors.push(row));
    console.error("Validation Errors found for Triton Validation", validationErrors);
    return Promise.reject(errors);
  } else {
    return Promise.resolve();
  }
};

const validateCalabrioFields = async (uploadedForm: any, state: any): Promise<any> => {
  console.log("what the heck");
  const fields: any = getCalabrioQmFields(state);
  const validationErrors: any = [];
  //Bug need to search for field not use array index

  console.log("validateCalabrioFields");
  const calabrioPromises = await Promise.allSettled(uploadedForm.map(async (row: any, index: number) => {
    console.log("validateFields", row);
    const rowErrors = [];

    //N Number
    const nNumber = fields[0];
    const fieldName0 = nNumber.name;
    if(!row[fieldName0]){
      rowErrors.push(`${fieldName0} is missing from row ${index + 1}`);
    }

    //Calabrio Group
    const profileId = fields[1];
    const fieldName1 = profileId.name;
    if(!row[fieldName1]){
      rowErrors.push(`${fieldName1} is missing from row ${index + 1}`);
    }

    //Calabrio Team
    const managerNNumber = fields[2];
    const fieldName2 = managerNNumber.name;

    if(!row[fieldName2]){
      rowErrors.push(`${fieldName2} is missing from row ${index + 1}`);
    }

    //Calabrio Roles
    const defaultSkills = fields[3];
    const fieldName3 = defaultSkills.name;

    if(!row[fieldName3]){
      rowErrors.push(`${fieldName3} is missing from row ${index + 1}`);
    }

    //Time Zones
    const defaultSkillLevels = fields[4];
    const fieldName4 = defaultSkillLevels.name;

    if(!row[fieldName4]){
      rowErrors.push(`${fieldName4} is missing from row ${index + 1}`);
    }

    //Alternate/Outgoing Number
    const alternateOutgoingNumber = fields[9];
    const fieldName9 = alternateOutgoingNumber.name;

    if(!row[fieldName9]){
      rowErrors.push(`${fieldName9} is missing from row ${index + 1}`);
    }

    if(rowErrors.length > 0){
      console.error(`Errors thrown for row ${index + 1}`, rowErrors);
      validationErrors.push({
        template: "Calabrio QM User",
        row_number: index + 1,
        errors: rowErrors
      });
      return Promise.reject(rowErrors);
    } else {
      return Promise.resolve();
    }
  }));

  console.log("calabrioPromises", calabrioPromises);
  if(validationErrors.length > 0){
    const errors: any = [];
    validationErrors.forEach((row: any) => errors.push(row));
    console.error("Validation Errors found for Calabrio Validation", validationErrors);
    return Promise.reject(errors);
  } else {
    return Promise.resolve();
  }
};

//Templates
export const getCreateTemplates: any = (state: any): any => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      validateFunction: (uploadedForm: any) => validateTritonFields(uploadedForm, state),
      processFunction: () => Promise.resolve(),
      multiRunDependencies: null,
      concurrencyLimit: 10,
      fields: getTritonFields(state)
    },
    CREATE_CALABRIO_QM_USER: {
      name: "CREATE_CALABRIO_QM_USER",
      processFunction: () => Promise.resolve(),
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER",
        variable: "workerSid"
      }],
      concurrencyLimit: null,
      fields: getCalabrioQmFields(state)
    }
  };
};