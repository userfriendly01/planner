import { getStartupProfiles } from "authentication";

export const runAlohaRoutingStartup = (dispatch: any) => {
  return Promise.all([
    Promise.resolve(getStartupProfiles().ALOHA_ROUTE.name)
  ]);
};