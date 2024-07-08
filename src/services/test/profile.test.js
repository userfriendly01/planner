import {
  createAccessGroup,
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
import { apolloClient } from "components/core/Auth/SharedGraphAPIProvider";
import { logger } from "utils/logger";

jest.mock("components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

const mockedDispatch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const profileRes1 = {
  profiles: { items: [ { profile_id: 1 }]},
  screenpops: { items: [{ sk: "Screenpop#1" }]},
  accessGroups: { items: [{ sk: "AccessGroup#1" }]},
  activities: { items: [{ sk: "Activity#1" }]},
  directoryEntries: { items: [{ thing: "hi" }]},
  dialListEntries: { items: [{ cool: "beans" }]}
};

describe("listUMSoftphoneConfigs", () => {
  test("getPageResults is successful and returns no next token", done => {
    apolloClient.query.mockResolvedValueOnce({ data: profileRes1 });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          profiles: [ { profile_id: 1 }],
          screenpops: [{ sk: "Screenpop#1" }],
          accessGroups: [{ sk: "AccessGroup#1" }],
          activities: [{ sk: "Activity#1" }],
          directoryEntries: [{ thing: "hi" }],
          dialListEntries: [{ cool: "beans" }]
        }
      });
      done();
    });
  });
  test("getPageResults is successful and returns next token on profiles", done => {
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
          screenpops: [{ sk: "Screenpop#1" }],
          accessGroups: [{ sk: "AccessGroup#1" }],
          activities: [{ sk: "Activity#1" }],
          dialListEntries: [{ cool: "beans" }],
          directoryEntries: [{ thing: "hi" }]
        }
      });
      done();
    });
  });
  test("getPageResults is successful and returns next token on screenpops", done => {
    const nextOnScreenpops = {
      ...profileRes1,
      screenpops: {
        ...profileRes1.screenpops,
        nextToken: "nextToken"
      }
    };
    apolloClient.query.mockResolvedValueOnce({ data: nextOnScreenpops }).mockResolvedValueOnce({
      data: {
        screenpops: { items: [{ sk: "Screenpop#2" }]}
      }
    });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(2);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      done();
    });
  });
  test("getPageResults is successful and returns next token on accessgroups", done => {
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
      done();
    });
  });
  test("getPageResults is successful and returns next token on activities", done => {
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
      done();
    });
  });
  test("getPageResults is successful and returns next token on directory", done => {
    const nextOnDirectories = {
      ...profileRes1,
      directoryEntries: {
        ...profileRes1.directoryEntries,
        nextToken: "nextToken"
      }
    };
    apolloClient.query.mockResolvedValueOnce({ data: nextOnDirectories }).mockResolvedValueOnce({
      data: {
        directoryEntries: { items: [{ sk: "DirectoryNumber#2" }]}
      }
    });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(2);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      done();
    });
  });
  test("getPageResults is successful and returns next token on dialListEntries", done => {
    const nextOnDialList = {
      ...profileRes1,
      dialListEntries: {
        ...profileRes1.dialListEntries,
        nextToken: "nextToken"
      }
    };
    apolloClient.query.mockResolvedValueOnce({ data: nextOnDialList }).mockResolvedValueOnce({
      data: {
        dialListEntries: { items: [{ sk: "QuickDialNumber#2" }]}
      }
    });
    listUMSoftphoneConfigs(mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(2);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      done();
    });
  });
  test("errors on query response, throws error", done => {
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
      done();
    });

  });
  test("apollo throws an error, throws error", done => {
    apolloClient.query.mockRejectedValueOnce("yikes!");
    listUMSoftphoneConfigs(mockedDispatch).catch(err => {
      expect(err).toEqual("yikes!");
      expect(mockedDispatch).toHaveBeenCalledTimes(0);
      expect(apolloClient.query).toHaveBeenCalledTimes(1);
      done();
    });

  });
});

