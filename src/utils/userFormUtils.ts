import {
  UserEntryFormState,
  TritonProfile,
  TwilioWorker,
  formModes
} from "globals";
import {
  formatE164PhoneNumber,
  removeNonNumericCharacters
} from "utils";

export const isProfileIdValid = (form: UserEntryFormState): boolean => form.profileId.value !== "";

export const isManagerValid = (form: UserEntryFormState): boolean => form.manager.value !== "";

export const isNNumberValid = (form: UserEntryFormState): boolean => form.nNumberFetchedUser ? true : false;

export const isExtensionValid = (form: UserEntryFormState): boolean => form.extension.valid || form.extension.value === "";

export const isInactiveForwardToValid = (form: UserEntryFormState, forwardToToggle: boolean): boolean => forwardToToggle === true ? form.inactiveForwardTo.value !== null : true;

// For a DID user, the outgoing number is tied to the directDialNum, if you change one you must change both in order for the form to be valid
export const isDidDifferentValid = (form: UserEntryFormState, worker: TwilioWorker, forwardToToggle: boolean): boolean =>
  forwardToToggle === true ?
    removeNonNumericCharacters(form.outgoing.value) !== formatE164PhoneNumber(worker?.attributes?.did) &&
    removeNonNumericCharacters(form.directDialNum.value) !== formatE164PhoneNumber(worker?.directDialNum)
    : true;

export const getTargetProfile = (profiles: TritonProfile[], newProfileValue: string): any => profiles.find((profile: any) => profile.profile_id === +newProfileValue);

export const getExtensionInputValid = (form: UserEntryFormState): boolean => form.extension.valid || form.extension.value === "";

export const getOverflowSkillFromProfile = (profiles: TritonProfile[], profileValue: string): string | undefined => {
  const profile = getTargetProfile(profiles, profileValue);
  if(profile.overflow_skill === null || profile.overflow_skill === ""){
    return undefined;
  } else {
    return profile.overflow_skill;
  }
};

export const getOverflowSkills = (profiles: TritonProfile[]): string[] => {
  const skills: string[] = [];
  profiles.forEach((profile: any) => profile.overflow_skill !== null && skills.push(profile.overflow_skill));
  return skills;
};

export const workerHasOverFlowSkill = (worker: TwilioWorker, profiles: TritonProfile[]): boolean => worker?.attributes.routing?.skills.some(skill => getOverflowSkills(profiles).includes(skill));

export const getNonOverflowSkills = (worker: TwilioWorker, profiles: TritonProfile[]): any[] => worker?.attributes.routing?.skills.filter(skill => !getOverflowSkills(profiles).includes(skill));

export const isFormUpdated = (form: UserEntryFormState): boolean => form.defaultSkillsUpdated || form.manager.updated ||
form.profileId.updated || form.outgoing.updated ||
form.alternateDid.updated || form.directDialNum.updated ||
form.nNumber.updated || form.extension.updated ||
form.inactiveForwardTo.updated || form.zeroOutEnabledUpdated;

export const isFormValid = (form: UserEntryFormState, worker: TwilioWorker, forwardToToggle: boolean): boolean =>
  (form.formMode === formModes.INSERT ? isNNumberValid(form) : true)
  && isProfileIdValid(form)
  && isManagerValid(form)
  && form.outgoing.valid
  && isExtensionValid(form)
  && (form.didUser === true ? form.directDialNum.valid && form.alternateDid.valid : true)
  && isInactiveForwardToValid(form, forwardToToggle)
  && isDidDifferentValid(form, worker, forwardToToggle);