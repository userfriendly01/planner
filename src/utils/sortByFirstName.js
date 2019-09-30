export const sortByFirstName = (a, b) => {
  const [aName, bName] = [a.manager_first_name, b.manager_first_name];
  if (aName < bName) { return -1; }
  if (aName > bName) { return 1; }
  return 0;
};