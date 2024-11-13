import MockAdapter from "axios-mock-adapter";
import { getTwilioConsoleUsers } from "services/twilioConsoleUsers";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);

jest.mock("globals", () => ({
  apiPaths: {
    GET_TWILIO_CONSOLE_USERS: "console-users"
  }
}));

describe("twilioConsoleUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("getTwilioConsoleUsers", () => {
    test("should return a list of TwilioConsoleUser objects", async () => {
      axiosMock.onGet("console-users").reply(200, []);

      const result = await getTwilioConsoleUsers("token");

      expect(result).toEqual([]);
    });
  });
});
