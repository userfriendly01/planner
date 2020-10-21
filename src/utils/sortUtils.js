export const sortDialListEntriesByName = (a, b) => {
  const [aName, bName] = [a.contact_nme, b.contact_nme];
  return sortStrings(aName, bName);
};

export const sortDirectoryListEntriesByName = (a, b) => {
  const [aName, bName] = [`${a.last_nme}, ${a.first_nme}`, `${b.last_nme}, ${b.first_nme}`];
  return sortStrings(aName, bName);
};

export const sortManagersByName = (a, b) => {
  const [aName, bName] = [a.manager_first_name + " " + a.manager_last_name, b.manager_first_name + " " + b.manager_last_name];
  return sortStrings(aName, bName);
};

export const sortTaskRouterSkillByName = (a, b) => {
  const [aName, bName] = [a.skill, b.skill];
  return sortStrings(aName, bName);
};

const sortStrings = (_a, _b) => {
  const a = _a.toLowerCase();
  const b = _b.toLowerCase();
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
};
