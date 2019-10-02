export const sortManagersByName = (a, b) => {
  const [aName, bName] = [a.manager_first_name + " " + a.manager_last_name, b.manager_first_name + " " + b.manager_last_name];
  if (aName < bName) { return -1; }
  if (aName > bName) { return 1; }
  return 0;
};