import {
  createUser,
  createCalabrioUser,
  createCalabrioWFMPerson,
  getCalabrioUser,
  updateCalabrioUser,
  updateUser
} from "services";
import {
  Template,
  Templates
} from "../BulkChanges.Interfaces";
import {
  cleanupField,
  checkConflictingCalabrioUsers,
  checkConflictingWFMPeople,
  formatErrorMessage,
  updateCalabrioUserState,
  updateTritonUserState,
  updateWFMPersonState
} from "../BulkUtils";
import {
  getTargetProfile
} from "utils";
import {
  FIELDS,
  isDidUser
} from "../BulkTemplates";

const rejectPromise = (error: string, rowNumber: number) => {
  return Promise.reject(JSON.stringify({
    rowNumber: rowNumber,
    error
  }));
};

const processCreateTritonUser = async (row: any, state: any) => {
  console.log("**** TRITON RECORD PROCESSING", row);
  const rowNumber = row.rowNumber;
  try {
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

    const profile = getTargetProfile(state.profileContext.profiles, body.attributes.profile_id);
    body.operatingUnitSid = profile?.operating_unit_sid;

    const res = await createUser(body);
    const workerSid = res.workerSid;
    console.log("TRITON RESPONSE", res);
    row.workerSid = workerSid;
    row.acdId = workerSid;
    console.log(`${workerSid} created in Triton for ${row.attributes.n_number} for row ${rowNumber}`);
    return Promise.resolve(`${workerSid} created in Triton for ${row.attributes.n_number} for row ${rowNumber}`);
  } catch(err) {
    const errorMessage = `Failed to create Triton user for row ${rowNumber}. ${formatErrorMessage(err)}`;
    console.error(errorMessage, err);
    return rejectPromise(errorMessage, rowNumber);
  }
};

const processCreateCalabrioUser = async (row: any, state: any) => {
  console.warn("****CALABRIO RECORD PROCESSING for", row);
  const rowNumber = row.rowNumber;
  await checkConflictingCalabrioUsers(row, rowNumber, state.calabrioContext.users);
  const existingTritonWorker = state.workerContext.workers.find((w:any) => w.attributes?.n_number && w.attributes.n_number === row.attributes.n_number);
  const acdId = row.acdId || existingTritonWorker?.sid || undefined;
  if(!acdId){
    return rejectPromise(`Failed to create Calabrio user for row ${rowNumber}. Missing ACD Id, validate this user already exists in Triton`, rowNumber);
  }
  const body: any = {};

  body.acdId = acdId;
  body.adLogin = `LM\\${row.attributes.n_number}`;
  body.email = row.attributes.email;
  body.firstName = row.attributes.emp_first_name;
  body.lastName = row.attributes.emp_last_name;
  body.groupId = row.groupId;
  body.timeZone = row.timeZone;
  body.roles = row.roles;
  body.scope = row.scope;

  try {
    await createCalabrioUser(body);
    console.log(`User created in Calabrio for ${row.attributes.n_number} for row ${rowNumber}`);
    return Promise.resolve(`User created in Calabrio for ${row.attributes.n_number} for row ${rowNumber}`);
  } catch(err) {
    const errorMessage = `Failed to create Calabrio user for row ${rowNumber}. ${formatErrorMessage(err)}`;
    console.error(errorMessage, err);
    return rejectPromise(errorMessage, rowNumber);
  }
};

const processWFMCreateUser = async (row: any, state: any) => {
  console.warn("****WFM RECORD PROCESSING for", row);
  const rowNumber = row.rowNumber;

  try {
  // TODO: FIX this check
    const hasPersonConflict = checkConflictingWFMPeople(row, rowNumber, state.calabrioContext.wfmOrg);
    console.log("RESULTS OF hasPersonConflict!!!!", hasPersonConflict);
    if (hasPersonConflict) {
      throw (`Calabrio WFM Record already exists with either this user's email or nNumber for row ${rowNumber}`);
    }

    const body: any = {};

    // required fields
    body.FirstName = row.attributes.emp_first_name;
    body.LastName = row.attributes.emp_last_name;
    body.BusinessUnitId = row.businessUnitId;
    body.Email = row.attributes.email;
    body.TimeZoneId = row.timeZone;
    body.ApplicationLogon = row.attributes.email;
    body.NNumber = row.attributes.n_number;
    body.FirstDayOfWeek = row.wfmFirstDayOfWeek;

    // schedule related parameters...  not required technically, but either all need to be null, or all need to be a value
    body.PersonStartDate = row.wfmPersonStartDate;
    body.TeamId = row.wfmTeamId;
    body.TeamStartDate = row.wfmTeamStartDate;
    body.ContractId = row.wfmContractId;
    body.ContractScheduleId = row.wfmContractScheduleId;
    body.PartTimePercentageId = row.wfmPartTimePercentageId;
    // optional sheduling items
    body.BudgetGroupId = row.wfmBudgetGroupId;
    body.ShiftBagId = row.wfmShiftBagId;

    // I think these are all optional as per Shannon?
    body.AvailabilityId = row.wfmAvailabilityId;
    body.AvailabilityStartDate = row.wfmAvailabilityStartDate;
    body.RoleIds = row.wfmRoleIds;
    body.WorkflowControlSetId = row.wfmWorkflowControlSetId;
    body.Skills = row.wfmSkillIds;
    body.SkillsStartDate = row.wfmSkillsStartDate;
    body.RotationId = row.wfmRotationId;
    body.RotationStartDate = row.wfmRotationStartDate;
    body.RotationStartWeek = row.wfmRotationStartWk;

    // completely optional
    body.OptionalColumns = row.wfmOptionalColumns;
    // body.Culture = row.wfmCulture;


    console.log("THIS IS WHAT IS GETTING SENT for WFM CREATE", body);

    // TODO: COMMENT THIS BACK IN
    // await createCalabrioWFMPerson(body);
    console.log(`Person created in Calabrio WFM for ${row.attributes.n_number} for row ${rowNumber}`);
    return Promise.resolve(`Person created in Calabrio for ${row.attributes.n_number} for row ${rowNumber}`);
  } catch(err) {
    const errorMessage = `Failed to create Calabrio WFM person for row ${rowNumber}. ${formatErrorMessage(err)}`;
    console.error(errorMessage, err);
    return rejectPromise(errorMessage, rowNumber);
  }
};

