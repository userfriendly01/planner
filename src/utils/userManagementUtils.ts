import {
  TritonProfile,
  Worker,
  formModes,
  AppState,
  Discrepancy,
  discrepancyType,
} from "globals";
import {
  UserFormState
} from "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  formatE164PhoneNumber,
  removeNonNumericCharacters
} from "./formatNumberUtils";
import { findMatchingTritonWorker } from "utils";
import { views } from "components/tabs/usermanagement/UserManagementWrapper/UserManagement.Interfaces";
import { fetchUser as fetchUserServiceCall } from "services";

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

export const fetchUser = async (nNumber: string, setForm: any) => {
  try {
    const fetchedUser = await fetchUserServiceCall(nNumber);
    setForm({
      type: "COMPLETE_N_NUMBER",
      payload: {
        nNumber: nNumber,
        fetchedUser
      }
    });
  } catch (err) {
    console.error("Failed to fetch user from peoples database.", err);
    const discrepancy: Discrepancy = {
      type: discrepancyType.GENERAL,
      message: `Failed to fetch ${nNumber}. If this continues to happen, this user may no longer be active in the HR database or needs to reach out to the HR team to investigate the failure`
    };
    setForm({
      type: "SET_DISCREPANCIES",
      payload: discrepancy
    });
  }
};

export const identifyProfileDiscrepancies = (form: UserFormState, setForm: any, state: AppState) => {
  const tritonWorkers = state.workerContext.workers;
  const fetchedUser = form.nNumber.nNumberFetchedUser;
  const tritonWorker = tritonWorkers.find((w: Worker) => form.nNumber.value === w.attributes.n_number);

  if(fetchedUser.email?.toLowerCase() !== tritonWorker.attributes?.email?.toLowerCase()){
    const discrepancy: Discrepancy = {
      type: discrepancyType.CALABRIO,
      message: "Triton email does not match HR email."
    };
    setForm({
      type: "SET_DISCREPANCIES",
      payload: discrepancy
    });
  }
};

export const findMatchingNNumber = async (form: UserFormState, setForm: any, state: AppState, ) => {
  const wfmNNumber = form.calabrio_wfm.EmploymentNumber?.toLowerCase();
  if(wfmNNumber || qmNNumber){
    //nNumber was found on the user and should be used as truth
    const nNumber = qmNNumber || wfmNNumber;
    try {
      const res: any = await fetchUser(nNumber)
      setForm({
        type: "COMPLETE_N_NUMBER",
        payload: {
          nNumber: nNumber,
          fetchedUser: res.data
        }
      });
    } catch(err) {
      const discrepancy: Discrepancy = {
        type: discrepancyType.GENERAL,
        message: `Found an nNumber that was not valid. ${nNumber} threw an error from the HR database. ${err.message}. Make sure the QM ad login field or the WFM Application Logon field is formatted correctly`
      };
      setForm({
        type: "SET_DISCREPANCIES",
        payload: discrepancy
      });
    }
  } else {
    const wfmEmail = user.Email?.toLowerCase() || user.Identity?.toLowerCase();
    const qmEmail = user.email?.toLowerCase();

    const matchingWorker = state.workerContext.workers.find((w: Worker) => w.attributes.email?.toLowerCase() === wfmEmail || w.attributes.email?.toLowerCase() === qmEmail)
    const nNumber = matchingWorker?.attributes.n_number
    if(nNumber){
      try {
        const res: any = await fetchUser(nNumber)
        setForm({
          type: "COMPLETE_N_NUMBER",
          payload: {
            nNumber: nNumber,
            fetchedUser: res.data
          }
        });
      } catch(err) {
        const discrepancy: Discrepancy = {
          type: discrepancyType.TRITON,
          message: `${nNumber} Found an on Triton Worker ${matchingWorker.sid} was not valid. An error was thrown from the HR database. ${err.message}.`
        };
        setForm({
          type: "SET_DISCREPANCIES",
          payload: discrepancy
        });
      }
    } else {
      const discrepancy: Discrepancy = {
        type: discrepancyType.GENERAL,
        message: "Unable to find an NNumber to properly populate this worker. Please make sure other worker records are correct if applicable. Ie: Triton Worker exists or WFM worker has EmploymentNumber populated as the employees n# or the Email/Identity fields are correct"
      };
      setForm({
        type: "SET_DISCREPANCIES",
        payload: discrepancy
      });
    }
  }
}

