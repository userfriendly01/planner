import { runAlohaFlowStartup } from "../cct-aloha-flow-startup";
import MockAdapter from "axios-mock-adapter";
import { useAdminDispatch } from "context";
import { getStartupProfiles } from "authentication";
import { myAxios } from "utils";
import { startups } from "testUtils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("context", () => ({
  useAdminDispatch: jest.fn()
}));

const mockAdminDispatch = jest.fn();

describe("cct-aloha-flow-startup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    getStartupProfiles.mockReturnValueOnce(startups);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
  });

  describe("runAlohaFlowStartup", () => {
    beforeEach(() => {

    });
    describe("No Service Calls are Required for Aloha Flow Startup", () => {
      test("Should return authentication profile name", async () => {
        const result = await runAlohaFlowStartup(mockAdminDispatch);
        expect(result).toStrictEqual([startups.ALOHA_FLOW.name]);
      });
    });
  });
});