const processUpdateWorkerAttribute = async (row: any, template: Template, state: any) => {
  const rowNumber = row.rowNumber;
  const key = template.data.key;
  const value = template.data.value;
  const location = template.data.location;

  const newAttribute = { [key]: value };

  let body: any = {};

  if(key === "profile_id"){
    body[location] = {
      agent_attribute_1: parseInt(value),
      profile_id: parseInt(value)
    };
    const profile = getTargetProfile(state.profileContext.profiles, value);
    body.operatingUnitSid = profile?.operating_unit_sid;
  } else if(location){
    body[location] = newAttribute;
  } else {
    body = newAttribute;
  }

  console.log("**** UPDATE WORKER ATTRIBUTE RECORD PROCESSING", row, body, value);
  try {
    await updateUser(row.workerSid, body);
    return Promise.resolve(`${row.workerSid} - Worker Attributes updated for row ${rowNumber}`);
  } catch(err){
    const errorMessage = `Failed to update Triton Worker Attributes for row ${rowNumber}. ${formatErrorMessage(err)}`;
    console.error(errorMessage, err);
    return rejectPromise(errorMessage, rowNumber);
  }
};

const processUpdateManager = async (row: any, template: Template, state: any) => {
  const rowNumber = row.rowNumber;
  try {
    const userNNumber = row.attributes.n_number;
    const managerNNumber = template.data.nNumber;
    const calabrioTeamId = template.data.calabrioTeamId;

    const tritonBody: any = {};
    let calabrioBody: any = {};
    let calabrioFunction: any = () => Promise.resolve("Bypassing Calabrio Team Change, not selected");

    const managerObject = state.managerContext.managers.find((m:any) => m.manager_n_number && cleanupField(m.manager_n_number, "string") === managerNNumber);
    if(!managerObject){
      return rejectPromise(`${managerNNumber} is not a valid manager nNumber for row ${rowNumber}`, rowNumber);
    } else {
      tritonBody.attributes = {
        manager_first_name: managerObject.manager_first_name,
        manager_last_name: managerObject.manager_last_name,
        manager_n_number: managerObject.manager_n_number,
        manager: `${managerObject.manager_first_name} ${managerObject.manager_last_name}`
      };
    }

    const userTritonRecord = state.workerContext.workers.find((w: any) => w.attributes?.n_number && w.attributes?.n_number === userNNumber);
    const userCalabrioRecord = state.calabrioContext.users.find((u: any) => cleanupField(u?.acdId, "string") === cleanupField(userTritonRecord?.sid, "string") || cleanupField(u?.email, "string") === cleanupField(userTritonRecord?.attributes?.email, "string"));
    if(userCalabrioRecord){
      let fetchedCalabrioUser;
      try {
        const res = await getCalabrioUser(userCalabrioRecord.id);
        fetchedCalabrioUser = res.data;
      } catch(err){
        const errorMessage = `No updates made, Failed to fetch calabrio user for row ${rowNumber}. ${formatErrorMessage(err)}`;
        console.error(errorMessage, err);
        return rejectPromise(errorMessage, rowNumber);
      }
      calabrioBody = {
        ...fetchedCalabrioUser,
        groupId: calabrioTeamId
      };
      calabrioFunction = updateCalabrioUser;
    } else {
      calabrioFunction = () => Promise.reject("No Calabrio record found.");
    }


    const results = await Promise.allSettled([
      updateUser(row.workerSid, tritonBody),
      calabrioFunction(calabrioBody.id, calabrioBody)
    ]);

    const errors: string[] = [];
    results.forEach((p: any) => p.status === "rejected" && errors.push(p.reason));
    if(errors.length > 0){
      return rejectPromise(`Errors thrown for row ${rowNumber}. ${errors.toString()}`, rowNumber);
    }
    return Promise.resolve(`${userNNumber} - Manager & Calabrio Team updated for row ${rowNumber}`);
  } catch(err){
    const errorMessage = `Failed to update Manager and Calabrio Team for user for row ${rowNumber}. ${formatErrorMessage(err)}`;
    console.error(errorMessage, err);
    return rejectPromise(errorMessage, rowNumber);
  }
};

