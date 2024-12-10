import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { areSkillsDifferent } from "utils/skillsUtils";
import {
  Action,
  DBList,
  UMUser,
  GraphData,
  UpdateOrCreateUMUser
}from "globals/interfaces";
import { logger } from "utils/logger";

interface GqlQuery {
  definitions: {
    variableDefinitions: {
     variable: {
      name: {
        value: string
      }
     }
    }[]
    selectionSet: {
      selections: {
        alias: {
          value: string
        }
      }[]
    }
  }[]
}
const validatePaginatedGraphRequest = (graphData: GraphData, expectedVariables: string[]) => {
  const gqlQuery: GqlQuery = graphData.query;
  const aliases = gqlQuery.definitions[0].selectionSet.selections.map(s => s.alias.value);

  if(aliases.sort().toString() !== graphData.responsePaths.sort().toString()){
    const message = "Please review your graph gql query. The responsePath variables do not match the query aliases.";
    const details = {
      type: graphData.type,
      queryAliases: aliases,
      responsePaths: graphData.responsePaths
    };
    logger.error(message, details);
    throw {
      message,
      details
    };
  }

  const variables = gqlQuery.definitions[0].variableDefinitions.map(v => v.variable.name.value);

  if(variables.sort().toString() !== expectedVariables.sort().toString()){
    const message = "Please review your graph gql query. The nextTokens are not setup as expected.";
    const details = {
      type: graphData.type,
      graphNextTokens: variables,
      expectedNextTokens: expectedVariables
    };
    logger.error(message, details);
    throw {
      message,
      details
    };
  }
};

/**
 * 
 * @param graph 
 * @param dispatch 
 * @param formatResults 
 * @returns an object containing the final graph results for each of your response paths as keys
 * 
 * @description
 * This function is meant to be used for all graph calls and will incorporate the next token dynamically.
 * It requires a GraphData type and dispatch function.
 * 
 * @implementation
 * Create a Graph Data Object to pass into the method. 
 *     - The 'type' will represent the collection of graph queries listed within the query.
 *     - The response paths MUST match the response variables set within the query.
 *     - Your query should include 2 variables for each response path Next Token following the below format
 *        - `${v}Bool`
          - `${v}NextToken`
 * Create a reducer function that follows the naming pattern `loadPaginatedResults${graph.type}`. 
 *     - This will receive an object with each of the response paths listed in the Graph Data
 *       with the paginated data
 * Call this function with your GraphData object and dispatch function to call your new reducer
 * 
 * @example
 * Example GraphData. Make sure these all match!!
 *    - nextToken prefix (2 each)
 *    - query response variables
 *    - response paths array
 * 
 * export LIST_ANIMALS: GraphData = {
 *  type: "animals",
 *  query: ggl`
*     query listAnimals(
*       $dogsBool: Boolean!,
        $dogsNextToken: String,
        $catsBool: Boolean!,
        $catsNextToken: String,
*     ) {
          dogs: listDogs() {
            items {
              pk
            }
            nextToken
          }
          cats: listCats() {
            items {
              pk
            }
            nextToken
          }
        }
 *    `,
    responsePaths: ["cats", "dogs"]
 * }
 */
export const getPaginatedResults = async (
  graph: GraphData,
  dispatch: (action: Action) => void,
  formatResults?: {[key: string]: (items: unknown[]) => unknown[]}
): Promise<unknown> => {
  let isFirstPage = true;
  const finalResults: { [key: string]: unknown[]} = {};
  const variables: {[key: string]: boolean | string} = {};

  graph.responsePaths?.forEach((v => {
    variables[`${v}Bool`] = true;
    variables[`${v}NextToken`] = null;
  }));

  validatePaginatedGraphRequest(graph, Object.keys(variables));

  const getPageResults = async (): Promise<VoidFunction> => {
    try {
      const { data = {}}: any  = await apolloClient.query<{ results: DBList<unknown | null> }>({
        query: graph.query,
        variables
      });

      const pageResults: { [key: string]: unknown[]} = {};
      graph.responsePaths.forEach(((v: string) => {
        if(data[v]){
          const items: unknown[] = data[v].items.slice();
          if(formatResults && formatResults[v]){
            pageResults[v] = formatResults[v](items);
          } else {
            pageResults[v] = items;
          }
          dispatch(({
            type: `loadPaginatedResults${graph.type}`,
            payload: {
              results: pageResults,
              isFirstPage
            }
          }));
          finalResults[v] = pageResults[v]?.concat(items) || items;
        }
      }));

      if(graph.responsePaths?.some(p => data[p]?.nextToken)){
        graph.responsePaths?.forEach((v => {
          variables[`${v}Bool`] = !!data[v]?.nextToken;
          variables[`${v}NextToken`] = data[v]?.nextToken || null;
        }));
        isFirstPage = false;
        return getPageResults();
      } else {
        return;
      }
    } catch(error) {
      logger.error(`Error thrown getting paginated results for ${graph.type}`, error);
      return Promise.reject(error);
    }
  };

  await getPageResults();
  return finalResults;
};

