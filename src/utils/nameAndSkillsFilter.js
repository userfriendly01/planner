export const filterByNameAndSkills = (worker, searchValue) => {
  if (!worker || !worker.attributes || !searchValue) {
    return false;
  }
  const name = worker.attributes.full_name ? worker.attributes.full_name.toLowerCase() : "";
  const appliedSkills = worker.attributes.routing ? worker.attributes.routing.skills.toString() : "";
  const defaultSkills = worker.attributes.default_skills ? worker.attributes.default_skills.skills.toString() : "";
  if (name.indexOf(searchValue.toLowerCase()) >= 0) {
    return true;
  } else if (appliedSkills.toLowerCase().indexOf(searchValue) >= 0) {
    return true;
  } else if (defaultSkills.toLowerCase().indexOf(searchValue) >= 0) {
    return true;
  }
  return false;
};