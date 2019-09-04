import {
  initialState,
  reducer
} from "context";

describe("the reducer", () => {
  test("an invalid action should no do nothing", () => {
    const action = {
      type: "bad",
      payload: "irrelevant"
    };
    const result = reducer(initialState, action);
    expect(result).toBe(initialState);
  });
  test("add manager should add to the managers array", () => {
    const payload = {
      manager_first_name: "joe",
      manager_last_name: "smith",
      manager_n_number: "n1234657"
    };
    const action = {
      type: "addManager",
      payload: {
        manager: [payload]
      }
    };
    const initialManager = [
      {
        manager_first_name: "frank",
        manager_last_name: "smith",
        manager_n_number: "n7685955"
      }
    ];
    const testState = {
      ...initialState,
      managerContext: {
        managers: initialManager
      }
    };
    const result = reducer(testState, action);
    expect(result.managerContext.managers).toEqual([...initialManager, [payload]]);
  });
  test("add worker should add to the workers array", () => {
    const payload = {
      attributes: {
        manager_first_name: "test",
        manager_last_name: "fun"
      },
      id: "n1234556"
    };
    const action = {
      type: "addWorker",
      payload
    };
    const initialWorkers = [
      {
        attributes: {
          manager_first_name: "frank",
          manager_last_name: "smith"
        },
        id: "n7685955"
      }
    ];
    const testState = {
      ...initialState,
      workerContext: {
        workers: initialWorkers
      }
    };
    const result = reducer(testState, action);
    expect(result.workerContext.workers).toEqual([...initialWorkers, payload]);
  });
  test("loadManager should initialize or reinitialize the managers array", () => {
    const payload = [
      {
        manager_first_name: "joe",
        manager_last_name: "smith",
        manager_n_number: "n1234657"
      }
    ];
    const action = {
      type: "loadManagers",
      payload
    };
    const result = reducer(initialState, action);
    expect(result.managerContext.managers).toEqual(payload);
  });
  test("loadProfiles should initialize or reinitialize the profiles array", () => {
    const payload = [
      {
        profile_id: 1,
        profile_nme: "smith"
      }
    ];
    const action = {
      type: "loadProfiles",
      payload
    };
    const result = reducer(initialState, action);
    expect(result.profileContext.profiles).toEqual(payload);
  });
  test("loadWorkers should initialize or reinitialize the workers array", () => {
    const payload = [
      {
        workerName: "joe smith",
        workerNNum: "n1234657"
      }
    ];
    const action = {
      type: "loadWorkers",
      payload
    };
    const result = reducer(initialState, action);
    expect(result.workerContext.workers).toEqual(payload);
  });
  test("loadUserData should initialize or reinitialize the user data", () => {
    const payload = {
      name: "Test",
      nNum: "n1234345",
      groupsArr: ["developers"]
    };
    const action = {
      type: "loadUserData",
      payload
    };
    const result = reducer(initialState, action);
    expect(result.userContext).toEqual(payload);
  });
});