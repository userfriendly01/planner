import {
  UMManager,
  TritonProfile,
  WfmUser,
  UMUser
} from "globals/interfaces";

const sortLast = "zzzzzzzzzzz";

export const sortNumbers = (a: number, b: number) => {
  return a - b;
};

export const sortStrings = (a: string, b: string) => {
  const _a = a.toLowerCase();
  const _b = b.toLowerCase();
  if (_a < _b) { return -1; }
  if (_a > _b) { return 1; }
  return 0;
};

export const sortGraphObjectsByPk = (a: any, b: any) => {
  return sortStrings(a.pk, b.pk);
};

export const sortDialListEntriesByName = (a: any, b: any) => {
  const [aName, bName] = [a.contact_nme, b.contact_nme];
  return sortStrings(aName, bName);
};

export const sortDirectoryListEntriesByName = (a: any, b: any) => {
  const [aName, bName] = [`${a.last_nme}, ${a.first_nme}`, `${b.last_nme}, ${b.first_nme}`];
  return sortStrings(aName, bName);
};

export const sortManagersByName = (a: UMManager, b: UMManager) => {
  const [aName, bName] = [a.manager_first_name + " " + a.manager_last_name, b.manager_first_name + " " + b.manager_last_name];
  return sortStrings(aName, bName);
};

export const sortProfilesById = (a: TritonProfile, b: TritonProfile) => sortNumbers(a.profile_id, b.profile_id);

export const sortProfilesByName = (a: TritonProfile, b: TritonProfile) => sortStrings(a.profile_nme, b.profile_nme);

export const sortCalabrioObject = (a: any, b: any) => sortStrings(a.name, b.name);

export const sortActivityByName = (a: any, b: any) => {
  const [aName, bName] = [a.activity_nme, b.activity_nme];
  return sortStrings(aName, bName);
};

export const sortCallTagByName = (a: any, b: any) => {
  const [aName, bName] = [a.wrkr_tsk_info_nme, b.wrkr_tsk_info_nme];
  return sortStrings(aName, bName);
};

export const sortQueueByName = (a: any, b: any) => {
  const [aName, bName] = [a.ctmSkillDisplayName, b.ctmSkillDisplayName];
  return sortStrings(aName, bName);
};

export const sortWorkersByFullName = (a: UMUser, b: UMUser) => {
  const [aName, bName] = [a.attributes.full_name || sortLast, b.attributes.full_name || sortLast];
  return sortStrings(aName, bName);
};

export const sortWfmWorkersByFullName = (a: WfmUser, b: WfmUser) => {
  const aFullName = `${a.FirstName} ${a.LastName}`;
  const bFullName = `${b.FirstName} ${b.LastName}`;
  const [aName, bName] = [aFullName?.trim() || sortLast, bFullName?.trim() || sortLast];
  return sortStrings(aName, bName);
};

export const sortWFMByName = (a: any, b: any) => sortStrings(a.Name?.trim(), b.Name?.trim());
