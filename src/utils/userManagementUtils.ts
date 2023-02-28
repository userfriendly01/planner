import {
  TritonProfile,
  Worker,
  formModes,
  AppState
} from "globals";
import {
  UserFormState,
  WorkerOpts
} from "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  formatE164PhoneNumber,
  removeNonNumericCharacters
} from "./formatNumberUtils";
import { views } from "components/tabs/usermanagement/UserManagementWrapper/UserManagement.Interfaces";

// For a DID user, the outgoing number is tied to the directDialNum, if you change one you must change both in order for the form to be valid
export const isDidDifferentValid = (form: UserFormState, worker: Worker, forwardToToggle: boolean): boolean => {
  if(forwardToToggle === true) {
    return removeNonNumericCharacters(form.outgoing.value) !== formatE164PhoneNumber(worker?.attributes?.did)
    && removeNonNumericCharacters(form.directDialNum.value) !== formatE164PhoneNumber(worker?.directDialNum);
  } else {
    return true;
  }
};

export const isExtensionValid = (form: UserFormState): boolean => form.extension.valid || form.extension.value === "";

export const isFormUpdated = (form: UserFormState): boolean => form.defaultSkillsUpdated || form.manager.updated ||
form.profileId.updated || form.outgoing.updated ||
form.alternateDid.updated || form.directDialNum.updated ||
form.nNumber.updated || form.extension.updated ||
form.inactiveForwardTo.updated || form.zeroOutEnabledUpdated || form.calabrioUser.updated;

export const isFormValid = (form: UserFormState, worker: Worker, forwardToToggle: boolean): boolean =>
  (form.formMode === formModes.INSERT ? isNNumberValid(form) : true)
  && isProfileIdValid(form)
  && isManagerValid(form)
  && form.outgoing.valid
  && isExtensionValid(form)
  && (form.didUser === true ? form.directDialNum.valid && form.alternateDid.valid : true)
  && isInactiveForwardToValid(form, forwardToToggle)
  && isDidDifferentValid(form, worker, forwardToToggle)
  && isCalabrioUserValid(form);

export const isCalabrioUserValid =  (form: UserFormState): boolean => {
  return form.calabrioUser.team && form.calabrioUser.roles.length > 0;
};
export const isManagerValid = (form: UserFormState): boolean => form.manager.value !== "";

export const isNNumberValid = (form: UserFormState): boolean => form.nNumberFetchedUser ? true : false;

export const isProfileIdValid = (form: UserFormState): boolean => form.profileId.value !== "";

export const isInactiveForwardToValid = (form: UserFormState, forwardToToggle: boolean): boolean => forwardToToggle === true ? form.inactiveForwardTo.value !== null : true;

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

export const identifyUserProfiles = (state: AppState, workerOpts: WorkerOpts) => {
  const systems = {
    ...workerOpts.systems
  };

  const routedFrom = workerOpts.routedFrom;
  const worker = workerOpts.worker;
  switch(routedFrom){
    case views.TRITON_USERS: {
      const workerSid = worker.sid?.toLowerCase();
      const email = worker.attributes?.email?.toLowerCase();
      const calabrioQmUser = state.calabrioContext.users.find(user => user.acdId?.toLowerCase() === workerSid) || state.calabrioContext.users.find((user: any) => user.email?.toLowerCase() === email);
      systems.triton = true,
      systems.calabrio_qm = calabrioQmUser ? true : false;
      systems.calabrio_wfm = false;
      return systems;
    }
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

      return systems;
  }
};