import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { areSkillsDifferent } from "utils/skillsUtils";
import {
  Action,
  DBList,
  UMOffice,
  UMManager,
  UMUser,
  GraphData,
  UpdateOrCreateUMUser
}from "globals/interfaces";
import { LIST_MANAGERS }from "globals/manager";
import { LIST_RULES } from "globals/rules";
import {
  LIST_INACTIVE_USERS, LIST_USERS
}from "globals/user";
import {
  logger
} from "utils/logger";
import { LIST_SOFTPHONE_CONFIG } from "globals/graphql/profile";

export const getGraphData = (type: string): GraphData => {
  switch (type) {
    case LIST_USERS.type:
      return LIST_USERS;
    case LIST_INACTIVE_USERS.type:
      return LIST_INACTIVE_USERS;
    case LIST_MANAGERS.type:
      return LIST_MANAGERS;
    case LIST_RULES.type:
      return LIST_RULES;
    case LIST_SOFTPHONE_CONFIG.type:
      return LIST_SOFTPHONE_CONFIG;
    default:
      throw `Type of ${type} is not a valid list type`;
  }
};

export const getPaginatedResults = async (
  type: string,
  dispatch: (action: Action) => void,
  formatResults?: {[key: string]: (items: unknown[]) => unknown[]}
): Promise<unknown[]> => {
  const graph: GraphData = getGraphData(type);
  let isFirstPage = true;
  const finalResults: unknown[] = [];
  const variables: {[key: string]: boolean | string} = {};

  graph.responsePaths?.forEach((v => {
    variables[`${v}Bool`] = true;
    variables[`${v}NextToken`] = null;
  }));


  const getPageResults = async (): Promise<VoidFunction> => {
    try {
      const { data }: any  = await apolloClient.query<{ results: DBList<unknown | null> }>({
        query: graph.query,
        variables
      });

      const finalResult: { [key: string]: unknown[]} = {};
      graph.responsePaths.forEach(((v: string) => {
        if(data[v]){
          const items: unknown[] = data[v].items.slice();
          if(formatResults && formatResults[v]){
            finalResult[v] = formatResults[v](items);
          } else {
            finalResult[v] = items;
          }
          dispatch(({
            type: `loadPaginatedResults${type}`,
            payload: {
              results: finalResult,
              isFirstPage
            }
          }));
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
      logger.error(`Error thrown getting paginated results for ${type}`, error);
      return Promise.reject(error);
    }
  };

  await getPageResults();
  return finalResults;
};


//The following functions are temporary until we align the app & reducers to the new graph

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