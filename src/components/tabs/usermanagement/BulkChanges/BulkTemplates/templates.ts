import {
  createUser,
  createCalabrioUser,
  updateUser
} from "services";
import {
  Template,
  Templates
} from "../BulkChanges.Interfaces";
import {
  cleanupField,
  checkConflictingCalabrioUsers
} from "../BulkUtils";
import {
  FIELDS,
  isDidUser
} from "../BulkTemplates";


const processCreateTritonUser = async (row: any, rowNumber: number, state: any) => {
  console.log("**** TRITON RECORD PROCESSING", row);
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

  try {
    const res = await createUser(body);
    const workerSid = res.workerSid;
    console.log("TRITON RESPONSE", res);
    row.workerSid = workerSid;
    row.acdId = workerSid;
    console.log(`${workerSid} created in Triton for ${row.attributes.n_number} for row ${rowNumber}`);
    return Promise.resolve(`${workerSid} created in Triton for ${row.attributes.n_number} for row ${rowNumber}`);
  } catch(err) {
    console.error(`Failed to create Triton user for row ${rowNumber}.`, err);
    return Promise.reject(`Failed to create Triton user for row ${rowNumber}.`);
  }
};

const processCreateCalabrioUser = async (row: any, rowNumber: number, state: any) => {
  console.log("****CALABRIO RECORD PROCESSING for", row);
  await checkConflictingCalabrioUsers(row, rowNumber, state.calabrioContext.users);
  const existingTritonWorker = state.workerContext.workers.find((w:any) => w.attributes?.n_number && w.attributes.n_number === row.n_number);
  const acdId = row.acdId || existingTritonWorker?.sid || undefined;
  const body: any = {};

  body.acdId = acdId;
  body.adLogin = `LM\\${row.attributes.n_number}`;
  body.email = row.attributes.email;
  body.firstName = row.attributes.firstName;
  body.lastName = row.attributes.lastName;
  body.groupId = row.groupId;
  body.timeZone = row.timeZone;
  body.roles = row.roles;
  body.scope = row.scope;

  try {
    await createCalabrioUser(body);
    console.log(`User created in Calabrio for ${row.attributes.n_number} for row ${rowNumber}`);
    return Promise.resolve(`User created in Calabrio for ${row.attributes.n_number} for row ${rowNumber}`);
  } catch(err) {
    console.error(`Failed to create Calabrio user for row ${rowNumber}.`, err);
    return Promise.reject(`Failed to create Calabrio user for row ${rowNumber}.`);
  }
};

const processUpdateWorkerAttribute = async (row: any, rowNumber: number, template: Template, state: any) => {
  const key = template.data.key;
  const value = template.data.value;
  const location = template.data.location;

  const newAttribute = { [key]: value };

  let body: any = {};

  if(key === "manager_n_number") {
    const managerObject = state.managerContext.managers.find((m:any) => m.manager_n_number && cleanupField(m.manager_n_number, "string") === value);
    if(!managerObject){
      return Promise.reject(`${value} is not a valid option for row ${rowNumber}`);
    } else {
      body[location] = {
        manager_first_name: managerObject.manager_first_name,
        manager_last_name: managerObject.manager_last_name,
        manager_n_number: managerObject.manager_n_number,
        manager: `${managerObject.manager_first_name} ${managerObject.manager_last_name}`
      };
    }
  } else if(key === "profile_id"){
    body[location] = {
      agent_attribute_1: value,
      profile_id: value
    };
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
    console.error(`Failed to update Triton Worker Attributes user for row ${rowNumber}.`, err);
    return Promise.reject(`Failed to update Triton Worker Attributes for row ${rowNumber}.`);
  }
};

//Templates
export const getCreateTemplates = (state: any): Templates => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      data: {},
      processFunction: (row: any, rowNumber: number) => processCreateTritonUser(row, rowNumber, state),
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
      processFunction: (row: any, rowNumber: number) => processCreateCalabrioUser(row, rowNumber, state),
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER",
        variable: "workerSid"
      }],
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 25,
      fields: [
        FIELDS.N_NUMBER_CREATE,
        FIELDS.CALABRIO_SCOPE,
        FIELDS.CALABRIO_TEAM,
        FIELDS.CALABRIO_ROLES,
        FIELDS.CALABRIO_TIME_ZONE
      ]
    }
  };
};

export const getUpdateTemplates = (state: any): Templates => {
  return {
    UPDATE_WORKER_ATTRIBUTE: {
      name: "UPDATE_WORKER_ATTRIBUTE",
      data: {},
      processFunction: (row: any, rowNumber: number, template: Template) => processUpdateWorkerAttribute(row, rowNumber, template, state),
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
      processFunction: (row: any, rowNumber: number, template: Template) => processUpdateWorkerAttribute(row, rowNumber, template, state),
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_UPDATE
      ]
    }
  };
};