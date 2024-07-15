import { readWriteAccess } from "utils/alohaConfigUtils";
import { ADGroupPermission } from "globals/interfaces";
import { env } from "globals/index";

export const DYNAMIC_CALL_FLOW_ROLE = "FlowReadWrite";

export function userHasReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return env.APP_ENV === "local" ? true : readWriteAccess(permissions, role);
}

export function userDoesNotHaveReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return !userHasReadWriteAccess(permissions, role);
}