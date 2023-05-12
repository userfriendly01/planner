export const filterWorkerSearch = (worker, searchValue, state) => {
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
  const profile = state.profileContext.profiles.find(p => p.profile_id === worker.attributes.profile_id);
  console.log(profile);
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

export const filterSkillsByName = (skill, searchValue) => {
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

export const findOuFromProfile = (profileId, profileList) => {
  const formattedProfileId = typeof profileId !== "string" ? profileId.toString() : profileId;
  const profile = profileList.find(p => (typeof p.profile_id !== "string" ? p.profile_id.toString() : p.profile_id ) === formattedProfileId);
  const profileOu = profile ? profile.operating_unit_nme?.toLowerCase() : "";
  return profileOu;
};