import { ProfileEntryFormState } from "components/tabs/profilesettings/ProfileEntryForm/ProfileEntryForm.Interfaces";

export const isProfileFormValid = (form: ProfileEntryFormState): boolean => form.profileId && form.profileName.valid && form.overflowSkill.valid;

export const isProfileNameValid = (profileName: string): boolean => {
  return profileName.length && profileName.length<=80?true:false;
};

export const isOverflowSkillValid = (overflowSkill: string): boolean => {
  const overflowSkillRegEx = /^[0-9a-zA-Z]+$/;
  return !overflowSkill || (overflowSkill.length<=80 && overflowSkill.match(overflowSkillRegEx)) ? true : false;
};