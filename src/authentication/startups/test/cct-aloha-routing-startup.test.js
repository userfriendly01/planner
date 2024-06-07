import { runAlohaRoutingStartup } from "../cct-aloha-routing-startup";
import MockAdapter from "axios-mock-adapter";
import { useAdminDispatch } from "context/appContext";
import { getStartupProfiles } from "authentication/authenticationProfiles";
import { myAxios } from "utils/myAxios";
import { startups } from "testUtils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("authentication/authenticationProfiles", () => ({
  getStartupProfiles: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminDispatch: jest.fn()
}));

const mockAdminDispatch = jest.fn();

describe("cct-aloha-routing-startup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    getStartupProfiles.mockReturnValueOnce(startups);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
  });

  describe("runAlohaRoutingStartup", () => {
    beforeEach(() => {

    });
    describe("Service Calls are successful", () => {
      test("**MUST RETURN STARTUP NAME FIRST**", async () => {
        const result = await runAlohaRoutingStartup(mockAdminDispatch);
        const firstResponse = result[0];
        expect(firstResponse).toStrictEqual(startups.ALOHA_ROUTE.name);
      });
    });
  });
});