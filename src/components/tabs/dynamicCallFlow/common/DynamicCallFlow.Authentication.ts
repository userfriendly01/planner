import { readWriteAccess } from "utils/alohaConfigUtils";
import {
  ADGroupPermission, ADGroupRole
} from "globals/interfaces";
import { env } from "globals/index";
import { runDynamicCallFlowStartup } from "authentication/startups/cct-dynamic-call-flow-startup";
import {
  AuthenticationProfile, descriptions, Permissions
} from "authentication/authenticationInterfaces";
import DynamicCallFlowPhoneNumberContainer from "dynamicCallFlowPhoneNumber/DynamicCallFlow.PhoneNumber.Container";
import { DYNAMIC_CALL_FLOW_TAB_CONFIGURATION } from "dynamicCallFlowCommon/DynamicCallFlow.Configuration";

export const DYNAMIC_CALL_FLOW_ROLE = "FlowReadWrite";
export const DYNAMIC_CALL_FLOW_STARTUP_PROFILE_NAME = "dynamic-call-flow";

export function userHasReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return env.APP_ENV === "local" ? true : readWriteAccess(permissions, role);
}

export function userDoesNotHaveReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return !userHasReadWriteAccess(permissions, role);
}

export const DynamicCallFlowADGroupRoleRead: ADGroupRole = {
  name: "FlowRead",
  permissionLevel: Permissions.READ
};

export const DynamicCallFlowADGroupRoleReadWrite: ADGroupRole = {
  name: "FlowReadWrite",
  permissionLevel: Permissions.WRITE
};

export const DynamicCallFlowStartUpProfile = {
  name: DYNAMIC_CALL_FLOW_STARTUP_PROFILE_NAME,
  function: runDynamicCallFlowStartup
};
Object.freeze(DynamicCallFlowStartUpProfile);


export const DynamicCallFlowAuthenticationProfile: AuthenticationProfile = {
  name: "Dynamic Call Flow",
  home: DynamicCallFlowPhoneNumberContainer,
  permissionLevel: Permissions.READ,
  tabs: [
    DYNAMIC_CALL_FLOW_TAB_CONFIGURATION
  ]
};
Object.freeze(DynamicCallFlowAuthenticationProfile);

export const DynamicCallFlowADGroupPermission: ADGroupPermission = {
  roles: [ DynamicCallFlowADGroupRoleRead, DynamicCallFlowADGroupRoleReadWrite ],
  startup: DynamicCallFlowStartUpProfile,
  description: descriptions.Dynamic_Call_Flow,
  authenticationProfile: DynamicCallFlowAuthenticationProfile
};
Object.freeze(DynamicCallFlowADGroupPermission);