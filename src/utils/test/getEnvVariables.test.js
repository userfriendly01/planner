import MockAdapter from "axios-mock-adapter";
import {
  env, getEnvVariables
} from "../getEnvVariables";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const getEnvVarsEndpoint = "/triton-admin/config/env";

// Suppresses global mock
jest.mock("../getEnvVariables", () => ({
  ...jest.requireActual("../getEnvVariables")
}));

describe("getEnvVariables", () => {
  afterEach(() => {
    delete process.env.APP_ENV;

    jest.clearAllMocks();
    env.clear();
    axiosMock.reset();
  });

  test("should return the process.env variables when in a local env", async () => {
    process.env.APP_ENV = "local";

    await getEnvVariables();

    expect(axiosMock.history.get.length).toEqual(0);
  });

  test("successfully gets variables", async () => {
    axiosMock.onGet(getEnvVarsEndpoint).replyOnce(200, {
      A_VARIABLE: "Hi"
    });

    const variables = await getEnvVariables();

    expect(variables.get("A_VARIABLE")).toEqual("Hi");
  });

  test("returns already queried variables", async () => {
    axiosMock.onGet(getEnvVarsEndpoint).replyOnce(200, {
      A_VARIABLE: "Hi"
    });

    await getEnvVariables();

    const variables = await getEnvVariables();

    expect(axiosMock.history.get.length).toEqual(1);
    expect(variables.get("A_VARIABLE")).toEqual("Hi");
  });

  test("request to get variables fails", async () => {
    axiosMock.onGet(getEnvVarsEndpoint).networkErrorOnce();

    const variables = await getEnvVariables();

    expect(console.error).toHaveBeenCalled();
    expect(variables.get("ERROR")).toEqual("ERROR");
  });
});