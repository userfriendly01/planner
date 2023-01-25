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
    options: null
  },
  {
    field: "profileId",
    name: "Profile Id",
    type: "number",
    description: "Profile Id",
    required: "Y",
    example: 3,
    options: state.profileContext.profiles.map((p: any) => p.profile_id)
  },
  {
    field: "managerNNumber",
    name: "Manager N Number",
    type: "string",
    description: "N Number of the Manager",
    required: "Y",
    example: "n0088625",
    options: state.managerContext.managers.map((m: any) => m.manager_n_number)
  },
  {
    field: "defaultSkills",
    name: "Default Skills",
    type: "string",
    description: "Comma delimited list of skills assigned as the Defauls Skill profile for the user. If left blank, no skills will be assigned",
    required: "N",
    example: "bscCommissions, aisgl1, blSalesL1",
    options: state.skillContext.skills.map((s: any) => s.name)
  },
  {
    field: "defaultSkillLevels",
    name: "Default Skill Levels",
    type: "string",
    description: "Comma delimited list of skill/level pairings. Skills should have a colon before the level. If left blank, skills with levels will default to 1",
    required: "N",
    example: "bscCommissions: 3, blSalesL1: 2",
    options: null
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
    options: null
  },
  {
    field: "calabrioGroup",
    name: "Calabrio Group",
    type: "string",
    description: "Parent Group (Must already be created in Calabrio)",
    required: "Y",
    example: "Default Group",
    options: state.calabrioContext.groups.map((g: any) => g.name)
  },
  {
    field: "calabrioTeam",
    name: "Calabrio Team",
    type: "string",
    description: "Team (Must already be created in Calabrio)",
    required: "Y",
    example: "Default Team",
    options: state.calabrioContext.teams.map((t: any) => t.name)
  },
  {
    field: "roles",
    name: "Calabrio Role",
    type: "string",
    description: "Must be an approved role to add by management and already exist in Calabrio",
    required: "Y",
    example: "QM Agent",
    options: calabrioAllowedRoles
  },
  {
    field: "timeZone",
    name: "Time Zone",
    type: "string",
    description: "Time Zone of the Calabrio User",
    required: "Y",
    example: "America/New_York",
    options: calabrioTimeZones.map((t: any) => t.label)
  }
];

//Validation Steps
const validateTritonFields = async (uploadedForm: any, state: any): Promise<any> => {
  const fields = getTritonFields(state);
  const validationErrors = [];

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
    console.error("Validation Errors found for Triton Validation", rowErrors);
    Promise.reject(validationErrors);
  } else {
    Promise.resolve;
  }
  return tritonPromises;
};


//Templates
export const getCreateTemplates: any = (state: any): any => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      validateFunction: (uploadedForm: any) => validateTritonFields(uploadedForm, state),
      fields: getTritonFields(state)
    },
    CREATE_CALABRIO_QM_USER: {
      name: "CREATE_CALABRIO_QM_USER",
      validateFunction: () => Promise.resolve(),
      fields: getCalabrioQmFields(state)
    }
  };
};