import {
  AppState,
  discrepancyType,
  formModes,
  nNumMatcher,
  TritonProfile,
  UMUser
} from "globals";
import {
  UserFormState
} from "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  formatE164PhoneNumber,
  removeNonNumericCharacters
} from "./formatNumberUtils";
import {
  fetchUser as fetchUserServiceCall,
  getWfmUserByNNumber
} from "services";
import { logger } from "./logger";
import { CalabrioUser } from "components";

export const isUnpopulatedField = (f: any) => (!f && f !== false && f !== 0) || f?.length === 0 || (typeof f === "object" && JSON.stringify(f) === JSON.stringify({}));

// For a DID user, the outgoing number is tied to the did, if you change one you must change both in order for the form to be valid
export const isDidDifferentValid = (form: UserFormState, worker: UMUser, forwardToToggle: boolean): boolean => {
  if (forwardToToggle === true) {
    return removeNonNumericCharacters(form.triton.outgoing.value) !== formatE164PhoneNumber(worker?.attributes?.caller_id)
      && removeNonNumericCharacters(form.triton.did.value) !== formatE164PhoneNumber(worker?.did);
  } else {
    return true;
  }
};

export const isExtensionValid = (form: UserFormState): boolean => form.triton.extension.valid || form.triton.extension.value === "";

export const isFormUpdated = (form: UserFormState): boolean => form.triton.defaultSkills.updated || form.triton.manager.updated ||
  form.triton.profileId.updated || form.triton.outgoing.updated ||
  form.triton.did.updated ||
  form.nNumber.updated || form.triton.extension.updated ||
  form.triton.inactiveForwardTo.updated || form.triton.zeroOutEnabled.updated || form.calabrio_qm.updated || form.triton.selfServiceInd.updated || form.triton.routing.updated;

export const identifyFormErrors = (form: UserFormState) => {
  let erroredFields: any[] = [];
  const qmErrors = isQMUserValid(form);
  const wfmErrors = isWfmUserValid(form);
  erroredFields = [
    ...qmErrors,
    ...wfmErrors
  ];
  return erroredFields;
};

export const isTritonUserValid = (form: UserFormState, worker: UMUser, forwardToToggle: boolean) => {
  if (!form.triton.userFound) {
    return false;
  } else {
    return (form.formMode === formModes.INSERT ? isNNumberValid(form) : true)
      && isProfileIdValid(form)
      && isManagerValid(form)
      && form.triton.outgoing.valid
      && isExtensionValid(form)
      && (form.triton.didUser === true ? form.triton.did.valid : true)
      && isInactiveForwardToValid(form, forwardToToggle)
      && isDidDifferentValid(form, worker, forwardToToggle);
  }
};

export const isQMUserValid = (form: UserFormState) => {
  const requiredFields: any[] = [
    {
      value: "team",
      alias: "QM Team"
    }, {
      value: "roles",
      alias: "QM Roles"
    }
  ];
  const missingFields: any = [];
  if (!form.calabrio_qm.userFound) {
    return requiredFields.map((f: any) => f.alias);
  } else {
    requiredFields.forEach((f: any) => {
      const value: any = form.calabrio_qm[f.value];
      if (!value || value.length === 0) {
        missingFields.push(f.alias);
      }
    });
    return missingFields;
  }
};

