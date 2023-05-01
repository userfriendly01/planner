import {
  AppState,
  CalabrioQmUser,
  Discrepancy,
  discrepancyType,
  formModes,
  nNumMatcher,
  TritonProfile,
  Worker
} from "globals";
import {
  UserFormState
} from "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  formatE164PhoneNumber,
  removeNonNumericCharacters
} from "./formatNumberUtils";
import { views } from "components/tabs/usermanagement/UserManagementWrapper/UserManagement.Interfaces";
import { fetchUser as fetchUserServiceCall } from "services";
import { getWfmPeople } from "./calabrioUtils";

// For a DID user, the outgoing number is tied to the directDialNum, if you change one you must change both in order for the form to be valid
export const isDidDifferentValid = (form: UserFormState, worker: Worker, forwardToToggle: boolean): boolean => {
  if(forwardToToggle === true) {
    return removeNonNumericCharacters(form.triton.outgoing.value) !== formatE164PhoneNumber(worker?.attributes?.did)
    && removeNonNumericCharacters(form.triton.directDialNum.value) !== formatE164PhoneNumber(worker?.directDialNum);
  } else {
    return true;
  }
};

export const isExtensionValid = (form: UserFormState): boolean => form.triton.extension.valid || form.triton.extension.value === "";

export const isFormUpdated = (form: UserFormState): boolean => form.triton.defaultSkills.updated || form.triton.manager.updated ||
form.triton.profileId.updated || form.triton.outgoing.updated ||
form.triton.alternateDid.updated || form.triton.directDialNum.updated ||
form.nNumber.updated || form.triton.extension.updated ||
form.triton.inactiveForwardTo.updated || form.triton.zeroOutEnabled.updated || form.calabrio_qm.updated || form.triton.selfServiceInd.updated;

export const isFormValid = (form: UserFormState, worker: Worker, forwardToToggle: boolean): boolean =>
  (form.formMode === formModes.INSERT ? isNNumberValid(form) : true)
  && isProfileIdValid(form)
  && isManagerValid(form)
  && form.triton.outgoing.valid
  && isExtensionValid(form)
  && (form.triton.didUser === true ? form.triton.directDialNum.valid && form.triton.alternateDid.valid : true)
  && isInactiveForwardToValid(form, forwardToToggle)
  && isDidDifferentValid(form, worker, forwardToToggle)
  && isCalabrioUserValid(form);

export const isCalabrioUserValid =  (form: UserFormState): boolean => {
  return form.calabrio_qm.team && form.calabrio_qm.roles.length > 0;
};
export const isManagerValid = (form: UserFormState): boolean => form.triton.manager.value !== "";

export const isNNumberValid = (form: UserFormState): boolean => form.nNumber.nNumberFetchedUser ? true : false;

export const isProfileIdValid = (form: UserFormState): boolean => form.triton.profileId.value !== "";

export const isInactiveForwardToValid = (form: UserFormState, forwardToToggle: boolean): boolean => forwardToToggle === true ? form.triton.inactiveForwardTo.value !== null : true;

export const getNonOverflowSkills = (worker: Worker, profiles: TritonProfile[]): string[] => worker?.attributes.routing?.skills.filter((skill: string) => !getOverflowSkills(profiles).includes(skill));

export const getOverflowSkills = (profiles: TritonProfile[]): string[] => {
  const skills: string[] = [];
  profiles.forEach((profile: TritonProfile) => profile.overflow_skill !== null && skills.push(profile.overflow_skill));
  return skills;
};

export const getOverflowSkillFromProfile = (profiles: TritonProfile[], profileValue: string): string | undefined => {
  const profile = getTargetProfile(profiles, profileValue);
  if(!profile || profile?.overflow_skill === null || profile?.overflow_skill === ""){
    return undefined;
  } else {
    return profile.overflow_skill;
  }
};

export const removeProfileZeroIfAdminNotInProfileZero = (adminState: AppState, profiles: TritonProfile[]) => {
  const adGroups: string[] = adminState && adminState.userContext && adminState.userContext.pingIdentity ? adminState.userContext.pingIdentity.groups: [];

  let adminGroup = false;
  adGroups.forEach(group =>{
    if(group.includes("gci-cicct-triton-prod-admin") || group.includes("gci-cicct-triton-test-admin") || group.includes("gci-cicct-triton-dev-admin")){
      adminGroup = true;
    }
  });

  if(!adminGroup){
    const filteredProfiles = profiles.filter(e => e.profile_id !== 0);
    return filteredProfiles;
  }
  return profiles;
};

export const getTargetProfile = (profiles: TritonProfile[], newProfileValue: string): TritonProfile => profiles.find((profile: TritonProfile) => profile.profile_id.toString() === newProfileValue.toString());

