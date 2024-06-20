export const filterWorkerSearch = (worker: any, searchValue: string) => {
  if (!worker || !worker.attributes) {
    return false;
  }

  if (!searchValue) {
    return true;
  }
  const name = worker.attributes.full_name?.toLowerCase() || "";
  const appliedSkills = worker.attributes.routing?.skills?.toString() || "";
  const defaultSkills = worker.attributes.default_skills?.skills?.toString() || "";
  const nNumber = worker.attributes.n_number?.toLowerCase() || "";
  const office = worker.attributes.office_location_name?.toLowerCase() || "";
  const routingTeam = worker.attributes.routing?.team?.toLowerCase() || "";
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
  } else if (routingTeam.indexOf(lowerCaseSearch) >= 0) {
    return true;
  }
  return false;
};

export const filterSkillsByName = (skill: any, searchValue: string) => {
  if (!skill) {
    return false;
  }
  if (!searchValue){
    return true;
  }
  const name = skill.name?.toLowerCase() || "";
  const lowerCaseSearch = searchValue.toLowerCase();
  if (name.indexOf(lowerCaseSearch) >= 0) {
    return true;
  }
  return false;
};

export const filterWfmUserTable = (wfmUser: any, searchValue: string) => {
  if (!wfmUser) { return false; }

  if (!searchValue) { return true; }

  const firstName = wfmUser.FirstName?.toLowerCase() || "";
  const lastName = wfmUser.LastName?.toLowerCase() || "";
  const identity = wfmUser.Identity?.toLowerCase() || "";
  const email = wfmUser.Email?.toLowerCase() || "";
  const nNumber = wfmUser.EmploymentNumber?.toLowerCase() || "";
  const id = wfmUser.Id?.toLowerCase() || "";

  const lowerCaseSearch = searchValue.toLowerCase();

  if (firstName.indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (lastName.indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (identity.indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (email.indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (id.indexOf(lowerCaseSearch) >= 0) {
    return true;
  } else if (nNumber.indexOf(lowerCaseSearch) >= 0) {
    return true;
  }
  return false;
};