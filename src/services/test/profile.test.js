import {
  createDialListEntry,
  createDirectoryEntry,
  createProfile,
  editDialListEntry,
  editDirectoryEntry,
  editProfile,
  deleteDialListEntry,
  deleteDirectoryEntry,
  deleteProfile,
  listUMSoftphoneConfigs,
  loadSoftphoneConfigRelationships
} from "../profile";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apolloClient } from "components/core/Auth/SharedGraphAPIProvider";
import { logger } from "utils/logger";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

const mockedDispatch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

const profileRes1 = {
  profiles: { items: [ { profile_id: 1 }]},
  screenPops: { items: [{ sk: "Screenpop#1" }]},
  accessGroups: { items: [{ sk: "AccessGroup#1" }]},
  activities: { items: [{ sk: "Activity#1" }]},
  directoryEntries: { items: [{ thing: "hi" }]},
  dialListEntries: { items: [{ cool: "beans" }]}
};

describe("listUMSoftphoneConfigs", () => {
  test("getPageResults is successful and returns no next token", async () => {
    apolloClient.query.mockResolvedValueOnce({ data: profileRes1 });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          profiles: [ { profile_id: 1 }],
          screenPops: [{ sk: "Screenpop#1" }],
          accessGroups: [{ sk: "AccessGroup#1" }],
          activities: [{ sk: "Activity#1" }],
          directoryEntries: [{ thing: "hi" }],
          dialListEntries: [{ cool: "beans" }]
        }
      });
    });
  });
  test("getPageResults is successful and returns next token on profiles", async () => {
    const nextOnProfiles = {
      ...profileRes1,
      profiles: {
        ...profileRes1.profiles,
        nextToken: "nextToken"
      }
    };
    apolloClient.query.mockResolvedValueOnce({ data: nextOnProfiles }).mockResolvedValueOnce({
      data: {
        profiles: { items: [{ profile_id: 2 }]}
      }
    });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(2);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          profiles: [ { profile_id: 1 }, { profile_id: 2 }],
          screenPops: [{ sk: "Screenpop#1" }],
          accessGroups: [{ sk: "AccessGroup#1" }],
          activities: [{ sk: "Activity#1" }],
          dialListEntries: [{ cool: "beans" }],
          directoryEntries: [{ thing: "hi" }]
        }
      });
    });
  });
  test("getPageResults is successful and returns next token on screenpops", async () => {
    const nextOnScreenpops = {
      ...profileRes1,
      screenPops: {
        ...profileRes1.screenPops,
        nextToken: "nextToken"
      }
    };
    apolloClient.query.mockResolvedValueOnce({ data: nextOnScreenpops }).mockResolvedValueOnce({
      data: {
        screenPops: { items: [{ sk: "Screenpop#2" }]}
      }
    });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(2);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });
  test("getPageResults is successful and returns next token on accessgroups", async () => {
    const nextOnAccessGroup = {
      ...profileRes1,
      accessGroups: {
        ...profileRes1.accessGroups,
        nextToken: "nextToken"
      }
    };
    apolloClient.query.mockResolvedValueOnce({ data: nextOnAccessGroup }).mockResolvedValueOnce({
      data: {
        accessGroups: { items: [{ sk: "AccessGroup#2" }]}
      }
    });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(2);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });
  test("getPageResults is successful and returns next token on accessgroups", async () => {
    const nextOnActivities = {
      ...profileRes1,
      activities: {
        ...profileRes1.activities,
        nextToken: "nextToken"
      }
    };
    apolloClient.query.mockResolvedValueOnce({ data: nextOnActivities }).mockResolvedValueOnce({
      data: {
        activities: { items: [{ sk: "Activity#2" }]}
      }
    });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(2);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });
  test("errors on query response, throws error", async () => {
    apolloClient.query.mockResolvedValueOnce({
      data: profileRes1,
      errors: [{ message: "oh no!" }]
    });
    listUMSoftphoneConfigs(mockedDispatch).catch(err => {
      expect(err).toEqual([{
        message: "oh no!"
      }]);
      expect(mockedDispatch).toHaveBeenCalledTimes(0);
      expect(apolloClient.query).toHaveBeenCalledTimes(1);
    });

  });
  test("apollo throws an error, throws error", async () => {
    apolloClient.query.mockRejectedValueOnce("yikes!");
    listUMSoftphoneConfigs(mockedDispatch).catch(err => {
      expect(err).toEqual("yikes!");
      expect(mockedDispatch).toHaveBeenCalledTimes(0);
      expect(apolloClient.query).toHaveBeenCalledTimes(1);
    });

  });
});