export const getZeroOutEnabledFromProfile = (profiles: TritonProfile[], newProfileValue: string): boolean => getTargetProfile(profiles, newProfileValue).overflow_skill !== null;

export const workerHasOverFlowSkill = (worker: Worker, profiles: TritonProfile[]): boolean => worker?.attributes.routing?.skills.some(skill => getOverflowSkills(profiles).includes(skill));

export const fetchUser = async (nNumber: string, setForm: any, errorMessage: string, errorType: string) => {
  try {
    const fetchedUser = await fetchUserServiceCall(nNumber);
    console.log("FAITH FETCHED USER", fetchedUser);
    const nNumberPayload = {
      nNumber,
      fetchedUser
    }
    setForm({
      type: "COMPLETE_N_NUMBER",
      payload: nNumberPayload
    });
    return nNumberPayload;
  } catch(err) {
    console.error(errorMessage, err);
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
  console.log("FAITH Find matching worker", sid, nNumber, email, workers);
  let matchingWorker: Worker = null;
  workers.forEach((w: any) => {
    const workerSid = w.sid?.toLowerCase() || w.acdId?.toLowerCase();
    const workerNNumber = w.attributes?.n_number?.toLowerCase() || w.EmploymentNumber?.toLowerCase();
    const workerEmail = w.attributes?.email?.toLowerCase() || w.email?.toLowerCase() || w.Identity?.toLowerCase() || w.Email?.toLowerCase();

    if(sid && sid.toLowerCase() === workerSid){
      matchingWorker = w;
    } else if(nNumber && nNumber.toLowerCase() === workerNNumber){
      matchingWorker = w;
    } else if(email && email.toLowerCase() === workerEmail){
      console.log("FAITH = do I get here?");
      matchingWorker = w;
    }
  });
  return matchingWorker;
};

export const identifyProfileDiscrepancies = (form: UserFormState, setForm: any, state: AppState) => {
  console.log("Faith: Final Form.....", form);
  const tritonSid = "";
  const tritonEmail = "";
  const tritonNNumber = "";
  const calabrioWfmEmail = "";
  const calabrioWfmIdentity = "";
  const calabrioWfmNNumber = "";
  const calabrioQMEmail = "";
  const calabrioQmAcdId = "";
      
  //If it was not possible to find an n# - set discrepancy
  if(!form.nNumber.value){
    setForm({
      type: "SET_DISCREPANCIES",
      payload: {
        type: discrepancyType.CALABRIO_WFM,
        message: "No N Number was found for this Calabrio WFM record. This could cause discrepencies when editing your user. Please make sure the Employment Number is populated with a valid nNumber"
      }
    });
  }

};

export const identifyUserProfiles = async (form: UserFormState, setForm: any, state: AppState) => {
  const system = form.triton.userFound && "triton" || form.calabrio_qm.userFound && "calabrio_qm" || form.calabrio_wfm.userFound && "calabrio_wfm";
  let nNumberObject: any = form.nNumber;
  const tritonWorkers = state.workerContext.workers;
  const calabrioQmUsers = state.calabrioContext.users;
  const calabrioWfmUsers = getWfmPeople(state);
  let tritonWorker: Worker = null;
  let calabrioQmUser = null;
  let calabrioWfmUser = null;

  console.log("FAITH - system", system);
  if(!form.nNumber.nNumberFetchedUser && form.nNumber.value && form.nNumber.value.match(nNumMatcher)){
    //set the nNumber & Triton/Calabrio users based off of the nNumber in the state
    const errorMessage = `Failed to fetch nNumber from HR database. ${form.nNumber.value}. 
    If this nNumber continues to fail, this user may no longer be active in the HR database or needs to reach out to the HR team to investigate the failure.`
    nNumberObject = await fetchUser(form.nNumber.value, setForm, errorMessage, discrepancyType.GENERAL);
  } 

  if(system === "triton"){
    const acdId = form.triton.sid;
    const nNumber = form.nNumber.value || form.triton.attributes?.n_number;
    const email = form.nNumber.nNumberFetchedUser?.email || form.triton.attributes?.email;
    calabrioWfmUser = findMatchingWorker(acdId, nNumber, email, calabrioWfmUsers);
    calabrioQmUser = findMatchingWorker(acdId, nNumber, email, calabrioQmUsers);

  } else if(system === "calabrio_qm"){
    //This condition wont be in play until the calabrio qm table is in place
    //When this condition is fulfilled we can peel some of the code out of the CallRecordingForm
  } else if(system === "calabrio_wfm"){
    const wfmNNumber = form.calabrio_wfm.EmploymentNumber?.trim().toLowerCase();;
    const wfmIdentity = form.calabrio_wfm.Identity?.trim().toLowerCase();
    const wfmEmail = form.calabrio_wfm.Email?.trim().toLowerCase();

    console.log("FAITH starting log", wfmNNumber, wfmIdentity, wfmEmail);
    if(form.nNumber.nNumberFetchedUser && form.nNumber.value){
      tritonWorker = findMatchingWorker(null, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, tritonWorkers);
      calabrioQmUser = findMatchingWorker(null, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, calabrioQmUsers);
    } else if(!form.nNumber.nNumberFetchedUser && wfmNNumber && wfmNNumber.match(nNumMatcher)){
      //Use the WFM n# field to set the nNumber fetched user and triton/calabrio user
      console.log("FAITH should land here with an identified wfm n#", wfmNNumber);

      const errorMessage = `Failed to fetch nNumber from HR database. Value read from WFM User Record Employment Number field: ${wfmNNumber}. If this nNumber looks accurate and continues to fail, this user may no longer be active in the HR database or needs to reach out to the HR team to investigate the failure. If this nNumber does not look accurate, please correct the WFM Record Employment Number field and try again.`
      nNumberObject = await fetchUser(wfmNNumber, setForm, errorMessage, discrepancyType.CALABRIO_WFM);
      console.log("NNUMBEROBJECT FAITH", nNumberObject);
      //should be able to not use fetched worker if we're waiting
      tritonWorker = findMatchingWorker(null, wfmNNumber, nNumberObject.fetchedUser?.email, tritonWorkers);
      console.log("FAITH - Triton worker", tritonWorker);
      calabrioQmUser = findMatchingWorker(null, wfmNNumber, nNumberObject.fetchedUser?.email, calabrioQmUsers);
      console.log("FAITH - Calabrio QM worker", calabrioQmUser);
    } else if(!form.nNumber.nNumberFetchedUser) {
      //WFM Record didnt have an n#, try find the triton & calabrio worker based on the WFM email/identity values
      setForm({
        type: "SET_DISCREPANCIES",
        payload: {
          type: discrepancyType.CALABRIO_WFM,
          message: "WFM User Record is missing a valid nNumber in the Employment Number field. Please correct this and try again."
        }
      });
      if(wfmEmail && !wfmIdentity){
        tritonWorker = findMatchingWorker(null, form.nNumber.value, wfmEmail, tritonWorkers);
        calabrioQmUser = findMatchingWorker(tritonWorker?.sid, tritonWorker?.attributes.n_number || form.nNumber.value, wfmEmail, calabrioQmUsers);
      } else if(!wfmEmail && wfmIdentity || (wfmEmail && wfmIdentity && wfmEmail === wfmIdentity)){
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
    
      if(tritonWorker){
        const errorMessage = `Failed to fetch nNumber from HR database. ${tritonWorker.attributes.n_number}. If this nNumber continues to fail, this user may no longer be active in the HR database or needs to reach out to the HR team to investigate the failure.`
        await fetchUser(tritonWorker.attributes.n_number, setForm, errorMessage, discrepancyType.GENERAL);
      }
    } else {
      //nNumberFetchedUser is populated, save the Triton/Calabrio QM users based off that
      tritonWorker = findMatchingWorker(null, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, tritonWorkers);
      calabrioQmUser = findMatchingWorker(tritonWorker?.sid, form.nNumber.value, form.nNumber.nNumberFetchedUser.email, calabrioQmUsers);
    }
  }

  //Update state for Triton Worker if applicable
  if(!form.triton.userFound && tritonWorker){
    setForm({
      type: "SET_UPDATE_TRITON_FORM_STATE",
      payload: {
        worker: tritonWorker,
        managers: state.managerContext.managers
      }
    });
  }

  //Update state for Calabrio QM if applicable
  if(!form.calabrio_qm.userFound && calabrioQmUser && nNumberObject.fetchedUser){
    setForm({
      type: "SET_UPDATE_QM_FORM_STATE",
      payload: calabrioQmUser
    });
    //This conditional will change when we add a Calabrio QM table
  } else if(!form.calabrio_qm.userFound && calabrioQmUser && !nNumberObject.fetchedUser){
    //Spoofing the nNumberFetchedUser so the CallRecordingForm still works. When Calabrio QM has its own table this can be re-orged a bit
    setForm({
      type: "COMPLETE_N_NUMBER",
      payload: {
        nNumber: form.nNumber.value,
        fetchedUser: calabrioQmUser
      }
    });
  }

  //Update state for WFM user if applicable
  if(!form.calabrio_wfm.userFound && calabrioWfmUser){
    setForm({
      type: "SET_UPDATE_WFM_FORM_STATE",
      payload: calabrioWfmUser
    });
  }

  return Promise.resolve("Faith - we should be done");
};