export const identifyUserProfiles = (state: AppState, form: UserFormState, setForm: any) => {
  const system = form.triton.userFound && "triton" || form.calabrio_qm.userFound && "calabrio_qm" || form.calabrio_qm.userFound && "calabrio_wfm";
  const nNumber = form.nNumber.value?.toLowerCase();
  const workerSid = form.calabrio_qm.acdId?.toLowerCase();
  const email = form.nNumber.nNumberFetchedUser.email?.toLowerCase();

  //Find matching Triton Worker before anything else - they have a legitamite nNumber.

  if(system === "triton"){
    !form.nNumber.nNumberFetchedUser && form.nNumber.value
    //Triton worker and NNumber are already populated - Calabrio QM should be all set
    //The Triton user and n# will be populated as expexted
    //Pull out fetch user from UserFormButtons and put it here
    //Populate the nNumberFetchedUser.
    //Search the calabrio qm user state and setForm on any matches
    //Search the calabrio wfm user state and setForm on any matches
  } else if(system === "calabrio_qm"){
    //This condition wont be in play until the calabrio qm table is in place
  } else if(system === "calabrio_wfm"){
    //Identify if there is an N Number field on the worker
    //Find associated Triton user & compare the n# if it wasnt on the WFM worker
    //Set discrepency if the n# fields dont match
    //Update NNumber if they do match, if they dont match, use the Triton worker n# and set the Triton Form information and NNumber form info
    //If there is no Triton worker, set as discrepancy
  }

  identifyProfileDiscrepancies(form, setForm, state);




  if(!form.triton.userFound){
    const matchingTritonWorker = findMatchingTritonWorker(form.calabrio_qm, form.calabrio_wfm, state);
    if(matchingTritonWorker){
      setForm({
        type: "SET_UPDATE_TRITON_FORM_STATE",
        payload: {
          matchingTritonWorker,
          managers: state.managerContext.managers
        }
      });
    } else {
      findMatchingNNumber(form, setForm, state);
    }
  }
  if(!form.calabrio_qm.userFound){
    //just set the field - it will render the form and do the work 
  }
  if(!form.calabrio_wfm.userFound){
    
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  //FAITH REDO THIS
  const routedFrom = views.TRITON_USERS;
  // const worker = workerOpts.worker;
  const worker: any = form;
  switch(routedFrom){
    // case views.TRITON_USERS: {
    //   const workerSid = worker.sid?.toLowerCase();
    //   const email = worker.attributes?.email?.toLowerCase();
    //   const calabrioQmUser = state.calabrioContext.users.find(user => user.acdId?.toLowerCase() === workerSid) || state.calabrioContext.users.find((user: any) => user.email?.toLowerCase() === email);
    //   systems.triton = true,
    //   systems.calabrio_qm = calabrioQmUser ? true : false;
    //   systems.calabrio_wfm = false;
    //   return systems;
    // }
    // case views.CALABRIO_QM_USERS: {
    //   const acdId = worker.acdId.toLowerCase();
    //   const calabrioQmUser = state.workerContext.workers.find(worker => worker.sid?.toLowerCase() === acdId);

    //   systems.triton = true,
    //   systems.calabrio_qm = calabrioQmUser ? true : false;
    //   systems.calabrio_wfm = false;
    //   return systems;
    // }
    // case views.CALABRIO_WFM_USERS:
    //   //future enhancement
    //   return systems;
    default:
      console.log("**Hit default switch", routedFrom);

      // return systems;
  }
};