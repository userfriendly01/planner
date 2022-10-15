import { startupProfiles } from "../authenticationInterfaces";

export const runAlohaFlowStartup = (dispatch: any) => {
  return Promise.all([
    Promise.resolve(startupProfiles.ALOHA_FLOW.name)
  ]);
};