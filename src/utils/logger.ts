import { datadogRum } from "@datadog/browser-rum";
import {
  datadogLogs, StatusType
} from "@datadog/browser-logs";
import { env } from "globals";

const DATADOG_SITE = "datadoghq.com";
const DATADOG_USE_SECURE_SESSION_COOKIE = true;
const DATADOG_SAMPLE_RATE = 100;
const DATADOG_REPLAY_SAMPLE_RATE = 0;
const DATADOG_SILENT_MULTIPLE_INIT = true;
const APP_ORG_TAG = "[CCT]";
const SERVICE_NAME = "cicct-softphone-admin-ui";

// Helper Function to start up RUM for automatic event collection
export const initDataDogRum = (): void => {
  datadogRum.setGlobalContextProperty("troux_uuid", env.TROUX_ID);
  datadogRum.init({
    applicationId: env.DATADOG_APPLICATION_ID,
    clientToken: env.DATADOG_CLIENT_TOKEN,
    site: DATADOG_SITE,
    service: SERVICE_NAME,
    env: env.APP_ENV,
    useSecureSessionCookie: DATADOG_USE_SECURE_SESSION_COOKIE,
    sessionSampleRate: DATADOG_SAMPLE_RATE,
    silentMultipleInit: DATADOG_SILENT_MULTIPLE_INIT,
    sessionReplaySampleRate: DATADOG_REPLAY_SAMPLE_RATE,
    defaultPrivacyLevel: "mask"
  });
};

export class Logger {
  private defaultContext: Record<string, unknown>;

  constructor() {
    this.init();
  }

  private init() {
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
      clientToken: env.DATADOG_CLIENT_TOKEN,
      site: DATADOG_SITE,
      env: env.APP_ENV,
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