describe("loadSoftphoneConfigRelationships", () => {
  const profiles = [
    { profile_id: 1 },
    {
      profile_id: 2
    },
    { profile_id: 3 }
  ];
  const profileData2 = {
    profile: {
      accessGroup: null,
      activities: [{ sk: "Activity#1" }],
      directoryNumbers: [{ sk: "DirectoryNumber#1" }],
      dialListNumbers: [{ sk: "QuickDialNumber#1" }]
    }
  };
  test("successful queries, queries all profiles and dispatches results", done => {
    apolloClient.query.mockResolvedValueOnce({
      data: {
        profile: {
          ...profiles[0],
          ...profileData2.profile
        }
      }
    });
    apolloClient.query.mockResolvedValueOnce({
      data: {
        profile: {
          ...profiles[1],
          ...profileData2.profile
        }
      }
    });
    apolloClient.query.mockResolvedValueOnce({
      data: {
        profile: {
          ...profiles[2],
          ...profileData2.profile
        }
      }
    });
    const mockCallback = jest.fn();
    loadSoftphoneConfigRelationships(profiles, mockedDispatch, mockCallback).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          profiles: [{
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
          }]
        }
      });
      expect(mockCallback).toHaveBeenCalled();
      done();
    });
  });
  test("apolloclient query throws error, logs error, returns formated profile", done => {
    apolloClient.query.mockResolvedValueOnce({
      data: {
        profile: {
          ...profiles[0],
          ...profileData2.profile
        }
      }
    });
    apolloClient.query.mockRejectedValueOnce({ message: "error!" });
    apolloClient.query.mockResolvedValueOnce({
      data: {
        profile: {
          ...profiles[2],
          ...profileData2.profile
        }
      }
    });
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          profiles: [{
            profile_id: 1,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2
          },
          {
            profile_id: 3,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          }]
        }
      } );
      expect(logger.error).toHaveBeenCalledWith("Error thrown getting profile relationship items for profile 2", { message: "error!" });
      done();
    });
  });
  test("query has errors on response, logs error, returns formatted profile", done => {
    const errors = [{
      message: "error!",
      errorType: "what"
    }];
    apolloClient.query.mockResolvedValueOnce({
      data: {
        profile: {
          ...profiles[0],
          ...profileData2.profile
        }
      }
    });
    apolloClient.query.mockResolvedValueOnce({
      data: null,
      errors
    });
    apolloClient.query.mockResolvedValueOnce({
      data: {
        profile: {
          ...profiles[2],
          ...profileData2.profile
        }
      }
    });
    loadSoftphoneConfigRelationships(profiles, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          profiles: [{
            profile_id: 1,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2
          },
          {
            profile_id: 3,
            accessGroup: null,
            activities: [{ sk: "Activity#1" }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          }]
        }
      });
      expect(logger.error).toHaveBeenCalledWith("Error thrown getting profile relationship items for profile 2", errors);
      done();
    });
  });
});

describe("createProfile", () => {
  const profileInput = {
    profile_id: 1,
    profile_name: "test profile"
  };
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    createProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    createProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("editProfile", () => {
  const profileInput = {
    profile_name: "New name"
  };
  test("query is successful, returns profile data", done  => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    editProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    editProfile(profileInput).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("deleteProfile", () => {
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    deleteProfile(1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    deleteProfile(1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("createDialListEntry", () => {
  const entry = {
    profile_id: 1,
    contact_num: "1231231234"
  };
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    createDialListEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    createDialListEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("editDialListEntry", () => {
  const entry = {
    contact_num: "8675309"
  };
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    editDialListEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    editDialListEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("deleteDialListEntry", () => {
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    deleteDialListEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    deleteDialListEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("createDirectoryEntry", () => {
  const entry = {
    directory_num: "8675309",
    first_name: "Jenny",
    profile_id: 1
  };
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    createDirectoryEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    createDirectoryEntry(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("editDirectoryEntry", () => {
  const entry = {
    directory_num: "5551234",
    first_name: "Michael",
    last_name: "Scott"
  };
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    editDirectoryEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    editDirectoryEntry("id", 1, entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("deleteDirectoryEntry", () => {
  test("query is successful, returns profile data", done => {
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
      done();
    });
  });
  test("query contains errors, throws error", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    deleteDirectoryEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    deleteDirectoryEntry("id", 1).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});

describe("createAccessGroup", () => {
  const payload = {
    access_group_name: "access group 1",
    twilio_dashboard_url: "twilio.com"
  };
  test("query is successful, returns accessgroup data", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        accessGroup: {
          pk: "AccessGroup#1",
          sk: "AccessGroup#1",
          id: "123",
          ...payload
        }
      }
    });
    createAccessGroup(payload).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        pk: "AccessGroup#1",
        sk: "AccessGroup#1",
        id: "123",
        ...payload
      });
      done();
    });
  });
  test("query res contains errors, throws errors", done => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    createAccessGroup(payload).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
      done();
    });
  });
  test("apolloClient query rejects, throws error", done => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    createAccessGroup().catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
      done();
    });
  });
});