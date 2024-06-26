import { readWriteAccess } from "utils/alohaConfigUtils";
import { ADGroupPermission } from "globals/interfaces";
import { env } from "globals/index";

//TODO: Need to configure Dynamic Call Flow tabs to use the new permissions
export function userHasReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return env.APP_ENV === "local" ? true : readWriteAccess(permissions, role);
}

export function userDoesNotHaveReadWriteAccess(permissions: Array<ADGroupPermission>, role: string): boolean {
  return !readWriteAccess(permissions, role);
}