//Templates
export const getCreateTemplates = (state: any): Templates => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      data: {},
      processFunction: (row: any) => processCreateTritonUser(row, state),
      stateUpdateFunctions: [updateTritonUserState],
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_CREATE,
        FIELDS.PROFILE_ID,
        FIELDS.MANAGER_N_NUMBER,
        FIELDS.DEFAULT_SKILLS,
        FIELDS.EXTENSION,
        FIELDS.DID_USER,
        FIELDS.DIRECT_DIAL_NUMBER,
        FIELDS.ZERO_OUT_ENABLED,
        FIELDS.OUTGOING_NUMBER
      ]
    },
    CREATE_CALABRIO_QM_USER: {
      name: "CREATE_CALABRIO_QM_USER",
      data: {},
      processFunction: (row: any) => processCreateCalabrioUser(row, state),
      stateUpdateFunctions: [updateCalabrioUserState],
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER",
        variable: "workerSid"
      }],
      validationConcurrencyLimit: 500,  // todo ? what will these be
      processingConcurrencyLimit: 25,  // todo ? what will this be?
      fields: [
        FIELDS.N_NUMBER_UPDATE,
        FIELDS.CALABRIO_SCOPE,
        FIELDS.CALABRIO_TEAM,
        FIELDS.CALABRIO_ROLES,
        FIELDS.CALABRIO_TIME_ZONE
      ]
    },
    CREATE_CALABRIO_WFM_PERSON: {
      name: "CREATE_CALABRIO_WFM_PERSON",
      data: {},
      processFunction: (row: any) => processWFMCreateUser(row, state),
      stateUpdateFunctions: [updateWFMPersonState], // TODO: DO THIS THING
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER",
        variable: "workerSid" // note: don't actually need the workersid, but I need the Triton user created first if running for 
      }],
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 25,
      fields: [
        FIELDS.N_NUMBER_UPDATE,
        FIELDS.CALABRIO_WFM_BUSINESS_UNIT,
        FIELDS.CALABRIO_WFM_ROLES,
        FIELDS.CALABRIO_TIME_ZONE,  // think we can use the same one qm uses?  Maybe Check with stephanie to see if there are any different ones..
        FIELDS.CALABRIO_WFM_FIRST_DAY_OF_WEEK,
        FIELDS.CALABRIO_WFM_WORKFLOW_CONTROL_SET,
        FIELDS.CALABRIO_WFM_TEAM,
        FIELDS.CALABRIO_WFM_CONTRACT,
        FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE,
        FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE,
        FIELDS.CALABRIO_WFM_SHIFTBAG,
        FIELDS.CALABRIO_WFM_BUDGET_GROUP,
        FIELDS.CALABRIO_WFM_PERSON_START_DATE,
        FIELDS.CALABRIO_WFM_TEAM_START_DATE,
        FIELDS.CALABRIO_WFM_SKILLS_START_DATE,
        FIELDS.CALABRIO_WFM_SKILLS,
        FIELDS.CALABRIO_WFM_ROTATION_START_DATE,
        FIELDS.CALABRIO_WFM_ROTATION,
        FIELDS.CALABRIO_WFM_ROTATION_START_WEEK,
        FIELDS.CALABRIO_WFM_AVAILABILITY_START_DATE,
        FIELDS.CALABRIO_WFM_AVAILABILITY,
        FIELDS.CALABRIO_WFM_OPTIONAL_COLUMNS
      ]
    }
  };
};

export const getUpdateTemplates = (state: any): Templates => {
  return {
    UPDATE_WORKER_ATTRIBUTE: {
      name: "UPDATE_WORKER_ATTRIBUTE",
      data: {},
      processFunction: (row: any, template: Template) => processUpdateWorkerAttribute(row, template, state),
      stateUpdateFunctions: [updateTritonUserState],
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_UPDATE
      ]
    },
    UPDATE_USERS_MANAGER: {
      name: "UPDATE_USERS_MANAGER",
      data: {},
      processFunction: (row: any, template: Template) => processUpdateManager(row, template, state),
      stateUpdateFunctions: [updateTritonUserState, updateCalabrioUserState],
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_UPDATE
      ]
    }
  };
};