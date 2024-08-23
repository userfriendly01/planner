import {
  createCalabrioTeam,
  createCalabrioUser,
  createCalabrioWFMPerson,
  getCalabrioUser,
  updateCalabrioUser
} from "services/calabrio";
import {
  createUser,
  updateUser
} from "services/user";
import { addManager } from "services/manager";
import {
  Template,
  Templates
} from "usermanagement/BulkChanges.Interfaces";
import {
  cleanupField,
  formatErrorMessage,
  toProperCase
} from "utils/_formatUtils";
import {
  handleWfmExternalLogon,
  updateCalabrioUserState,
  updateWFMPersonState,
  updateManagerUserState
} from "usermanagement/processingUtils";
import {
  checkConflictingCalabrioUsers,
  checkIfConflictingWFMPeople
} from "usermanagement/validationUtils";
import { getTargetProfile } from "utils/usermanagementUtils";
import { logger } from "utils/logger";
import {
  FIELDS,
  isDidUser
} from "usermanagement/fields";
import {
  AppState, UMManager
} from "globals/interfaces";
import { env } from "globals";
import { SkillState } from "components/tabs/callflowmanagement/SkillManagement/Skills.Interfaces";

const rejectPromise = (error: string, rowNumber: number) => {
  return Promise.reject(JSON.stringify({
    rowNumber: rowNumber,
    error
  }));
};

const processCreateTritonUser = async (row: any, state: AppState) => {
  logger.log("**** TRITON RECORD PROCESSING", row);

  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;

  try {
    const didFieldName = "Did User";
    const didField = cleanupField(row[didFieldName], "string");
    const didUser = isDidUser(didField, rowNumber);
    const body: any = {};
    if (didUser) {
      body.attributes = row.attributes;
      body.did = row.did;
      body.zeroOutEnabled = row.zeroOutEnabled;
      body.selfServiceInd = row.selfServiceInd;
    } else {
      body.attributes = row.attributes;
    }

    const profile = getTargetProfile(state.profileContext.profiles, body.attributes.profile_id);
    body.operatingUnitSid = profile?.ou_sid;

    const res = await createUser(body);
    const workerSid = res.sid;

    logger.log("TRITON RESPONSE FROM CREATE USER", res);

    row.workerSid = workerSid;
    row.acdId = workerSid;

    const message = `${workerSid} created in Triton for ${row.attributes.n_number} for row ${rowNumber}`;

    logger.info(message, {
      nNumber,
      userNNumber: row.attributes.n_number
    });

    return Promise.resolve(message);
  } catch (error) {
    const errorMessage = `Failed to create Triton user for row ${rowNumber}. ${formatErrorMessage(error)}`;

    logger.error(errorMessage, {
      error,
      nNumber,
      row
    });

    return rejectPromise(errorMessage, rowNumber);
  }
};