export const mapWorkerToDbWorker = (worker: Partial<UMUser>): Partial<UpdateOrCreateUMUser> => {
  return {
    ...worker.attributes && {
      twilio_attributes: JSON.stringify({
        ...worker.attributes,
        ...(worker.attributes.profile_id !== null &&
          worker.attributes.profile_id !== undefined && {
          agent_attribute_1: worker.attributes.profile_id
        })
      })
    },
    ...worker.did && {
      did: worker.did
    },
    ...worker.operatingUnitSid && {
      operating_unit_sid: worker.operatingUnitSid
    },
    ...(worker.zeroOutEnabled !== undefined && worker.zeroOutEnabled !== null) && {
      zero_out_enabled: worker.zeroOutEnabled
    },
    ...(worker.selfServiceInd !== undefined && worker.selfServiceInd !== null)  !== undefined && {
      self_service_ind: worker.selfServiceInd
    },
    ...worker.inactiveForwardTo && {
      inactive_forward_to: worker.inactiveForwardTo
    }
  };
};

export const mapWorkerFromDbWorker = (dbWorker: UMUser): UMUser => {
  const parsedAttributes = dbWorker.twilio_attributes
    ? {
      ...dbWorker.twilio_attributes,
      ...dbWorker.twilio_attributes.routing && {
        routing: {
          ...dbWorker.twilio_attributes.routing,
          levels: JSON.parse(dbWorker.twilio_attributes.routing.levels as unknown as string)
        }
      },
      ...dbWorker.twilio_attributes.default_skills && {
        default_skills: {
          ...dbWorker.twilio_attributes.default_skills,
          levels: JSON.parse(dbWorker.twilio_attributes.default_skills.levels as unknown as string)
        }
      },
      ...dbWorker.twilio_attributes.disabled_skills && {
        disabled_skills: {
          ...dbWorker.twilio_attributes.disabled_skills,
          levels: JSON.parse(dbWorker.twilio_attributes.disabled_skills.levels as unknown as string)
        }
      }
    }
    : null;

  const worker = {
    ...dbWorker,
    sid: dbWorker.worker_sid,
    attributes: parsedAttributes,
    operatingUnitSid: dbWorker.operating_unit_sid,
    zeroOutEnabled: dbWorker.zero_out_enabled,
    selfServiceInd: dbWorker.self_service_ind,
    inactiveForwardTo: dbWorker.inactive_forward_to,
    skillsDifferent: parsedAttributes ? areSkillsDifferent(parsedAttributes) : false,
    isConsole: dbWorker.pk.includes("Console")
  };

  if (worker.attributes?.manager_n_number) {
    worker.attributes.manager_n_number = worker.attributes.manager_n_number.toLowerCase();
  }
  //sometimes Twilio flops and cant populate full name - this will be more reliable
  if(worker.attributes?.emp_first_name && worker.attributes?.emp_last_name){
    worker.attributes.full_name = `${worker.attributes?.emp_first_name} ${worker.attributes?.emp_last_name}`;
  }

  // Delete DB Props
  delete worker.twilio_attributes;
  delete worker.operating_unit_sid;
  delete worker.zero_out_enabled;
  delete worker.self_service_ind;
  delete worker.inactive_forward_to;
  delete worker.worker_sid;

  return worker;
};