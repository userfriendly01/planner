import { ProfileEntryFormState } from "components/tabs/orgmanagement/triton/ProfileEntryForm/ProfileEntryForm.Interfaces";

export const isProfileFormValid = (form: ProfileEntryFormState): boolean => {
  if (form.operatingUnit.ou_name && form.activitiesList.length
    && form.profileName.valid && form.overflowSkill.valid
    && (form.forwardToNum.valid || !form.forwardToNum.unmaskedValue) // allow null
    && ((form.acwDataEntry.value === true && form.callTagsList.length) || (form.acwDataEntry.value === false && !form.callTagsList.length))
    && ((form.accessGroup.value === true && form.accessGroupId) || form.accessGroup.value === false)) {
    return true;
  }
  return false;
};

export const isProfileNameValid = (profileName: string): boolean => {
  return profileName.length && profileName.length <= 80 ? true : false;
};

export const isOverflowSkillValid = (overflowSkill: string): boolean => {
  const overflowSkillRegEx = /^[0-9a-zA-Z]+$/;
  return !overflowSkill || (overflowSkill.length <= 80 && overflowSkill.match(overflowSkillRegEx)) ? true : false;
};