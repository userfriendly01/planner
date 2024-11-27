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
  loadSoftphoneConfigRelationships
} from "../profile";
import { apolloClient } from "components/core/Auth/SharedGraphAPIProvider";
import {
  mockAccessGroups, mockCallTagOptions, mockCallTags
} from "testUtils";
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

describe("loadSoftphoneConfigRelationships", () => {
  const profiles = [
    {
      profile_id: 1,
      profile_name: "BSC"
    },
    {
      profile_id: 2,
      profile_name: "AISG"
    },
    {
      profile_id: 3,
      profile_name: "BUTTS"
    }
  ];
  const profileContext = {
    profiles,
    accessGroups: mockAccessGroups
  };
  const profileData2 = {
    profile: {
      access_group: mockAccessGroups[0],
      call_tags: mockCallTags,
      activities: [{
        sk: "Activity#1",
        activity_name: "Activity 1",
        available: true
      }],
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
    loadSoftphoneConfigRelationships(profileContext, mockedDispatch, mockCallback).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          calltags: mockCallTagOptions,
          accessGroups: [
            {
              ...mockAccessGroups[0],
              viewable_profiles: [
                "1-BSC",
                "2-AISG",
                "3-BUTTS"
              ]
            },
            {
              ...mockAccessGroups[1],
              viewable_profiles: []
            }
          ],
          profiles: [{
            profile_id: 1,
            profile_name: "BSC",
            access_group: mockAccessGroups[0],
            activities: [{
              sk: "Activity#1",
              activity_name: "Activity 1 (A)",
              available: true
            }],
            call_tags: mockCallTags,
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            profile_name: "AISG",
            access_group: mockAccessGroups[0],
            activities: [{
              sk: "Activity#1",
              activity_name: "Activity 1 (A)",
              available: true
            }],
            call_tags: mockCallTags,
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 3,
            profile_name: "BUTTS",
            access_group: mockAccessGroups[0],
            activities: [{
              sk: "Activity#1",
              activity_name: "Activity 1 (A)",
              available: true
            }],
            call_tags: mockCallTags,
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
    loadSoftphoneConfigRelationships(profileContext, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          calltags: mockCallTagOptions,
          accessGroups: [
            {
              ...mockAccessGroups[0],
              viewable_profiles: [
                "1-BSC",
                "3-BUTTS"
              ]
            },
            {
              ...mockAccessGroups[1],
              viewable_profiles: []
            }
          ],
          profiles: [{
            profile_id: 1,
            profile_name: "BSC",
            access_group: mockAccessGroups[0],
            call_tags: mockCallTags,
            activities: [{
              sk: "Activity#1",
              activity_name: "Activity 1 (A)",
              available: true
            }],
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            profile_name: "AISG"
          },
          {
            profile_id: 3,
            profile_name: "BUTTS",
            access_group: mockAccessGroups[0],
            call_tags: mockCallTags,
            activities: [{
              sk: "Activity#1",
              activity_name: "Activity 1 (A)",
              available: true
            }],
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
    loadSoftphoneConfigRelationships(profileContext, mockedDispatch).then(() => {
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        type: "loadProfileOptions",
        payload: {
          accessGroups: [
            {
              ...mockAccessGroups[0],
              viewable_profiles: [
                "1-BSC",
                "3-BUTTS"
              ]
            },
            {
              ...mockAccessGroups[1],
              viewable_profiles: []
            }
          ],
          calltags: mockCallTagOptions,
          profiles: [{
            profile_id: 1,
            profile_name: "BSC",
            access_group: mockAccessGroups[0],
            activities: [{
              sk: "Activity#1",
              activity_name: "Activity 1 (A)",
              available: true
            }],
            call_tags: mockCallTags,
            directoryNumbers: [{ sk: "DirectoryNumber#1" }],
            dialListNumbers: [{ sk: "QuickDialNumber#1" }]
          },
          {
            profile_id: 2,
            profile_name: "AISG"
          },
          {
            profile_id: 3,
            profile_name: "BUTTS",
            access_group: mockAccessGroups[0],
            activities: [{
              sk: "Activity#1",
              activity_name: "Activity 1 (A)",
              available: true
            }],
            call_tags: mockCallTags,
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