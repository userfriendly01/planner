export const sortDialListEntriesByName = (a, b) => {
  const [aName, bName] = [a.contact_nme, b.contact_nme];
  return sortEm(aName, bName);
};

export const sortManagersByName = (a, b) => {
  const [aName, bName] = [a.manager_first_name + " " + a.manager_last_name, b.manager_first_name + " " + b.manager_last_name];
  return sortEm(aName, bName);
};

export const sortTaskRouterSkillByName = (a, b) => {
  const [aName, bName] = [a.skill, b.skill];
  return sortEm(aName, bName);
};

const sortEm = (a, b) => {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
};
