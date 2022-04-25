import {
  TritonProfile,
  Worker,
  formModes,
  WorkerSkills
} from "globals";
import {
  UserFormState
} from "components/usermanagement/UserEntryForm/UserEntryForm.Interfaces";
import {
  formatE164PhoneNumber,
  removeNonNumericCharacters
} from "utils";
import { useAdminState } from "context";

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
form.inactiveForwardTo.updated || form.zeroOutEnabledUpdated;

export const isFormValid = (form: UserFormState, worker: Worker, forwardToToggle: boolean): boolean =>
  (form.formMode === formModes.INSERT ? isNNumberValid(form) : true)
  && isProfileIdValid(form)
  && isManagerValid(form)
  && form.outgoing.valid
  && isExtensionValid(form)
  && (form.didUser === true ? form.directDialNum.valid && form.alternateDid.valid : true)
  && isInactiveForwardToValid(form, forwardToToggle)
  && isDidDifferentValid(form, worker, forwardToToggle);

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
  if(profile.overflow_skill === null || profile.overflow_skill === ""){
    return undefined;
  } else {
    return profile.overflow_skill;
  }
};

export const removeProfileZeroIfNeeded = (profiles: TritonProfile[]) => {
  const adminState = useAdminState();
  const nNumber = adminState.userContext.pingIdentity.sub;

  let loggedInWorker;
  adminState.workerContext.workers.forEach(worker =>{
    if(worker.attributes.n_number && worker.attributes.n_number.toLowerCase() === nNumber.toLowerCase()){
      loggedInWorker = worker;
    }
  });

  const workerProfileId = loggedInWorker ? loggedInWorker.attributes.profile_id : null;
  
  if(workerProfileId !== 0){
    const filteredProfiles = profiles.filter(e => e.profile_id !== 0);
    return filteredProfiles;
  }
  return profiles;

}

export const getTargetProfile = (profiles: TritonProfile[], newProfileValue: string): TritonProfile => profiles.find((profile: TritonProfile) => profile.profile_id === +newProfileValue);

export const getZeroOutEnabledFromProfile = (profiles: TritonProfile[], newProfileValue: string): boolean => getTargetProfile(profiles, newProfileValue).overflow_skill !== null;

export const workerHasOverFlowSkill = (worker: Worker, profiles: TritonProfile[]): boolean => worker?.attributes.routing?.skills.some(skill => getOverflowSkills(profiles).includes(skill));


