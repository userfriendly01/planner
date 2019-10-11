// https://codeburst.io/javascript-array-distinct-5edc93501dc4 really good read.
export const filterByNameAndSkills = (worker, searchValue) => {
  if (!worker || !worker.attributes) {
    return false;
  }
  const name = worker.attributes.full_name ? worker.attributes.full_name : "";
  const appliedSkills = worker.attributes.routing ? worker.attributes.routing.skills : [];
  const defaultSkills = worker.attributes.default_skills ? worker.attributes.default_skills.skills : [];
  if (name.indexOf(searchValue) >= 0) {
    return true;
  } else if (appliedSkills.toString().indexOf(searchValue) >= 0) {
    return true;
  } else if (defaultSkills.toString().indexOf(searchValue) >= 0) {
    return true;
  }
  return false;
};