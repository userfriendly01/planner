import { Rule } from "@lmig/cct-shared-rules-sdk";
import { LIST_RULES } from "globals/graphql/rules";
import {
  Action,
  DBList
}from "globals/interfaces";
import { getPaginatedResults } from "utils/graphUtils";
import { logger } from "utils/logger";

/**
 * This helper function gets all the rules using pagination. If there's a next token, it will
 * concatenate all the rules
 * 
 * @param dispatch - AppState Dispatch function
 * @returns - The first query's promise
 */

export const listRules = async (dispatch: (action: Action) => void): Promise<DBList<Rule>> => {
  try {
    await getPaginatedResults(LIST_RULES.type, dispatch);
    return;
  } catch(error) {
    logger.error("Failed to fetch rules from graph", { error });
    throw ({
      error,
      msg: "Failed to fetch rules from graph"
    });
  }
};