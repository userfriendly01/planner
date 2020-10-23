import { TwilioWorker } from "context";

const sortLast = "zzzzzzzzzzz";

export const sortDialListEntriesByName = (a: any, b: any) => {
  const [aName, bName] = [a.contact_nme, b.contact_nme];
  return sortStrings(aName, bName);
};

export const sortManagersByName = (a: any, b: any) => {
  const [aName, bName] = [a.manager_first_name + " " + a.manager_last_name, b.manager_first_name + " " + b.manager_last_name];
  return sortStrings(aName, bName);
};

export const sortStrings = (a: string, b: string) => {
  const _a = a.toLowerCase();
  const _b = b.toLowerCase();
  if (_a < _b) { return -1; }
  if (_a > _b) { return 1; }
  return 0;
};

export const sortTaskRouterSkillByName = (a: any, b: any) => {
  const [aName, bName] = [a.skill, b.skill];
  return sortStrings(aName, bName);
};

export const sortWorkersByFullName = (a: TwilioWorker, b: TwilioWorker) => {
  const [aName, bName] = [a.attributes.full_name || sortLast, b.attributes.full_name || sortLast];
  return sortStrings(aName, bName);
};