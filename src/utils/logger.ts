import { datadogRum } from "@datadog/browser-rum";
import {
  datadogLogs, StatusType
} from "@datadog/browser-logs";
import { client, v2 } from "@datadog/datadog-api-client";
import { LogsApi } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2';
import { getEnvVariables } from "./getEnvVariables";

const DATADOG_SITE = "datadoghq.com";
const DATADOG_USE_SECURE_SESSION_COOKIE = true;
const DATADOG_SAMPLE_RATE = 100;
const DATADOG_REPLAY_SAMPLE_RATE = 0;
const DATADOG_SILENT_MULTIPLE_INIT = true;
const APP_ORG_TAG = "[CCT]";
const SERVICE_NAME = "cicct-softphone-admin-ui";

// Helper Function to start up RUM for automatic event collection
export const initDataDogRum = (): void => {
  getEnvVariables()
    .then(env => {
      const TROUX_ID = env.get("TROUX_ID");
      const DATADOG_APPLICATION_ID = env.get("DATADOG_APPLICATION_ID");
      const DATADOG_CLIENT_TOKEN = env.get("DATADOG_CLIENT_TOKEN");
      const APP_ENV = env.get("APP_ENV");

      datadogRum.setGlobalContextProperty("troux_uuid", TROUX_ID);
      datadogRum.init({
        applicationId: DATADOG_APPLICATION_ID,
        clientToken: DATADOG_CLIENT_TOKEN,
        site: DATADOG_SITE,
        service: SERVICE_NAME,
        env: APP_ENV,
        useSecureSessionCookie: DATADOG_USE_SECURE_SESSION_COOKIE,
        sessionSampleRate: DATADOG_SAMPLE_RATE,
        silentMultipleInit: DATADOG_SILENT_MULTIPLE_INIT,
        sessionReplaySampleRate: DATADOG_REPLAY_SAMPLE_RATE,
        defaultPrivacyLevel: "mask"
      });
    });
};

export const fetchLogsFromDataDog = (): void => {
  const apiInstanceDD = new v2.LogsApi(client.createConfiguration());
  const formatTimeZone = (timestamp: Date) => {
    const timeEst = timestamp.toLocaleString('en-gb', {
      timeZone: 'America/New_York',
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }); // "15/08/2023, 20:12:31 PM"

    const split = timeEst.split(","); // ['15/08/2023', ' 17:13:05']
    const time = split[1].trim(); // '17:13:05'
    const splitDate = split[0].split('/'); // ['15', '08', '2023']
    const day = splitDate[0];
    const month = splitDate[1];
    const year = splitDate[2]

    const formattedTime = `${year}-${month}-${day}T${time}:00`; // 2023-06-07T17:13:05.00
    return formattedTime
  };

  const to = formatTimeZone(new Date());
  const from = formatTimeZone(new Date(new Date().getTime() - 15 * 60000));

  const params: v2.LogsApiListLogsRequest = {
    body: {
      filter: {
        query: "lm_app:aws-cct-shared-admin-service @sharedAdminAPILog n0263786 Final Results lm_app_env:test",
        from,
        to,
      },
      sort: "timestamp",
      page: {
        limit: 5,
      },
    },
  };

  apiInstanceDD
    .listLogs(params)
    .then((data: v2.LogsListResponse) => {
      console.log(
        "FAITH API called successfully. Returned data: " + JSON.stringify(data)
      );
    })
    .catch((error: any) => console.error("FAITH", error));
}

export class Logger {
  private defaultContext: Record<string, unknown>;
  private apiInstanceDD: LogsApi;

  constructor() {
    this.init();
  }

  private init() {
    getEnvVariables()
      .then(env => {
        const DATADOG_CLIENT_TOKEN = env.get("DATADOG_CLIENT_TOKEN");
        const APP_ENV = env.get("APP_ENV");

        this.defaultContext = {
          component: SERVICE_NAME,
          tags: {
            lm_org: "cct",
            deployment_guid: process.env.DEPLOYMENT_GUID,
            cct_squad: "tpod",
            cct_domain: "shared"
          }
        };

        datadogLogs.init({
          clientToken: DATADOG_CLIENT_TOKEN,
          site: DATADOG_SITE,
          env: APP_ENV,
          service: SERVICE_NAME,
          forwardErrorsToLogs: true,
          sampleRate: DATADOG_SAMPLE_RATE,
          useSecureSessionCookie: DATADOG_USE_SECURE_SESSION_COOKIE,
          silentMultipleInit: DATADOG_SILENT_MULTIPLE_INIT
        });

        datadogLogs.setLoggerGlobalContext({
          ...this.defaultContext,
          component: "global"
        });
      });
  }


  private sendLogToDataDog(message: string, body: Record<string, unknown>, level: StatusType): void {
    const messageContext = Object.assign(body, this.defaultContext);
    const dataDogMessage = `${message} ${JSON.stringify(body)}`;

    messageContext["log"] = {
      message
    };

    datadogLogs.logger.log(dataDogMessage, messageContext, level);
  }

  /**
   * logger.log
   * Logs only to native console
   * 
   * @param {string} message - The message to be logged
   * @param {object} body - The log context, all information 
   * should be included in an object
   * @param {boolean} sendToDataDog - If this should be sent to Data Dog
   */
  log(message: string, ...args: any[]): void {
    console.log(`${APP_ORG_TAG}: ${message}`, ...args);
  }

  /**
   * logger.info
   * Logs both to native console and datadog
   * 
   * @param {string} message - The message to be logged
   * @param {object} body - The log context, all information 
   * should be included in an object
   * @param {boolean} sendToDataDog - If this should be sent to Data Dog
   */
  info(message: string, body: Record<string, unknown>, sendToDataDog = true): void {
    try {
      console.info(`${APP_ORG_TAG}: ${message}`, body);

      if (sendToDataDog) {
        this.sendLogToDataDog(message, body, "info");
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * logger.warn
   * Logs both to native console and datadog
   * 
   * @param {string} message - The message to be logged
   * @param {object} body - The log context, all information 
   * should be included in an object
   * @param {boolean} sendToDataDog - If this should be sent to Data Dog
   */
  warn(message: string, body: Record<string, unknown>, sendToDataDog = true): void {
    try {
      console.warn(`${APP_ORG_TAG}: ${message}`, body);

      if (sendToDataDog) {
        this.sendLogToDataDog(message, body, "warn");
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * logger.error
   * Logs both to native console and datadog
   * 
   * @param {string} message - The message to be logged
   * @param {object} body - The log context, all information 
   * should be included in an object
   * @param {boolean} sendToDataDog - If this should be sent to Data Dog
   */
  error(message: string, body: Record<string, unknown>, sendToDataDog = true): void {
    try {
      console.error(`${APP_ORG_TAG}: ${message}`, body);

      if (sendToDataDog) {
        this.sendLogToDataDog(message, body, "error");
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export const logger = new Logger();
