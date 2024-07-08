import {
  sortDialListEntriesByName,
  sortDirectoryListEntriesByName,
  sortGraphObjectsByPk,
  sortManagersByName,
  sortActivityByName,
  sortCallTagByName,
  sortQueueByName,
  sortProfilesById,
  sortProfilesByName,
  sortWorkersByFullName,
  sortWfmWorkersByFullName
} from "../_sortUtils";

describe("sortDialListEntriesByName", () => {
  const arr = [
    { contact_name: "cee" },
    { contact_name: "bee" },
    { contact_name: "ay" },
    { contact_name: "dee" },
    { contact_name: "ay" },
    { contact_name: "Cee again" },
    { contact_name: "B again" },
    { contact_name: "A caps" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortDialListEntriesByName)).toEqual([
      { contact_name: "A caps" },
      { contact_name: "ay" },
      { contact_name: "ay" },
      { contact_name: "B again" },
      { contact_name: "bee" },
      { contact_name: "cee" },
      { contact_name: "Cee again" },
      { contact_name: "dee" }
    ]);
  });
});

describe("sortDirectoryListEntriesByName", () => {
  const arr = [
    {
      first_name: "fred",
      last_name: "savage"
    },
    {
      first_name: "cee",
      last_name: "bee"
    },
    {
      first_name: "zee",
      last_name: "fee"
    },
    {
      first_name: "fee",
      last_name: "fee"
    },
    {
      first_name: "tom",
      last_name: "tom"
    }
  ];
  test("should return array in alphabetical order, last name then first name", () => {
    expect(arr.sort(sortDirectoryListEntriesByName)).toEqual([
      {
        first_name: "cee",
        last_name: "bee"
      },
      {
        first_name: "fee",
        last_name: "fee"
      },
      {
        first_name: "zee",
        last_name: "fee"
      },
      {
        first_name: "fred",
        last_name: "savage"
      },
      {
        first_name: "tom",
        last_name: "tom"
      }
    ]);
  });
});

describe("sortGraphObjectsByPk", () => {
  test("sorts by pk", () => {
    const result = [
      {
        pk: "Kaleigh",
        random: "data"
      },
      {
        pk: "Faith"
      },
      {
        pk: "What?"
      }
    ].sort(sortGraphObjectsByPk);
    expect(result).toEqual([
      {
        pk: "Faith"
      },
      {
        pk: "Kaleigh",
        random: "data"
      },
      {
        pk: "What?"
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
    { activity_name: "bee" },
    { activity_name: "dee" },
    { activity_name: "cee" },
    { activity_name: "ay" },
    { activity_name: "ay" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortActivityByName)).toEqual([
      { activity_name: "ay" },
      { activity_name: "ay" },
      { activity_name: "bee" },
      { activity_name: "cee" },
      { activity_name: "dee" }
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
describe("sortWorkersByFullName", () => {
  test("should return sorted array", () => {
    const list = [
      { attributes: { full_name: "Kaleigh Spurio" }},
      { attributes: { full_name: "Faith Cuneo" }},
      { attributes: { full_name: "Bob" }},
      { attributes: { full_name: "Michael Scott" }}
    ];
    expect(list.sort(sortWorkersByFullName)).toEqual([
      { attributes: { full_name: "Bob" }},
      { attributes: { full_name: "Faith Cuneo" }},
      { attributes: { full_name: "Kaleigh Spurio" }},
      { attributes: { full_name: "Michael Scott" }}
    ]);
  });
  test("When no name present, puts those last and should return sorted array", () => {
    const list = [
      { attributes: { full_name: "Kaleigh Spurio" }},
      { attributes: { full_name: "Faith Cuneo" }},
      { attributes: { full_name: "" }},
      { attributes: { full_name: "Bob" }},
      { attributes: { full_name: "Michael Scott" }}
    ];
    expect(list.sort(sortWorkersByFullName)).toEqual([
      { attributes: { full_name: "Bob" }},
      { attributes: { full_name: "Faith Cuneo" }},
      { attributes: { full_name: "Kaleigh Spurio" }},
      { attributes: { full_name: "Michael Scott" }},
      { attributes: { full_name: "" }}
    ]);
  });
});

describe("sortWfmWorkersByFullName", () => {
  test("should return sorted array by fullName", () => {
    const list = [
      {
        FirstName: "Kaleigh",
        LastName: "Spurio"
      },
      {
        FirstName: "Michael",
        LastName: "Scott"
      },
      {
        FirstName: "Faith",
        LastName: "Cuneo"
      },
      {
        FirstName: "Michael",
        LastName: "Scarn"
      }
    ];
    expect(list.sort(sortWfmWorkersByFullName)).toEqual([
      {
        FirstName: "Faith",
        LastName: "Cuneo"
      },
      {
        FirstName: "Kaleigh",
        LastName: "Spurio"
      },
      {
        FirstName: "Michael",
        LastName: "Scarn"
      },
      {
        FirstName: "Michael",
        LastName: "Scott"
      }
    ]);
  });
  test("should return sorted array by fullName", () => {
    const list = [
      {
        FirstName: "Kaleigh",
        LastName: "Spurio"
      },
      {
        FirstName: "",
        LastName: ""
      },
      {
        FirstName: "Faith",
        LastName: "Cuneo"
      },
      {
        FirstName: "Michael",
        LastName: "Scarn"
      }
    ];
    expect(list.sort(sortWfmWorkersByFullName)).toEqual([
      {
        FirstName: "Faith",
        LastName: "Cuneo"
      },
      {
        FirstName: "Kaleigh",
        LastName: "Spurio"
      },
      {
        FirstName: "Michael",
        LastName: "Scarn"
      },
      {
        FirstName: "",
        LastName: ""
      }
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