describe("loadSoftphoneConfigRelationships", () => {

  const profiles = [
    { profile_id: 1 },
    { profile_id: 2 },
    { profile_id: 3 }
  ];
  const profileData1 = {
    accessGroup: {},
    activities: {
      items: [{ sk: "Activity#0" }],
      nextToken: "nextToken"
    },
    directoryNumbers: {
      items: [{ sk: "DirectoryNumber#0" }],
      nextToken: "nextToken"
    },
    dialListNumbers: {
      items: [{ sk: "QuickDialNumber#0" }],
      nextToken: "nextToken"
    }
  };
  const profileData2 = {
    activities: { items: [{ sk: "Activity#1" }]},
    directoryNumbers: { items: [{ sk: "DirectoryNumber#1" }]},
    dialListNumbers: { items: [{ sk: "QuickDialNumber#1" }]}
  };
  test("successful queries, no nextTokens involved, queries all profiles and dispatches results", () => {
    apolloClient.query.mockResolvedValue({ data: profileData2 });
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type: "UMSoftphoneConfiguration",
          results: [{
            profile_id: 1,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 3,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          }],
          isFirstPage: true
        }
      });
    });
  });
  test("successful queries, only one profile returns next token, queries all profiles and dispatches results", () => {
    const profileWithAG = {
      ...profileData1,
      accessGroup: {
        sk: "AccessGroup#1"
      }
    };
    apolloClient.query
      .mockResolvedValueOnce({ data: profileWithAG })
      .mockResolvedValue({ data: profileData2 });
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(4);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type: "UMSoftphoneConfiguration",
          results: [{
            profile_id: 1,
            accessGroup: { sk: "AccessGroup#1" },
            activities: [{ sk: "Activity#0" }, { sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#0" }, { sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#0" }, { sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 3,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          }],
          isFirstPage: true
        }
      });
    });
  });
  test("successful queries, nextTokens are present on activities, queries all profiles and dispatches results", () => {
    const testData = {
      ...profileData1
    };
    testData.dialListNumbers.nextToken = null;
    testData.directoryNumbers.nextToken = null;
    apolloClient.query
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValue({ data: { activities: { items: [{ sk: "Activity#1" }]}}});
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(6);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type: "UMSoftphoneConfiguration",
          results: [{
            profile_id: 1,
            accessGroup: {},
            activities: [{ sk: "Activity#0" }, { sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#0" }],
            dialListNumbers: [{ sk: "QuickDialNumber#0" }]
          },
          {
            profile_id: 2,
            accessGroup: {},
            activities: [{ sk: "Activity#0" }, { sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#0" }],
            dialListNumbers: [{ sk: "QuickDialNumber#0" }]
          },
          {
            profile_id: 3,
            accessGroup: {},
            activities: [{ sk: "Activity#0" }, { sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#0" }],
            dialListNumbers: [{ sk: "QuickDialNumber#0" }]
          }],
          isFirstPage: true
        }
      });
    });
  });
  test("successful queries, nextTokens are present on dialListNumbers, queries all profiles and dispatches results", () => {
    const testData = {
      ...profileData1
    };
    testData.activities.nextToken = null;
    testData.dialListNumbers.nextToken = "token";
    testData.directoryNumbers.nextToken = null;
    apolloClient.query
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: { dialListNumbers: { items: [{ sk: "QuickDialNumber#1" }]}}});
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(6);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });
  test("successful queries, nextTokens are present on directoryNumbers, queries all profiles and dispatches results", () => {
    const testData = {
      ...profileData1
    };
    testData.activities.nextToken = null;
    testData.directoryNumbers.nextToken = "nextToken";
    testData.dialListNumbers.nextToken = null;
    apolloClient.query
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: testData })
      .mockResolvedValueOnce({ data: { directoryNumbers: { items: [{ sk: "DirectoryNumber#1" }]}}});
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(6);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });
  test("apolloclient query throws error, logs error, returns formated profile", () => {
    apolloClient.query
      .mockResolvedValueOnce({ data: profileData2 })
      .mockRejectedValueOnce("error!")
      .mockResolvedValueOnce({ data: profileData2 });
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type: "UMSoftphoneConfiguration",
          results: [{
            profile_id: 1,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            accessGroup: null,
            activities: [],
            directoryNumbers: [],
            dialListNumbers: []
          },
          {
            profile_id: 3,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          }],
          isFirstPage: true
        }
      });
      expect(logger.error).toHaveBeenCalledWith("Error thrown getting profile relationship items for profile 2", "error!");
    });
  });
  test("query has NOT_FOUND errors on response, ignores error, returns formatted profiles from queries", () => {
    apolloClient.query
      .mockResolvedValueOnce({ data: profileData2 })
      .mockResolvedValueOnce({
        data: profileData2,
        errors: [{ errorType: "NOT_FOUND" }]
      })
      .mockResolvedValueOnce({ data: profileData2 });
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type: "UMSoftphoneConfiguration",
          results: [{
            profile_id: 1,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 3,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          }],
          isFirstPage: true
        }
      });
      expect(logger.error).toHaveBeenCalledTimes(0);
    });
  });
  test("query has errors on response, logs error, returns formatted profile", () => {
    const errors = [{
      message: "error!",
      errorType: "what"
    }];
    apolloClient.query
      .mockResolvedValueOnce({ data: profileData2 })
      .mockResolvedValueOnce({
        data: null,
        errors
      })
      .mockResolvedValueOnce({ data: profileData2 });
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type: "UMSoftphoneConfiguration",
          results: [{
            profile_id: 1,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            accessGroup: null,
            activities: [],
            directoryNumbers: [],
            dialListNumbers: []
          },
          {
            profile_id: 3,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          }],
          isFirstPage: true
        }
      });
      expect(logger.error).toHaveBeenCalledWith("Error thrown getting profile relationship items for profile 2", errors);
    });
  });
});

