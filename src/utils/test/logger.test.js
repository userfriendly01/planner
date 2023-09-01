import { datadogRum } from "@datadog/browser-rum";
import {
  datadogLogs
} from "@datadog/browser-logs";
import {
  initDataDogRum, Logger
} from "../logger";

describe("logger", () => {
  describe("initDataDogRum", () => {
    test("should initialize datadog appropriately", () => {
      initDataDogRum();

      expect(datadogRum.setGlobalContextProperty).toHaveBeenCalled();
      expect(datadogRum.init).toHaveBeenCalled();
    });
  });


  describe("Logger", () => {
    let logger;

    beforeEach(() => {
      console.log = jest.fn();
      console.info = jest.fn();
      console.warn = jest.fn();
      console.error = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
      logger = undefined;
    });

    test("should initialize datadog on create", () => {
      logger = new Logger();

      expect(datadogLogs.init).toHaveBeenCalled();
      expect(datadogLogs.setLoggerGlobalContext).toHaveBeenCalled();
    });

    test("should not call datadog when level is log", () => {
      logger = new Logger();

      const message = "Test that log is working";
      const body = { id: "test" };

      logger.log(message, body);

      expect(console.log).toBeCalledWith(`[CCT]: ${message}`, body);
      expect(datadogLogs.logger.log).not.toHaveBeenCalled();
    });

    describe.each([
      {
        level: "info"
      },
      {
        level: "warn"
      },
      {
        level: "error"
      }
    ])("$level", ({
      level
    }) => {
      test("should call datadog logger at level $level", () => {
        logger = new Logger();

        const message = `Test that ${level} is working`;
        const body = { id: "test" };

        logger[level](message, body);


        expect(console[level]).toBeCalledWith(`[CCT]: ${message}`, body);
        expect(datadogLogs.logger.log).toHaveBeenCalled();
      });

      test("should not send log to datadog if sendToDataDog is set to false", () => {
        logger = new Logger();

        const message = `Test that ${level} is working`;
        const body = { id: "test" };

        logger[level](message, body, false);


        expect(console[level]).toBeCalledWith(`[CCT]: ${message}`, body);
        expect(datadogLogs.logger.log).not.toHaveBeenCalled();
      });

      test("should log error if datadog function throws an error", () => {
        const error = new Error("Datadog failed to log");

        datadogLogs.logger.log.mockImplementation(() => { throw error; });

        logger = new Logger();

        const message = "An error will occur";
        const body = { };

        logger[level](message, body);

        expect(console.error).toHaveBeenCalledWith(error);
      });
    });

  });
});