export const isWfmUserValid = (form: UserFormState) => {
  const user = form.calabrio_wfm;
  const requiredFields: string[] = ["FirstName", "LastName", "EmploymentNumber", "Email", "DisplayName", "BusinessUnitId", "FirstDayOfWeek"];
  const logicalRequiredFields: any = {
    scheduleFields: ["EmploymentStartDate", "TeamId", "TeamStartDate", "ContractId", "ContractScheduleId", "PartTimePercentageId"],
    teamFields: ["TeamId", "TeamStartDate"],
    availabilityFields: ["AvailabilityId", "AvailabilityStartDate"],
    skillFIelds: ["PersonSkills", "SkillsStartDate"],
    rotationFields: ["RotationId", "RotationStartDate", "RotationStartWeek"]
  };
  const missingFields: string[] = [];
  if (!user.userFound) {
    return [];
  } else {
    requiredFields.forEach((f: any) => {
      const value: any = form.calabrio_wfm[f];
      if (isUnpopulatedField(value)) {
        missingFields.push(f);
      }
    });

    Object.values(logicalRequiredFields).forEach((fields: any[]) => {
      const allFieldsNull = fields.every((f: any) => isUnpopulatedField(user[f]));

      if (!allFieldsNull) {
        fields.forEach((field: string) => {
          if (isUnpopulatedField(user[field])) { missingFields.push(field); }
        });
      }
    });

    if (user.OptionalColumns?.length > 0) {
      const validColumns = user.OptionalColumns.every((oc: any) => !isUnpopulatedField(oc.Value));
      if (!validColumns) {
        missingFields.push("Optional Columns");
      }
    }
    return [...new Set(missingFields)];
  }
};

export const isManagerValid = (form: UserFormState): boolean => form.triton.manager.value !== "";

export const isNNumberValid = (form: UserFormState): boolean => form.nNumber.nNumberFetchedUser ? true : false;

export const isProfileIdValid = (form: UserFormState): boolean => form.triton.profileId.value !== "";

export const isInactiveForwardToValid = (form: UserFormState, forwardToToggle: boolean): boolean => forwardToToggle === true ? form.triton.inactiveForwardTo.value !== null : true;

export const getNonOverflowSkills = (worker: UMUser, profiles: TritonProfile[]): string[] => worker?.attributes.routing?.skills.filter((skill: string) => !getOverflowSkills(profiles).includes(skill));

export const getOverflowSkills = (profiles: TritonProfile[]): string[] => {
  const skills: string[] = [];
  profiles.forEach((profile: TritonProfile) => profile.overflow_skill !== null && skills.push(profile.overflow_skill));
  return skills;
};

export const getOverflowSkillFromProfile = (profiles: TritonProfile[], profileValue: string): string | undefined => {
  const profile = getTargetProfile(profiles, profileValue);
  if (!profile || profile?.overflow_skill === null || profile?.overflow_skill === "") {
    return undefined;
  } else {
    return profile.overflow_skill;
  }
};

export const getTargetProfile = (profiles: TritonProfile[], newProfileValue: string): TritonProfile => profiles.find((profile: TritonProfile) => profile.profile_id.toString() === newProfileValue.toString());

export const getZeroOutEnabledFromProfile = (profiles: TritonProfile[], newProfileValue: string): boolean => getTargetProfile(profiles, newProfileValue).overflow_skill !== null;

export const workerHasOverFlowSkill = (worker: UMUser, profiles: TritonProfile[]): boolean => worker?.attributes.routing?.skills.some(skill => getOverflowSkills(profiles).includes(skill));

export const fetchUser = async (nNumber: string, setForm: any, errorMessage: string, errorType: string) => {
  try {
    const fetchedUser = await fetchUserServiceCall(nNumber);
    const nNumberPayload = {
      nNumber,
      fetchedUser
    };
    setForm({
      type: "COMPLETE_N_NUMBER",
      payload: nNumberPayload
    });
    return nNumberPayload;
  } catch (error) {
    logger.error(errorMessage, { error }, false);
    setForm({
      type: "SET_DISCREPANCIES",
      payload: {
        type: errorType,
        message: errorMessage
      }
    });
    return {
      nNumber,
      fetchedUser: null
    };
  }
};

export const findMatchingWorker = (sid: string, nNumber: string, email: string, workers: any[]) => {
  //Dynamic to look through triton workers, calabrio qm users and calabrio wfm users
  let matchingWorker: UMUser = null;
  workers.forEach((w: any) => {
    const workerSid = w.sid?.toLowerCase() || w.acdId?.toLowerCase();
    const workerNNumber = w.attributes?.n_number?.toLowerCase() || w.EmploymentNumber?.toLowerCase();
    const workerEmail = w.attributes?.email?.toLowerCase() || w.email?.toLowerCase() || w.Identity?.toLowerCase() || w.Email?.toLowerCase();

    if (sid && sid.toLowerCase() === workerSid) {
      matchingWorker = w;
    } else if (nNumber && nNumber.toLowerCase() === workerNNumber) {
      matchingWorker = w;
    } else if (email && email.toLowerCase() === workerEmail) {
      matchingWorker = w;
    }
  });
  return matchingWorker;
};