describe("createProfile", () => {
  const profileInput = {
    profile_id: 1,
    profile_name: "test profile"
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        profile: {
          ...profileInput,
          pk: "Profile#1",
          sk: "SoftphoneConfiguration#1"
        }
      }
    });
    createProfile(profileInput).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "SoftphoneConfiguration#1",
        profile_id: 1,
        profile_name: "test profile"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    createProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    createProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("editProfile", () => {
  const profileInput = {
    profile_name: "New name"
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        profile: {
          ...profileInput,
          profile_id: 1,
          pk: "Profile#1",
          sk: "SoftphoneConfiguration#1"
        }
      }
    });
    editProfile(profileInput).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "SoftphoneConfiguration#1",
        profile_id: 1,
        profile_name: "New name"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    editProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    editProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("deleteProfile", () => {
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        profile: {
          profile_id: 1,
          pk: "Profile#1",
          sk: "SoftphoneConfiguration#1",
          profile_name: "Coolest Profile"
        }
      }
    });
    deleteProfile(1).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "SoftphoneConfiguration#1",
        profile_id: 1,
        profile_name: "Coolest Profile"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    deleteProfile(1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    deleteProfile(1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("createDialListEntry", () => {
  const entry = {
    profile_id: 1,
    contact_num: "1231231234"
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        dialListEntry: {
          pk: "Profile#1",
          sk: "QuickDialNumber#1",
          contact_num: "1231231234"
        }
      }
    });
    createDialListEntry(entry).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "QuickDialNumber#1",
        contact_num: "1231231234"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    createDialListEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    createDialListEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("editDialListEntry", () => {
  const entry = {
    contact_num: "8675309"
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        dialListEntry: {
          pk: "Profile#1",
          sk: "QuickDialNumber#1",
          contact_num: "8675309"
        }
      }
    });
    editDialListEntry("id", 1, entry).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "QuickDialNumber#1",
        contact_num: "8675309"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    editDialListEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    editDialListEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("deleteDialListEntry", () => {
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        dialListEntry: {
          pk: "Profile#1",
          sk: "QuickDialNumber#1",
          contact_num: "8675309"
        }
      }
    });
    deleteDialListEntry("id", 1).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "QuickDialNumber#1",
        contact_num: "8675309"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    deleteDialListEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    deleteDialListEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("createDirectoryEntry", () => {
  const entry = {
    directory_num: "8675309",
    first_name: "Jenny",
    profile_id: 1
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        directoryEntry: {
          pk: "Profile#1",
          sk: "DirectoryNumber#1",
          directory_num: "8675309",
          first_name: "Jenny",
          profile_id: 1
        }
      }
    });
    createDirectoryEntry(entry).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "DirectoryNumber#1",
        directory_num: "8675309",
        first_name: "Jenny",
        profile_id: 1
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    createDirectoryEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    createDirectoryEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("editDirectoryEntry", () => {
  const entry = {
    directory_num: "5551234",
    first_name: "Michael",
    last_name: "Scott"
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        directoryEntry: {
          pk: "Profile#1",
          sk: "DirectoryNumber#1",
          directory_num: "5551234",
          first_name: "Michael",
          last_name: "Scott"
        }
      }
    });
    editDirectoryEntry("id", 1, entry).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "DirectoryNumber#1",
        directory_num: "5551234",
        first_name: "Michael",
        last_name: "Scott"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    editDirectoryEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    editDirectoryEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

describe("deleteDirectoryEntry", () => {
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        directoryEntry: {
          pk: "Profile#1",
          sk: "DirectoryNumber#1",
          directory_num: "5551234",
          first_name: "Michael",
          last_name: "Scott"
        }
      }
    });
    deleteDirectoryEntry("id", 1).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "Profile#1",
        sk: "DirectoryNumber#1",
        directory_num: "5551234",
        first_name: "Michael",
        last_name: "Scott"
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    deleteDirectoryEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    deleteDirectoryEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});