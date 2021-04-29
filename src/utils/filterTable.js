export const filterByNameAndSkills = (worker, searchValue) => {
  if (!worker || !worker.attributes || !searchValue) {
    return false;
  }
  const name = worker.attributes.full_name?.toLowerCase() || "";
  const appliedSkills = worker.attributes.routing?.skills?.toString() || "";
  const defaultSkills = worker.attributes.default_skills?.skills?.toString() || "";
  const nNumber = worker.attributes.n_number?.toLowerCase() || "";
  const office = worker.attributes.office_location_name?.toLowerCase() || "";
  const lowerCaseSearch = searchValue.toLowerCase();
  if (name.indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (appliedSkills.toLowerCase().indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (defaultSkills.toLowerCase().indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (nNumber.indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (office.indexOf(lowerCaseSearch) >= 0) {
    return true;
  }
  return false;
};