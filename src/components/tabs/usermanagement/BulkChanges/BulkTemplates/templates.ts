import {
  createUser,
  createCalabrioTeam,
  createCalabrioUser,
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
  formatErrorMessage,
  toProperCase,
  updateCalabrioUserState,
  updateTritonUserState,
  updateManagerUserState
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

const processCreateManager = async (row: any, state: any) => {
  console.warn("****MANAGER RECORD PROCESSING for", row);
  const rowNumber = row.rowNumber;

  const managerNNumberFieldName = "Manager N Number";
  const managerNNumberField = cleanupField(row[managerNNumberFieldName], "string");

  // creating a new team
  const isNewTeam = row.newTeam;
  if (isNewTeam) {
    const teamFieldName = "Calabrio Team";
    const teamField = toProperCase(cleanupField(row[teamFieldName], "string"));

    try {
      // 1 - errors....
      const response: any = await createCalabrioTeam({
        name: teamField,
        parentGroupId: row.parentGroupId
      });

      // debugging
      console.log("1. response: ", response);
      const newTeamId = response.data.groupId;
      if (newTeamId) {
        row.groupId = newTeamId;
      } else {
        console.log("error - groupId missing after creating new team ", response);
      }

      // 2 - this doesnt have red squigglies...
      // createCalabrioTeam({
      //   name: teamField,
      //   parentGroupId: row.parentGroupId
      // }).then((res:any) => {
      //   const newTeamId = res.data.groupId;
      //   console.log("2. response: ", res);
      //   console.log("new team id: ", newTeamId);
      //   if (newTeamId) {
      //     row.groupId = newTeamId;
      //   }
      // });

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
  body.calabrio_team_ids = row.groupId;

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
      profile_id: parseInt(value),
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
    }
  };
};