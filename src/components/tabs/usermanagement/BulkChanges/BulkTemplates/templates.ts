import {
  createUser,
  createCalabrioTeam,
  createCalabrioUser,
  createCalabrioWFMPerson,
  getCalabrioUser,
  updateCalabrioUser,
  updateUser,
  addManager
} from "services";
import {
  Template,
  Templates
} from "../BulkChanges.Interfaces";
import {
  cleanupField,
  checkConflictingCalabrioUsers,
  checkIfConflictingWFMPeople,
  formatErrorMessage,
  handleWfmExternalLogon,
  toProperCase,
  updateCalabrioUserState,
  updateTritonUserState,
  updateWFMPersonState,
  updateManagerUserState
} from "../BulkUtils";
import {
  getTargetProfile
} from "utils";
import {
  FIELDS,
  isDidUser
} from "../BulkTemplates";
import {
  AppState,
  Worker
} from "globals";

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
      body.selfServiceInd = row.selfServiceInd;
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
    const hasPersonConflict = checkIfConflictingWFMPeople(row, state.calabrioContext.wfmOrg);
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

    // these are optional
    body.Identity = row.wfmIdentity;
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

    await createCalabrioWFMPerson(body);
    console.log(`Person created in Calabrio WFM for ${row.attributes.n_number} for row ${rowNumber}`);
    return Promise.resolve(`Person created in Calabrio WFM for ${row.attributes.n_number} for row ${rowNumber}`);
  } catch(err) {
    let errorMessage;
    if (err?.response?.data && err?.response?.data?.exception === "com.netflix.zuul.exception.ZuulException") {
      errorMessage = `A timeout occured while creating WFM Person ${row.attributes.emp_first_name} ${row.attributes.emp_last_name} for row ${rowNumber}. They may still have been successfully added to WFM. Please verify in WFM.`;
      console.error(errorMessage, err);
    } else {
      errorMessage = `Failed to create Calabrio WFM person for row ${rowNumber}. ${formatErrorMessage(err)}`;
      console.error(errorMessage, err);
    }
    return rejectPromise(errorMessage, rowNumber);
  }
};

const processCreateManager = async (row: any, state: any) => {
  console.warn("****MANAGER RECORD PROCESSING for", row);
  const rowNumber = row.rowNumber;

  const managerNNumberFieldName = "Manager N Number";
  const managerNNumberField = cleanupField(row[managerNNumberFieldName], "string");

  // create new team
  const isNewTeam = row.newTeam;
  if (isNewTeam) {
    const teamFieldName = "Calabrio Team";
    const teamField = toProperCase(cleanupField(row[teamFieldName], "string"));

    try {
      const response: any = await createCalabrioTeam({
        name: teamField,
        parentGroupId: row.parentGroupId
      });

      const newTeamId = response.data.groupId;
      row.groupId = newTeamId;

    } catch (err) {
      const errorMessage = `Failed to create Team for row ${rowNumber}. ${formatErrorMessage(err)}`;
      console.error(errorMessage, err);
      return rejectPromise(errorMessage, rowNumber);
    }
  }

  // add manager
  const body: any = {};

  body.manager_first_nme = row.attributes.manager_first_name;
  body.manager_last_nme = row.attributes.manager_last_name;
  body.manager_n_num = managerNNumberField;
  body.profile_id = row.attributes.profile_id;
  body.calabrio_team_ids = JSON.stringify([row.groupId]);

  try {
    await addManager(body);
    console.log(`Manager created for ${managerNNumberField} for row ${rowNumber}`);
    return Promise.resolve(`Manager created for ${managerNNumberField} for row ${rowNumber}`);
  } catch (err) {
    const errorMessage = `Failed to create Manager for row ${rowNumber}. ${formatErrorMessage(err)}`;
    console.error(errorMessage, err);
    return rejectPromise(errorMessage, rowNumber);
  }
};

const processUpdateWorkerAttribute = async (row: any, template: Template, state: AppState) => {
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
    if(typeof location === "string"){
      body[location] = newAttribute;
    } else {
      //Allowing for addition of routing object nested within attributes on update.  Will only allow for 2 items being added (attributes and a nested object)
      const parentObject: any = row[location[0]] || {}; //attributes
      const nestedObject: any = row[location[0]] && row[location[0]][location[1]] || {};
      try {
        body[location[0]] = {
          ...parentObject,
          [location[1]] : {
            ...nestedObject,
            ...newAttribute
          }
        }
      } catch(err){
        return rejectPromise(`Error thrown when location is array ${err.message}`, rowNumber);
      }
    }
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

const processUpdateDefaultSkills = async (row: any, template: Template, state: any) => {
  console.log("+++ processing update skills hurr");
  const rowNumber = row.rowNumber;
  const userNNumber = row.attributes.n_number;
  const workerSid = row.workerSid; // maybe unnecessary here, use this when calling updateUser

  const key = template.data.key;
  const value = template.data.value;
  const option = template.data.option;

  const body: any = {};

  body.attributes = { "default_skills": value };

  console.log("**** UPDATE DEFAULT SKILLS RECORD PROCESSING", row, body);
  console.log("**** ROW: ", row);
  console.log("**** updatedSkills:", value);
  console.log("**** option: ", option);
  try {
    await updateUser(row.workerSid, body);
    return Promise.resolve(`${row.workerSid} - Default Skills updated for row ${rowNumber}`);
  } catch(err){
    const errorMessage = `Failed to update Triton Worker Default Skills for row ${rowNumber}. ${formatErrorMessage(err)}`;
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
      stateUpdateFunctions: [updateTritonUserState, handleWfmExternalLogon],
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
        FIELDS.OUTGOING_NUMBER,
        FIELDS.SELF_SERVICE_IND,
        // FIELDS.ROUTING_TEAM //this is not ready to be introduced but we dont want to lose the code,
        FIELDS.WFM_ACTIVATE_EXTERNAL_LOGON
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
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 25,
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
      stateUpdateFunctions: [updateWFMPersonState],
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER",
        variable: "workerSid" // note: don't actually need the workersid, but Triton user and QM users need to be created BEFORE WFM
      }, {
        name: "CREATE_CALABRIO_QM_USER",
        variable: "groupId"
      }],
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 25,
      fields: [
        FIELDS.N_NUMBER_UPDATE,
        FIELDS.CALABRIO_WFM_IDENTITY,
        FIELDS.CALABRIO_WFM_BUSINESS_UNIT,
        FIELDS.CALABRIO_WFM_ROLES,
        FIELDS.CALABRIO_TIME_ZONE,
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
    },
    CREATE_MANAGER: {
      name: "CREATE_MANAGER",
      data: {},
      processFunction: (row: any) => processCreateManager(row, state),
      stateUpdateFunctions: [updateManagerUserState],
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 8,
      fields: [
        FIELDS.PROFILE_ID,
        FIELDS.MANAGER_N_NUMBER_CREATE,
        FIELDS.CALABRIO_TEAM_CREATE,
        FIELDS.CALABRIO_GROUP
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
    },
    UPDATE_DEFAULT_SKILLS: {
      name: "UPDATE_DEFAULT_SKILLS",
      data: {},
      processFunction: (row: any, template: Template) => processUpdateDefaultSkills(row, template, state),
      stateUpdateFunctions: [updateTritonUserState], // todo: decide which state function needs to be called here
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_UPDATE
      ]
    }
  };
};