const processCreateCalabrioUser = async (row: any, state: AppState) => {
  logger.log("****CALABRIO RECORD PROCESSING for", row);

  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;

  try {
    await checkConflictingCalabrioUsers(row, rowNumber, state.calabrioContext.users);
    const existingTritonWorker = state.workerContext.workers.find((w: any) => w.attributes?.n_number && w.attributes.n_number === row.attributes.n_number);
    const acdId = row.acdId || existingTritonWorker?.sid || undefined;
    if (!acdId) {
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

    await createCalabrioUser(state.userContext.tokens.calabrioService, body);

    const message = `User created in Calabrio for ${row.attributes.n_number} for row ${rowNumber}`;

    logger.info(message, {
      nNumber,
      userNNumber: row.attributes.n_number
    });

    return Promise.resolve(message);
  } catch (error) {
    const errorMessage = `Failed to create Calabrio user for row ${rowNumber}. ${formatErrorMessage(error)}`;

    logger.error(errorMessage, {
      error,
      nNumber,
      row
    });

    return rejectPromise(errorMessage, rowNumber);
  }
};

const processWFMCreateUser = async (row: any, state: AppState) => {
  logger.info("****WFM RECORD PROCESSING for", row);

  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;

  try {
    const hasPersonConflict = checkIfConflictingWFMPeople(row, state);
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
    body.Note = row.wfmNote;

    // completely optional
    body.OptionalColumns = row.wfmOptionalColumns;
    if (env.APP_ENV === "production") {
      const result = await createCalabrioWFMPerson(state.userContext.tokens.calabrioService, body);
      row.Id = result?.data?.PersonId;

      const message = `Person created in Calabrio WFM for ${row.attributes.n_number} for row ${rowNumber}`;

      logger.info(message, {
        nNumber,
        userNNumber: row.attributes.n_number
      });

      return Promise.resolve(message);
    } else {
      const message = `No NP environment for WFM. WFM user not created for ${row.attributes.n_number} for row ${rowNumber}`;

      logger.log(message, {
        nNumber,
        body
      });

      return Promise.resolve(message);
    }
  } catch (error) {
    let errorMessage;
    if (error?.response?.data && error?.response?.data?.exception === "com.netflix.zuul.exception.ZuulException") {
      errorMessage = `A timeout occured while creating WFM Person ${row.attributes.emp_first_name} ${row.attributes.emp_last_name} for row ${rowNumber}. They may still have been successfully added to WFM. Please verify in WFM.`;
    } else {
      errorMessage = `Failed to create Calabrio WFM person for row ${rowNumber}. ${formatErrorMessage(error)}`;
    }

    logger.error(errorMessage, {
      error,
      nNumber,
      row
    });

    return rejectPromise(errorMessage, rowNumber);
  }
};

const processCreateManager = async (row: any, state: AppState) => {
  logger.log("****MANAGER RECORD PROCESSING for", row);
  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;

  try {
    const managerNNumberFieldName = "Manager N Number";
    const managerNNumberField = cleanupField(row[managerNNumberFieldName], "string");

    // create new team
    const isNewTeam = row.newTeam;
    if (isNewTeam) {
      const teamFieldName = "Calabrio Team";
      const teamField = toProperCase(cleanupField(row[teamFieldName], "string"));

      try {
        const response: any = await createCalabrioTeam(state.userContext.tokens.calabrioService, {
          name: teamField,
          parentGroupId: row.parentGroupId
        });

        const newTeamId = response.data.groupId;
        row.groupId = newTeamId;

        logger.info("Successfully added Calabrio Team", {
          nNumber
        });
      } catch (error) {
        const errorMessage = `Failed to create Team for row ${rowNumber}. ${formatErrorMessage(error)}`;

        logger.error(errorMessage, {
          error,
          nNumber,
          row
        });

        return rejectPromise(errorMessage, rowNumber);
      }
    }

    // add manager
    const body: any = {};

    body.manager_first_name = row.attributes.manager_first_name;
    body.manager_last_name = row.attributes.manager_last_name;
    body.manager_n_num = managerNNumberField;
    body.profile_id = row.attributes.profile_id;
    body.calabrio_team_ids = [row.groupId];

    await addManager(body);

    const message = `Manager created for ${managerNNumberField} for row ${rowNumber}`;

    logger.info(message, {
      nNumber,
      managerNNumber: managerNNumberField
    });

    return Promise.resolve(message);
  } catch (error) {
    const errorMessage = `Failed to create Manager for row ${rowNumber}. ${formatErrorMessage(error)}`;

    logger.error(errorMessage, {
      error,
      nNumber,
      row
    });

    return rejectPromise(errorMessage, rowNumber);
  }
};

const processUpdateWorkerAttribute = async (row: any, template: Template, state: AppState) => {
  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;

  try {
    const key = template.data.key;
    const value = template.data.value;
    const location = template.data.location;
    const newAttribute = { [key]: value };
    let body: any = {};

    if (key === "profile_id") {
      body[location] = {
        agent_attribute_1: parseInt(value),
        profile_id: parseInt(value)
      };
      const profile = getTargetProfile(state.profileContext.profiles, value);
      body.operatingUnitSid = profile?.ou_sid;
    } else if (location) {
      if (typeof location === "string") {
        body[location] = newAttribute;
      } else {
        if (key === "sales_assoc_workers") {
          const salesAssocWorkersArray = value.split(",");
          newAttribute[key] = salesAssocWorkersArray.map((nNum: string) => nNum.trim());
        }

        //Allowing for addition of routing object nested within attributes on update.  Will only allow for 2 items being added (attributes and a nested object)
        const parentObject: any = row[location[0]] || {}; //attributes
        const nestedObject: any = row[location[0]] && row[location[0]][location[1]] || {};
        try {
          body[location[0]] = {
            ...parentObject,
            [location[1]]: {
              ...nestedObject,
              ...newAttribute
            }
          };
        } catch (err) {
          return rejectPromise(`Error thrown when location is array ${err.message}`, rowNumber);
        }
      }
    } else {
      body = newAttribute;
    }

    logger.log("**** UPDATE WORKER ATTRIBUTE RECORD PROCESSING", {
      row,
      body,
      value
    });

    await updateUser(row.workerSid, body);

    const message = `${row.workerSid} - Worker Attributes updated for row ${rowNumber}`;

    logger.info(message, {
      nNumber,
      workerSid: row.workerSid
    });

    return Promise.resolve(message);
  } catch (error) {
    const errorMessage = `Failed to update Triton Worker Attributes for row ${rowNumber}. ${formatErrorMessage(error)}`;

    logger.error(errorMessage, {
      error,
      nNumber,
      row
    });

    return rejectPromise(errorMessage, rowNumber);
  }
};

const processUpdateManager = async (row: any, template: Template, state: AppState) => {
  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;

  try {
    const userNNumber = row.attributes.n_number;
    const managerNNumber = template.data.nNumber;
    const calabrioTeamId = template.data.calabrioTeamId;

    const tritonBody: any = {};
    let calabrioBody: any = {};
    let calabrioFunction: any = () => Promise.resolve("Bypassing Calabrio Team Change, not selected");

    const managerObject = state.managerContext.managers.find((m: UMManager) => m.manager_n_num && cleanupField(m.manager_n_num, "string") === managerNNumber);
    if (!managerObject) {
      return rejectPromise(`${managerNNumber} is not a valid manager nNumber for row ${rowNumber}`, rowNumber);
    } else {
      tritonBody.attributes = {
        manager_first_name: managerObject.manager_first_name,
        manager_last_name: managerObject.manager_last_name,
        manager_n_number: managerObject.manager_n_num,
        manager: `${managerObject.manager_first_name} ${managerObject.manager_last_name}`
      };
    }

    const userTritonRecord = state.workerContext.workers.find((w: any) => w.attributes?.n_number && w.attributes?.n_number === userNNumber);
    const userCalabrioRecord = state.calabrioContext.users.find((u: any) => cleanupField(u?.acdId, "string") === cleanupField(userTritonRecord?.sid, "string") || cleanupField(u?.email, "string") === cleanupField(userTritonRecord?.attributes?.email, "string"));
    if (userCalabrioRecord) {
      let fetchedCalabrioUser;
      try {
        const res = await getCalabrioUser(state.userContext.tokens.calabrioService, userCalabrioRecord.id);
        fetchedCalabrioUser = res.data;
      } catch (error) {
        const errorMessage = `No updates made, Failed to fetch calabrio user for row ${rowNumber}. ${formatErrorMessage(error)}`;

        logger.error(
          errorMessage,
          {
            error,
            row
          },
          false
        );

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
      calabrioFunction(state.userContext.tokens.calabrioService, calabrioBody)
    ]);

    const errors: string[] = [];
    results.forEach((p: any) => p.status === "rejected" && errors.push(p.reason));
    if (errors.length > 0) {
      return rejectPromise(`Errors thrown for row ${rowNumber}. ${errors.toString()}`, rowNumber);
    }

    const message = `${userNNumber} - Manager & Calabrio Team updated for row ${rowNumber}`;

    logger.info(message, {
      nNumber,
      userNNumber
    });

    return Promise.resolve(message);
  } catch (error) {
    const errorMessage = `Failed to update Manager and Calabrio Team for user for row ${rowNumber}. ${formatErrorMessage(error)}`;

    logger.error(errorMessage, {
      nNumber,
      error,
      row
    });

    return rejectPromise(errorMessage, rowNumber);
  }
};

const processUpdateDefaultSkills = async (row: any, template: Template, state: AppState) => {
  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;

  try {
    const workerSid = row.workerSid;
    const value = template.data.value;
    const option = template.data.option;
    const body: any = {};
    let updatedDefaultSkills: any = {};


    if (option.value === "OVERRIDE") {
      updatedDefaultSkills = value;
    } else if (option.value === "ADD") {
      const currentSkillLevels = row.attributes?.default_skills?.levels || {};
      const currentSkills = row.attributes?.default_skills?.skills || [];

      const newSkills = value.skills?.filter((s: any) => !currentSkills.includes(s));
      let newSkillLevels: any = {
        ...currentSkillLevels
      };

      if (value.levels) {
        newSkillLevels = {
          ...newSkillLevels,
          ...value.levels
        };
      }

      updatedDefaultSkills = {
        levels: newSkillLevels,
        skills: [...currentSkills, ...newSkills]
      };
    } else if (option.value === "DELETE") {
      const skillsToDelete = value;
      const currentSkills = row.attributes?.default_skills || {};

      console.log("JULIA - VALUE", value); //todo: cleanup
      console.log("JULIA - SKILLS TO DELETE: ", skillsToDelete.skills);
      console.log("JULIA - CURRENT SKILLS: ", currentSkills);

      updatedDefaultSkills.skills = currentSkills.skills?.filter((s: any) => !skillsToDelete.skills.includes(s));
      updatedDefaultSkills.levels = currentSkills.levels;

      if (currentSkills.levels) {
        for (const skillLevel in updatedDefaultSkills.levels) {
          console.log("JULIA - SKILLLEVEL", skillLevel);
          console.log("JULIA - VALUE?? ", updatedDefaultSkills.levels[skillLevel]);
          if (skillsToDelete.levels[skillLevel]){
            if (updatedDefaultSkills.levels[skillLevel] === skillsToDelete.levels[skillLevel]) {
              delete updatedDefaultSkills.levels[skillLevel];
              console.log("JULIA - ", skillLevel, " matches level, set to null");
            } else {
              console.log("JULIA - ", skillLevel, " did not match, adding back to skills array");
              updatedDefaultSkills.skills.push(skillLevel);
            }
          } else {
            console.log("JULIA - SKILL DOES NOT EXISTS IN LEVELS");
          }
        }
      }
    }
    console.log("JULIA - UPDATED DEFAULT SKILLZ: ", updatedDefaultSkills);

    body.attributes = { "default_skills": updatedDefaultSkills };

    logger.log("**** UPDATE DEFAULT SKILLS RECORD PROCESSING", {
      row,
      body
    });

    await updateUser(workerSid, body);

    const message = `${workerSid} - Default Skills updated for row ${rowNumber}`;

    logger.info(message, {
      nNumber,
      workerSid
    });

    return Promise.resolve(message);
  } catch (error) {
    const errorMessage = `Failed to update Default Skills for row ${rowNumber}. ${formatErrorMessage(error)}`;

    logger.error(errorMessage, {
      error,
      nNumber,
      row
    });

    return rejectPromise(errorMessage, rowNumber);
  }
};

const processUpdateCallerStates = async (row: any, template: Template, state: AppState) => {
  const rowNumber = row.rowNumber;
  const { nNumber } = state.userContext;
  const workerSid = row.workerSid;

  try {
    const existingRouting = row.attributes.routing;
    const selectedCallerStates: [] = template.data.value;
    const option = template.data.option;

    const currentCallerStates = row.attributes.routing?.caller_states || [];
    let combinedCallerStates;

    if (option.value === "ADD") {
      const newCallerStates = selectedCallerStates.map((item: any) => item.value);
      combinedCallerStates = [...currentCallerStates, ...newCallerStates].sort();
    } else if (option.value === "DELETE") {
      const deleteTheseStates = selectedCallerStates.map((item: any) => item.value);
      combinedCallerStates = currentCallerStates.filter((state: any) => !deleteTheseStates.includes(state));
    } else if (option.value === "OVERRIDE") {
      combinedCallerStates = selectedCallerStates.map((item: any) => item.value);
    }
    const finalCallerStates = [...new Set(combinedCallerStates)]; // Remove duplicate elements

    const body = {
      attributes: {
        routing: {
          ...existingRouting,
          caller_states: finalCallerStates.sort() // It's only polite to keep them in order
        }
      }
    };

    await updateUser(workerSid, body);

    logger.info("Caller States updated", {
      workerSid,
      nNumber
    });

    return Promise.resolve(`${workerSid} - Caller States updated for row ${rowNumber}`);
  } catch (error) {
    const errorMessage = `Failed to update Caller States for row ${rowNumber}. ${formatErrorMessage(error)}`;
    logger.error(errorMessage, {
      error,
      nNumber,
      workerSid
    });
    return rejectPromise(errorMessage, rowNumber);
  }
};

const processSyncHrAttributes = async (row: any, template: Template, state: AppState) => {
  logger.log("*** Syncing HR Attributes for ***", row);
  const rowNumber = row.rowNumber;
  const nNumber = row["N Number"];
  try {
    let syncNeeded = false;
    const originalAttributes = row.originalWorker.attributes || {};
    const hrAttributes = row.attributes || {};

    const doesFieldMatch = (field: string) => {
      if (cleanupField(originalAttributes[field], "string") !== cleanupField(hrAttributes[field], "string")) {
        syncNeeded = true;
      }
    };

    doesFieldMatch("department_id");
    doesFieldMatch("department_name");
    doesFieldMatch("primary_dept_name");
    doesFieldMatch("primary_dept_number");
    doesFieldMatch("location");
    doesFieldMatch("office_location_name");
    doesFieldMatch("office_location_number");
    doesFieldMatch("email");
    doesFieldMatch("email_address");
    doesFieldMatch("emp_first_name");
    doesFieldMatch("emp_last_name");
    doesFieldMatch("full_name");

    delete row.originalWorker;
    let message = "";
    if (syncNeeded) {
      await updateUser(row.workerSid, { attributes: hrAttributes });
      message = `Successfully synced worker for row ${rowNumber}. ${row.workerSid} : ${nNumber}.`;
    } else {
      message = `Sync not required for row ${rowNumber}. ${row.workerSid} : ${nNumber}.`;
    }
    row.result = message;
    return Promise.resolve(message);
  } catch (error) {
    const errorMessage = `Failed to sync worker for row ${rowNumber}. ${row.workerSid} : ${nNumber}. ${formatErrorMessage(error)}`;
    logger.error(errorMessage, {
      error,
      nNumber: row["N Number"],
      workerSid: row.workerSid
    });
    return rejectPromise(errorMessage, rowNumber);
  }

};

//Templates
export const getCreateTemplates = (state: AppState): Templates => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      data: {},
      processFunction: (row: any) => processCreateTritonUser(row, state),
      stateUpdateFunctions: [handleWfmExternalLogon],
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
        FIELDS.CALABRIO_WFM_OPTIONAL_COLUMNS,
        FIELDS.CALABRIO_WFM_NOTE
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

export const getUpdateTemplates = (state: AppState): Templates => {
  return {
    UPDATE_WORKER_ATTRIBUTE: {
      name: "UPDATE_WORKER_ATTRIBUTE",
      data: {},
      processFunction: (row: any, template: Template) => processUpdateWorkerAttribute(row, template, state),
      stateUpdateFunctions: [],
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
      stateUpdateFunctions: [updateCalabrioUserState],
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
      stateUpdateFunctions: [],
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_UPDATE
      ]
    },
    UPDATE_CALLER_STATES: {
      name: "UPDATE_CALLER_STATES",
      data: {},
      processFunction: (row: any, template: Template) => processUpdateCallerStates(row, template, state),
      stateUpdateFunctions: [],
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_UPDATE
      ]
    },
    SYNC_HR_ATTRIBUTES: {
      name: "SYNC_HR_ATTRIBUTES",
      data: {},
      processFunction: (row: any, template: Template) => processSyncHrAttributes(row, template, state),
      stateUpdateFunctions: [],
      multiRunDependencies: null,
      validationConcurrencyLimit: 500,
      processingConcurrencyLimit: 5,
      fields: [
        FIELDS.N_NUMBER_SYNC
      ]
    }
  };
};