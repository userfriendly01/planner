import { startupProfiles } from "../authenticationInterfaces";

export const runAlohaRoutingStartup = (dispatch: any) => {
  return Promise.all([
    Promise.resolve(startupProfiles.ALOHA_ROUTE.name)
  ]);
};