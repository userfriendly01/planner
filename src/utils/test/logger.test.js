import { datadogRum } from "@datadog/browser-rum";
import {
  datadogLogs
} from "@datadog/browser-logs";
import {
  initDataDogRum, Logger
} from "../logger";

jest.mock("@datadog/browser-rum", () => ({
  datadogRum: {
    init: jest.fn(),
    setGlobalContextProperty: jest.fn()
  }
}));

jest.mock("@datadog/browser-logs", () => ({
  datadogLogs: {
    init: jest.fn(),
    setLoggerGlobalContext: jest.fn(),
    logger: {
      log: jest.fn()
    }
  }
}));

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

    afterEach(() => {
      jest.resetAllMocks();
      logger = undefined;
    });

    test("should initialize datadog on create", () => {
      logger = new Logger();

      expect(datadogLogs.init).toHaveBeenCalled();
      expect(datadogLogs.setLoggerGlobalContext).toHaveBeenCalled();
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
      let infoFn;
      let warnFn;
      let errorFn;

      beforeEach(() => {
        infoFn = jest.fn();
        warnFn = jest.fn();
        errorFn = jest.fn();

        console.info = infoFn;
        console.warn = warnFn;
        console.error = errorFn;
      });

      test("should call datadog logger at level $level", () => {
        logger = new Logger();

        const message = `Test that ${level} is working`;
        const body = { id: "test" };

        logger[level](message, body);


        expect(console[level]).toBeCalledWith(`[CCT]: ${message}`, body);
        expect(datadogLogs.logger.log).toHaveBeenCalled();
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