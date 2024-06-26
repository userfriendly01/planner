import {
  sortDialListEntriesByName,
  sortDirectoryListEntriesByName,
  sortManagersByName,
  sortActivityByName,
  sortCallTagByName,
  sortQueueByName,
  sortProfilesById,
  sortProfilesByName
} from "../_sortUtils";

describe("sortDialListEntriesByName", () => {
  const arr = [
    { contact_nme: "cee" },
    { contact_nme: "bee" },
    { contact_nme: "ay" },
    { contact_nme: "dee" },
    { contact_nme: "ay" },
    { contact_nme: "Cee again" },
    { contact_nme: "B again" },
    { contact_nme: "A caps" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortDialListEntriesByName)).toEqual([
      { contact_nme: "A caps" },
      { contact_nme: "ay" },
      { contact_nme: "ay" },
      { contact_nme: "B again" },
      { contact_nme: "bee" },
      { contact_nme: "cee" },
      { contact_nme: "Cee again" },
      { contact_nme: "dee" }
    ]);
  });
});

describe("sortDirectoryListEntriesByName", () => {
  const arr = [
    {
      first_nme: "fred",
      last_nme: "savage"
    },
    {
      first_nme: "cee",
      last_nme: "bee"
    },
    {
      first_nme: "zee",
      last_nme: "fee"
    },
    {
      first_nme: "fee",
      last_nme: "fee"
    },
    {
      first_nme: "tom",
      last_nme: "tom"
    }
  ];
  test("should return array in alphabetical order, last name then first name", () => {
    expect(arr.sort(sortDirectoryListEntriesByName)).toEqual([
      {
        first_nme: "cee",
        last_nme: "bee"
      },
      {
        first_nme: "fee",
        last_nme: "fee"
      },
      {
        first_nme: "zee",
        last_nme: "fee"
      },
      {
        first_nme: "fred",
        last_nme: "savage"
      },
      {
        first_nme: "tom",
        last_nme: "tom"
      }
    ]);
  });
});

describe("sortManagersByName", () => {
  const managerList = [
    {
      manager_n_number: "n0333333",
      manager_first_name: "Mike",
      manager_last_name: "Tyson"
    },
    {
      manager_n_number: "n0666666",
      manager_first_name: "Muhammad",
      manager_last_name: "Smith"
    },
    {
      manager_n_number: "n0555555",
      manager_first_name: "Muhammad",
      manager_last_name: "Jones"
    },
    {
      manager_n_number: "n0222222",
      manager_first_name: "Joe",
      manager_last_name: "Fraiser"
    },
    {
      manager_n_number: "n0444444",
      manager_first_name: "Muhammad",
      manager_last_name: "Ali"
    },
    {
      manager_n_number: "n0333333",
      manager_first_name: "Mike",
      manager_last_name: "Tyson"
    },
    {
      manager_n_number: "n0111111",
      manager_first_name: "George",
      manager_last_name: "Foreman"
    }
  ];

  test("should return managers sorted by name", () => {
    expect(managerList.sort(sortManagersByName)).toEqual([
      {
        manager_n_number: "n0111111",
        manager_first_name: "George",
        manager_last_name: "Foreman"
      },
      {
        manager_n_number: "n0222222",
        manager_first_name: "Joe",
        manager_last_name: "Fraiser"
      },
      {
        manager_n_number: "n0333333",
        manager_first_name: "Mike",
        manager_last_name: "Tyson"
      },
      {
        manager_n_number: "n0333333",
        manager_first_name: "Mike",
        manager_last_name: "Tyson"
      },
      {
        manager_n_number: "n0444444",
        manager_first_name: "Muhammad",
        manager_last_name: "Ali"
      },
      {
        manager_n_number: "n0555555",
        manager_first_name: "Muhammad",
        manager_last_name: "Jones"
      },
      {
        manager_n_number: "n0666666",
        manager_first_name: "Muhammad",
        manager_last_name: "Smith"
      }
    ]);
  });
});

describe("sortActivityByName", () => {
  const arr = [
    { activity_nme: "bee" },
    { activity_nme: "dee" },
    { activity_nme: "cee" },
    { activity_nme: "ay" },
    { activity_nme: "ay" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortActivityByName)).toEqual([
      { activity_nme: "ay" },
      { activity_nme: "ay" },
      { activity_nme: "bee" },
      { activity_nme: "cee" },
      { activity_nme: "dee" }
    ]);
  });
});

describe("sortCallTagByName", () => {
  const arr = [
    { wrkr_tsk_info_nme: "bee" },
    { wrkr_tsk_info_nme: "dee" },
    { wrkr_tsk_info_nme: "cee" },
    { wrkr_tsk_info_nme: "ay" },
    { wrkr_tsk_info_nme: "ay" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortCallTagByName)).toEqual([
      { wrkr_tsk_info_nme: "ay" },
      { wrkr_tsk_info_nme: "ay" },
      { wrkr_tsk_info_nme: "bee" },
      { wrkr_tsk_info_nme: "cee" },
      { wrkr_tsk_info_nme: "dee" }
    ]);
  });
});

describe("sortQueueByName", () => {
  const arr = [
    { ctmSkillDisplayName: "bee" },
    { ctmSkillDisplayName: "dee" },
    { ctmSkillDisplayName: "cee" },
    { ctmSkillDisplayName: "ay" },
    { ctmSkillDisplayName: "ay" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortQueueByName)).toEqual([
      { ctmSkillDisplayName: "ay" },
      { ctmSkillDisplayName: "ay" },
      { ctmSkillDisplayName: "bee" },
      { ctmSkillDisplayName: "cee" },
      { ctmSkillDisplayName: "dee" }
    ]);
  });
});

describe("sortProfilesById", () => {
  const profiles = [
    { profile_id: 2 },
    { profile_id: 1 },
    { profile_id: 9 },
    { profile_id: 8 },
    { profile_id: 3 },
    { profile_id: 4 },
    { profile_id: 5 },
    { profile_id: 6 },
    { profile_id: 7 }
  ];
  test("should return array in numerical order", () => {
    expect(profiles.sort(sortProfilesById)).toEqual([
      { profile_id: 1 },
      { profile_id: 2 },
      { profile_id: 3 },
      { profile_id: 4 },
      { profile_id: 5 },
      { profile_id: 6 },
      { profile_id: 7 },
      { profile_id: 8 },
      { profile_id: 9 }
    ]);
  });
});

describe("sortProfilesByName", () => {
  const profiles = [
    { profile_name: "AISG" },
    { profile_name: "Premium Audit" },
    { profile_name: "CSO" },
    { profile_name: "GRS Claims" },
    { profile_name: "PAL1" }
  ];
  test("should return array in alphebetical order", () => {
    expect(profiles.sort(sortProfilesByName)).toEqual([
      { profile_name: "AISG" },
      { profile_name: "CSO" },
      { profile_name: "GRS Claims" },
      { profile_name: "PAL1" },
      { profile_name: "Premium Audit" }
    ]);
  });
});