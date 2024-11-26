import {
  Application, Rule
} from "@lmig/cct-shared-rules-sdk";
import {
  Action,
  DBList
}from "globals/interfaces";
import { getPaginatedResults } from "utils/graphUtils";
import { logger } from "utils/logger";

export const loadRulesState = async (dispatch: (action: Action) => void): Promise<void> => {
  await Promise.all([
    listRules(dispatch),
    listRuleRelationships(dispatch),
    listApplications(dispatch)
  ]);
};

/**
 * This helper function gets all the rules using pagination. If there's a next token, it will
 * concatenate all the rules
 * 
 * @param dispatch - AppState Dispatch function
 * @returns - The first query's promise
 */

export const listRules = async (dispatch: (action: Action) => void): Promise<DBList<Rule>> => {
  try {
    await getPaginatedResults("Rule", dispatch);
    return;
  } catch(error) {
    logger.error("Failed to fetch rules from graph", { error });
    throw ({
      error,
      msg: "Failed to fetch rules from graph"
    });
  }
};

/**
 * This helper function gets all the rules in relation to application using pagination. If there's a next token, it will
 * concatenate all the relationships
 * 
 * @param dispatch - AppState Dispatch function
 * @returns - The first query's promise
 */

export const listRuleRelationships = async (dispatch: (action: Action) => void): Promise<DBList<Rule>> => {
  try {
    await getPaginatedResults("RuleRelationship", dispatch);
    return;
  } catch(error) {
    logger.error("Failed to fetch rule relationships from graph", { error });
    throw ({
      error,
      msg: "Failed to fetch rule relationships from graph"
    });
  }
};

/**
 * This helper function gets all the applications using pagination. If there's a next token, it will
 * concatenate all the applications
 * 
 * @param dispatch - AppState Dispatch function
 * @returns - The first query's promise
 */

export const listApplications = async (dispatch: (action: Action) => void): Promise<DBList<Application>> => {
  try {
    await getPaginatedResults("Application", dispatch);
    return;
  } catch(error) {
    logger.error("Failed to fetch applications from graph", { error });
    throw ({
      error,
      msg: "Failed to fetch applications from graph"
    });
  }
};