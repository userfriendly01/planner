import { getStartupProfiles } from "authentication/authenticationProfiles";

export const runAlohaRoutingStartup = (dispatch: any) => {
  /* Please add new service calls to the end of this Promise.all,
  the existing order is important */
  return Promise.all([
    Promise.resolve(getStartupProfiles().ALOHA_ROUTE.name)
  ]);
};