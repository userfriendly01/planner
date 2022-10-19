import { getStartupProfiles } from "authentication";

export const runAlohaFlowStartup = (dispatch: any) => {
  /* Please add new service calls to the end of this Promise.all,
  the existing order is important */
  return Promise.all([
    Promise.resolve(getStartupProfiles().ALOHA_FLOW.name)
  ]);
};