export const findExistingWFMUser = async (nNumber: string): Promise<CalabrioUser> => {
  try {
    const wfmUserRes = await getWfmUserByNNumber(nNumber);
    if (wfmUserRes?.data?.Result.length > 0) {
      const wfmUser: CalabrioUser = wfmUserRes.data.Result[0];
      return wfmUser;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

export const identifyUserProfiles = async (form: UserFormState, setForm: any, state: AppState) => {
  const primarySystem = form.triton.userFound && "triton" || form.calabrio_qm.userFound && "calabrio_qm" || form.calabrio_wfm.userFound && "calabrio_wfm";
  let nNumberObject: any = {
    nNumber: form.nNumber.value,
    fetchedUser: form.nNumber.nNumberFetchedUser
  };
  const tritonWorkers = state.workerContext.workers;
  const calabrioQmUsers = state.calabrioContext.users;
  const managers = state.managerContext.managers;
  let tritonWorker: UMUser = null;
  let calabrioQmUser = null;
  let calabrioWfmUser = null;

  if (!form.nNumber.nNumberFetchedUser && form.nNumber.value && form.nNumber.value.match(nNumMatcher)) {
    //set the nNumber & Triton/Calabrio users based off of the nNumber in the state
    const errorMessage = `Failed to fetch nNumber from HR database. ${form.nNumber.value}. 
    If this nNumber continues to fail, this user may no longer be active in the HR database or needs to reach out to the HR team to investigate the failure.`;
    nNumberObject = await fetchUser(form.nNumber.value, setForm, errorMessage, discrepancyType.GENERAL);
  }
  if (primarySystem === "triton") {
    const acdId = form.triton.sid;
    const nNumber = form.nNumber.value || form.triton.attributes?.n_number;
    const email = form.nNumber.nNumberFetchedUser?.email || form.triton.attributes?.email;
    calabrioWfmUser = await findExistingWFMUser(nNumber);
    calabrioQmUser = findMatchingWorker(acdId, nNumber, email, calabrioQmUsers);
  } else if (primarySystem === "calabrio_qm") {
    //This condition wont be in play until the calabrio qm table is in place
    //When this condition is fulfilled we can peel some of the code out of the CallRecordingForm
  } else if (primarySystem === "calabrio_wfm") {
    const wfmNNumber = form.calabrio_wfm.EmploymentNumber?.trim().toLowerCase();
    const wfmIdentity = form.calabrio_wfm.Identity?.trim().toLowerCase();
    const wfmEmail = form.calabrio_wfm.Email?.trim().toLowerCase();

    if (form.nNumber.nNumberFetchedUser && form.nNumber.value) {
      tritonWorker = findMatchingWorker(null, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, tritonWorkers);
      calabrioQmUser = findMatchingWorker(null, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, calabrioQmUsers);
    } else if (!form.nNumber.nNumberFetchedUser && wfmNNumber && wfmNNumber.match(nNumMatcher)) {
      const errorMessage = `Failed to fetch nNumber from HR database. Value read from WFM User Record Employment Number field: ${wfmNNumber}. If this nNumber looks accurate and continues to fail, this user may no longer be active in the HR database or needs to reach out to the HR team to investigate the failure. If this nNumber does not look accurate, please correct the WFM Record Employment Number field and try again.`;
      nNumberObject = await fetchUser(wfmNNumber, setForm, errorMessage, discrepancyType.CALABRIO_WFM);
      tritonWorker = findMatchingWorker(null, wfmNNumber, nNumberObject.fetchedUser?.email, tritonWorkers);
      calabrioQmUser = findMatchingWorker(null, wfmNNumber, nNumberObject.fetchedUser?.email, calabrioQmUsers);
    } else if (!form.nNumber.nNumberFetchedUser) {
      setForm({
        type: "SET_DISCREPANCIES",
        payload: {
          type: discrepancyType.CALABRIO_WFM,
          message: "WFM User Record is missing a valid nNumber in the Employment Number field. Please correct this and try again."
        }
      });
      if (wfmEmail && !wfmIdentity) {
        tritonWorker = findMatchingWorker(null, form.nNumber.value, wfmEmail, tritonWorkers);
        calabrioQmUser = findMatchingWorker(tritonWorker?.sid, tritonWorker?.attributes.n_number || form.nNumber.value, wfmEmail, calabrioQmUsers);
      } else if (!wfmEmail && wfmIdentity || (wfmEmail && wfmIdentity && wfmEmail === wfmIdentity)) {
        tritonWorker = findMatchingWorker(null, form.nNumber.value, wfmIdentity, tritonWorkers);
        calabrioQmUser = findMatchingWorker(tritonWorker?.sid, tritonWorker?.attributes.n_number || form.nNumber.value, wfmIdentity, calabrioQmUsers);
      } else {
        setForm({
          type: "SET_DISCREPANCIES",
          payload: {
            type: discrepancyType.CALABRIO_WFM,
            message: "WFM User Record Email and Identity are either both empty or do not match. Please verify the emails are correct."
          }
        });
      }
    } else {
      //nNumberFetchedUser is populated, save the Triton/Calabrio QM users based off that
      tritonWorker = findMatchingWorker(null, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, tritonWorkers);
      calabrioQmUser = findMatchingWorker(tritonWorker?.sid, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, calabrioQmUsers);
    }
  }

  // Checking to make sure their manager's name matches the name in the worker attributes (should be rare)
  const manager: any = managers.find(m => m.manager_n_num === form.triton?.attributes?.manager_n_number);
  if (form.triton.userFound && manager && (form.triton.attributes.manager_first_name !== manager.manager_first_name || form.triton.attributes.manager_last_name !== manager.manager_last_name)) {
    setForm({
      type: "SET_DISCREPANCIES",
      payload: {
        type: discrepancyType.GENERAL,
        message: `Manager name on this worker is ${form.triton.attributes.manager_first_name} ${form.triton.attributes.manager_last_name}, but our records indicate that their name has changed to ${manager.manager_first_name} ${manager.manager_last_name}`
      }
    });
  }

  //Update state for Triton Worker if applicable
  if (!form.triton.userFound && tritonWorker) {
    setForm({
      type: "SET_UPDATE_TRITON_FORM_STATE",
      payload: {
        formMode: form.formMode,
        worker: tritonWorker,
        managers: managers
      }
    });
  }

  //Update state for Calabrio QM if applicable
  if (!form.calabrio_qm.userFound && calabrioQmUser && nNumberObject.fetchedUser) {
    /*
       Right now the CallRecordingForm handles the logic of populating the edit form based on the n#
       When we have a Calabrio WM Table view and hit the edit button, this conditional will come into play
       This is the action we will take at that point and refactor the populating of the user into this method instead of the callrecording form
    
       For now - we need this call to set userFound to true
     */
    setForm({
      type: "SET_UPDATE_QM_FORM_STATE",
      payload: {
        user: calabrioQmUser,
        formMode: form.formMode
      }
    });

  } else if (!form.calabrio_qm.userFound && calabrioQmUser && !nNumberObject.fetchedUser) {
    //Spoofing the nNumberFetchedUser so the CallRecordingForm still works. When Calabrio QM has its own table this can be re-orged a bit
    setForm({
      type: "COMPLETE_N_NUMBER",
      payload: {
        nNumber: form.nNumber.value || "n",
        fetchedUser: calabrioQmUser
      }
    });
  }

  //Update state for WFM user if applicable
  if (calabrioWfmUser) {
    setForm({
      type: "SET_UPDATE_WFM_FORM_STATE",
      payload: {
        formMode: form.formMode,
        user: calabrioWfmUser,
        state
      }
    });
  }

  return Promise.resolve();
};