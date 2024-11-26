import { Rule as SdkRule } from "@lmig/cct-shared-rules-sdk";

export interface Rule extends SdkRule {
  applications: string[]
}
