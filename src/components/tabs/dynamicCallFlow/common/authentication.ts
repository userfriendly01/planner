import { readWriteAccess } from "utils/alohaConfigUtils";
import { ADGroupPermission } from "globals/interfaces";
import { env } from "globals/index";

export function userHasReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return env.APP_ENV === "local" ? true : readWriteAccess(permissions, role);
}

export function userDoesNotHaveReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return !readWriteAccess(permissions, role);
}