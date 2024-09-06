import { getStartupProfiles } from "../authenticationProfiles";

export const runDynamicCallFlowStartup = (dispatch: any) => {
  /* Please add new service calls to the end of this Promise.all,
  the existing order is important */
  return Promise.all([
    Promise.resolve(getStartupProfiles().DYNAMIC_CALL_FLOW.name)
  ]);
};